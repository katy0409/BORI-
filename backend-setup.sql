-- BORI V1.3 Supabase backend setup
-- Run once in Supabase SQL Editor. Safe to re-run for policies/functions.

create extension if not exists pgcrypto;

-- Existing tables are expected from V1.2 setup.
-- Ensure RLS is enabled.
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.book_members enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.messages enable row level security;

-- New user profile trigger (supports email/password signup and OAuth providers like Google)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1),
    'BORI 使用者'
  ))
  on conflict (id) do update set display_name = excluded.display_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Helper: membership check without recursive RLS policy
-- NOTE: must be plpgsql (not sql) — a `language sql` function here can get
-- inlined by the planner, which strips the security definer boundary and
-- causes "infinite recursion detected in policy for relation book_members".
create or replace function public.is_book_member(p_book_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.book_members
    where book_id = p_book_id and user_id = auth.uid()
  );
end;
$$;

-- Helper: does another user share any book with me? (used to scope profile visibility)
-- Same plpgsql requirement as is_book_member above — see note there.
create or replace function public.shares_book_with(p_user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.book_members bm1
    join public.book_members bm2 on bm1.book_id = bm2.book_id
    where bm1.user_id = auth.uid() and bm2.user_id = p_user_id
  );
end;
$$;

-- Join by invite code without exposing private books
create or replace function public.join_book_by_code(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_book_id uuid;
begin
  select id into v_book_id from public.books where upper(invite_code) = upper(trim(p_invite_code));
  if v_book_id is null then return null; end if;
  insert into public.book_members(book_id, user_id, role)
  values(v_book_id, auth.uid(), 'member')
  on conflict(book_id, user_id) do nothing;
  return v_book_id;
end;
$$;
grant execute on function public.join_book_by_code(text) to authenticated;

-- Drop old policies to avoid conflicts
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
drop policy if exists "books_select" on public.books;
drop policy if exists "books_insert" on public.books;
drop policy if exists "books_update" on public.books;
drop policy if exists "members_select" on public.book_members;
drop policy if exists "members_insert" on public.book_members;
drop policy if exists "transactions_select" on public.transactions;
drop policy if exists "transactions_insert" on public.transactions;
drop policy if exists "transactions_update" on public.transactions;
drop policy if exists "transactions_delete" on public.transactions;
drop policy if exists "budgets_select" on public.budgets;
drop policy if exists "budgets_insert" on public.budgets;
drop policy if exists "budgets_update" on public.budgets;
drop policy if exists "messages_select" on public.messages;
drop policy if exists "messages_insert" on public.messages;

create policy "profiles_select" on public.profiles for select to authenticated using (id = auth.uid() or public.shares_book_with(id));
create policy "profiles_update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "books_select" on public.books for select to authenticated using (owner_id = auth.uid() or public.is_book_member(id));
create policy "books_insert" on public.books for insert to authenticated with check (owner_id = auth.uid());
create policy "books_update" on public.books for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "members_select" on public.book_members for select to authenticated using (user_id = auth.uid() or public.is_book_member(book_id));
create policy "members_insert" on public.book_members for insert to authenticated with check (user_id = auth.uid());
create policy "transactions_select" on public.transactions for select to authenticated using (public.is_book_member(book_id));
create policy "transactions_insert" on public.transactions for insert to authenticated with check (user_id = auth.uid() and public.is_book_member(book_id));
create policy "transactions_update" on public.transactions for update to authenticated using (user_id = auth.uid() and public.is_book_member(book_id));
create policy "transactions_delete" on public.transactions for delete to authenticated using (user_id = auth.uid() and public.is_book_member(book_id));
create policy "budgets_select" on public.budgets for select to authenticated using (public.is_book_member(book_id));
create policy "budgets_insert" on public.budgets for insert to authenticated with check (created_by = auth.uid() and public.is_book_member(book_id));
create policy "budgets_update" on public.budgets for update to authenticated using (public.is_book_member(book_id)) with check (public.is_book_member(book_id));
create policy "messages_select" on public.messages for select to authenticated using (public.is_book_member(book_id));
create policy "messages_insert" on public.messages for insert to authenticated with check (user_id = auth.uid() and public.is_book_member(book_id));

-- Add chat + ledger tables to realtime publication, ignoring duplicate errors.
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.transactions;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.budgets;
exception when duplicate_object then null;
end $$;

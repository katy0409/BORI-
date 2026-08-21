# BORI V1.6.0 — Production Cloud Life

這是一般使用者正式版：使用者不需要輸入 Supabase Key。

## 專案擁有者只需設定一次

開啟 `config.js`，把：

`PASTE_YOUR_PUBLISHABLE_KEY_HERE`

換成 Supabase 的 **Publishable Key**。請勿使用 Secret Key。

完成後把整個 `bori-app` 上傳 GitHub。一般使用者開啟 BORI 時只會看到註冊與登入。

## 後端

第一次部署仍需在 Supabase SQL Editor 執行 `backend-setup.sql`。

## 成員暱稱與收入隱私修正

既有專案請在 Supabase SQL Editor 執行一次 `supabase-fix-member-privacy.sql`。
這會讓同一房間的成員能顯示彼此暱稱，並在資料庫層阻止其他成員讀取已開啟「隱藏我的帳戶餘額」者的收入紀錄。

## V1.6 升級

依序執行 `supabase-v1.5-upgrade.sql`、`supabase-v1.6-upgrade.sql`。詳細步驟與管理者 Email 設定請見 `UPDATE-INSTRUCTIONS.md`。

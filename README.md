# BORI V1.3.4 — Production Cloud Life

這是一般使用者正式版：使用者不需要輸入 Supabase Key。

## 專案擁有者只需設定一次

開啟 `config.js`，把：

`PASTE_YOUR_PUBLISHABLE_KEY_HERE`

換成 Supabase 的 **Publishable Key**。請勿使用 Secret Key。

完成後把整個 `bori-app` 上傳 GitHub。一般使用者開啟 BORI 時只會看到註冊與登入。

## 後端

第一次部署仍需在 Supabase SQL Editor 執行 `backend-setup.sql`。

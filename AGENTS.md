<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 專案狀態（2026-05-10）

這是一個旅遊行程共享 App，目前處於**旅行前最後準備階段**（出發日 2026-05-12）。

## 已完成功能
- 8 天完整靜態行程（`data/itinerary.ts`），含交通、餐廳、景點、文史知識
- 動態新增 / 編輯 / 刪除行程（Firestore `activities`）
- 三人即時拆帳 + 結算（Firestore `expenses`）
- 每日旅遊日記（Firestore `journal`）
- 各景點心情 emoji（Firestore `activityMoods`）
- 行前準備清單 40 項（Firestore `checklist`）
- 危機處理錦囊（護照遺失、熱衰竭）
- 購物願望清單（Firestore `wishlist`）
- 各天 Google Drive 相簿連結（`data/driveLinks.ts`）
- 文史知識延伸閱讀連結（`ActivityDetails.culturalNoteRef`）
- 使用說明頁（`/help`）

## 旅程結束後待開發
- **旅行回顧頁**：整合三人日記、景點心情 emoji、Google Drive 相簿，作為給同行者的驚喜禮物
  - 資料來源：`journal`、`activityMoods`、`driveLinks`、`itinerary.ts`
  - 定位：數位紀念冊 + 影片剪輯腳本參考

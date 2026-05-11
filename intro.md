# graTravel

YY・Wei・Rae 三人 2026/05/12–05/19 日本旅遊共享 App（桃園 → 京都 → 大阪）。

Live: **gra-travel.vercel.app**

---

## 功能

| 功能 | 說明 |
|------|------|
| 行程 | 8 天靜態行程（文史知識、餐廳推薦、交通資訊）+ 動態新增 / 編輯 |
| 拆帳 | 三人即時費用記錄，最少筆數結算演算法 |
| 購物清單 | 按景點 / 日期分類，可標記已購買 |
| 行前清單 | 63 項行前準備，三人各自打勾進度 |
| 日記 | 每日三人旅遊日記，即時同步 |
| 心情 | 各景點 emoji 心情標記（per-member） |
| 危機錦囊 | 護照遺失、熱衰竭緊急處理步驟 |

---

## 成員 & 登入

| 帳號 | 成員 |
|------|------|
| yy@gmail.com | YY |
| wei@gmail.com | Wei |
| rae@gmail.com | Rae |

Firebase Email/Password 認證，登入後即可使用全部功能。

---

## 技術棧

| 層面 | 選擇 |
|------|------|
| Framework | Next.js 16.2.4（App Router + Turbopack） |
| Language | TypeScript 5.9.3 |
| Styling | Tailwind CSS 4（PostCSS plugin，無 config 檔） |
| 資料庫 | Firebase Firestore（即時同步，asia-northeast1） |
| 認證 | Firebase Authentication |
| 部署 | Vercel（main 分支自動部署） |

---

## 目錄結構

```
app/          頁面（itinerary, expenses, checklist, wishlist, help, login）
components/   可重用元件（ActivityItem, MoodPicker, CulturalNoteModal…）
data/         靜態資料（itinerary.ts, checklist.ts, members.ts, categories.ts…）
lib/          Firebase 初始化、AuthContext、結算演算法
types/        共用 TypeScript 型別
info/         各天行程 Markdown 參考資料（唯讀，不影響 App）
```

---

## 本地開發

```bash
npm install
npm run dev   # http://localhost:3000
```

環境變數（`.env.local`）需填入 Firebase 設定：

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## 旅程結束後（待開發）

旅行回顧頁：整合三人日記、景點心情 emoji、Google Drive 相簿，作為數位紀念冊。

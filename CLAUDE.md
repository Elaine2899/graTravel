@AGENTS.md

# graTravel 專案背景

YY、Wei、Rae 三人 2026/05/12–05/19 赴日旅行（桃園→京都→大阪）的共享 Web App。出發前一週可用，涵蓋行程瀏覽、三人即時拆帳、購物清單、行前準備清單。

## 技術棧

| 層面 | 選擇 |
|------|------|
| Framework | Next.js 16.2.4 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind CSS 4 |
| 資料庫 | Firebase Firestore（即時同步） |
| 認證 | Firebase Authentication（Email/Password） |
| 部署 | Vercel（gra-travel.vercel.app） |

## 關鍵目錄與檔案

```
app/
  itinerary/page.tsx     行程主頁（8 day tab + 靜態+動態 activities）
  expenses/page.tsx      拆帳清單 + 結算
  expenses/add/page.tsx  新增費用（含 activityId、category）
  expenses/edit/page.tsx 編輯費用
  checklist/page.tsx     行前準備清單
  wishlist/page.tsx      購物願望清單
  reservations/add/      新增訂位/票券
  login/page.tsx         登入頁

components/
  ActivityItem.tsx       可折疊行程卡（含心情、花費、記帳按鈕）
  GroupTabs.tsx          Day 3 分組 tab（宇治稻荷組 / 東京巨蛋組）
  MoodPicker.tsx         心情 emoji 選擇浮層（createPortal）
  PlacesModal.tsx        備選地點 modal（含動態新增）
  CulturalNoteModal.tsx  文史知識底部彈窗
  WishlistActivityModal  景點內購物清單
  JournalSection.tsx     每日旅遊日記
  ReservationSection.tsx 訂位/票券記錄
  WishlistDaySection.tsx 當日購物清單
  ExpenseItem.tsx        單筆費用卡
  SettlementSummary.tsx  結算清單
  BottomNav.tsx          底部導航（4 tabs）
  AuthGuard.tsx          未登入自動跳轉 /login

data/
  itinerary.ts    8 天完整靜態行程資料（主要編輯對象）
  checklist.ts    行前清單 13 項靜態資料
  categories.ts   消費類別（7 種）
  members.ts      ['YY', 'Wei', 'Rae']

info/            各天行程 MD 參考資料（唯讀，用來核對 itinerary.ts）
lib/
  firebase.ts    Firestore + Auth 初始化
  AuthContext.tsx 登入狀態 Context
  settlement.ts  最小轉帳筆數結算演算法
types/index.ts   共用型別定義
```

## Firestore Collections

| Collection | 用途 |
|---|---|
| `expenses` | 拆帳記錄（含 activityId, category, splits） |
| `activities` | 動態新增行程 |
| `activityMoods` | 各活動心情 emoji（per-member） |
| `dynamicPlaces` | 各活動動態備選地點 |
| `wishlist` | 購物願望清單 |
| `journal` | 每日日記（dayNumber doc） |
| `reservations` | 訂位/票券記錄 |
| `checklist` | 行前清單打勾狀態（per-member doc） |

## 成員

YY / Wei / Rae — 定義於 `data/members.ts`
Email → Member 對應：`getMemberFromEmail()` in `data/members.ts`

## 常見開發模式

- **即時資料**：`onSnapshot` 訂閱 → `useState` 儲存，多數在 `app/itinerary/page.tsx` 集中訂閱後以 props 傳下
- **Modal / 浮層**：用 `createPortal` 掛到 `document.body`（MoodPicker, PlacesModal 等），避免 overflow 裁切
- **useSearchParams 頁面**：一律包 `<Suspense>` wrapper（expenses/add, expenses/edit, reservations/add）
- **需登入頁面**：以 `<AuthGuard>` 包裝
- **Day 3 分組**：`activity.group` = `'all' | 'YY+Rae' | 'Wei'`，由 `GroupTabs` 處理切換

## 注意事項

- `info/` 目錄為唯讀參考資料，不會影響 App 運作；實際行程資料在 `data/itinerary.ts`
- 心情 emoji 是 per-activity（`activityMoods/{activityId}`），不是 per-day
- 費用可連結到活動（`activityId` 欄位），連結後該活動卡片顯示總花費

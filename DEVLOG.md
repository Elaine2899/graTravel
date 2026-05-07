# graTravel 開發日誌

記錄從無到有的開發流程，供未來回顧或擴充參考。

---

## 2026-05-05 — 初始規劃與建置

### 背景
YY、Wei、Rae 三人 2026/05/12–05/19 赴日旅行（桃園→京都→大阪），距出發僅一週。
資料夾中已有 `journey.md`、`flight.md`、`hotel.md`、`func.md` 作為素材。

### 技術決策
- **平台**：Web App（Next.js），三人無需安裝，開網址即可用
- **共享記帳**：Firebase Firestore 即時同步（三人都能輸入、即時看到）
- **部署**：Vercel，連結 GitHub 自動部署

### 技術棧
| 層面 | 選擇 |
|------|------|
| Framework | Next.js 16.2.4 + TypeScript |
| Styling | Tailwind CSS 4 |
| 資料庫 | Firebase Firestore |
| 認證 | Firebase Authentication (Email/Password) |
| 部署 | Vercel |

### 開發環境問題與解法
- **問題**：Node.js 尚未安裝
  - **解法**：用 Homebrew 安裝 Node 25.9.0
- **問題**：`create-next-app` 不接受含大寫的目錄名稱（`graTravel`）
  - **解法**：在 `/tmp/gratravel` 建立後 `cp` 回來
- **問題**：Node 25 + npm 11 的 `.bin/` 目錄下的 binary 不是 symlink，相對路徑失效
  - **解法**：`package.json` scripts 改為 `node node_modules/next/dist/bin/next`

### 架構設計
```
app/
  itinerary/         行程頁（靜態資料，SSG）
    [day]/           單日頁（現重定向至主頁）
  expenses/          拆帳頁（Firestore 即時，需登入）
    add/             新增費用
  login/             登入頁
  layout.tsx         底部導航 + AuthProvider
components/
  BottomNav          行程 / 拆帳 底部切換
  ActivityItem       可折疊行程卡
  CulturalNoteModal  文史知識底部彈窗
  GroupTabs          Day 3 分組 tab（宇治·稻荷組 / 東京巨蛋組）
  ExpenseItem        單筆費用卡（含刪除確認）
  SettlementSummary  結算清單
  AuthGuard          未登入自動跳轉 /login
data/
  itinerary.ts       8 天完整靜態行程資料（由 MD 檔整理）
  members.ts         ['YY', 'Wei', 'Rae']
lib/
  firebase.ts        Firestore + Auth 初始化
  AuthContext.tsx    登入狀態 Context
  settlement.ts      最小轉帳筆數結算演算法
types/index.ts       共用型別定義
```

### 資料模型
**Expense（Firestore）**
```ts
{
  amount: number          // 日幣總金額
  item: string            // 品項名稱
  paidBy: 'YY'|'Wei'|'Rae'
  splitAmong: Member[]    // 均分時使用
  splits?: Record<Member, number>  // 自訂分帳時使用（各人精確金額）
  createdAt: Timestamp
}
```

### 結算演算法
1. 計算每人淨差額（實際付出 - 應分擔）
2. 正數 = 別人欠他；負數 = 他欠別人
3. Two-pointer greedy 最小化轉帳筆數

---

## 2026-05-05 — Firebase 設定

- Firebase 專案：`gratravel-e3529`
- Firestore 地區：asia-northeast1（大阪）
- 初始規則 `if true` → 發現安全疑慮，改為 `request.auth != null`
- 啟用 Email/Password 認證，為 YY、Wei、Rae 手動建立帳號

---

## 2026-05-05 — UI 優化

### 行程頁改版
- **需求**：從日清單點進單日頁，改為 header tab 左右滑動切換
- **實作**：`/itinerary/page.tsx` 改為 client component，sticky header 含 8 個 day tab
- **預設 day**：比對當日與旅程日期（5/12–5/19）計算，旅行中自動顯示當日行程
- `/itinerary/[day]` 改為直接 redirect 回主頁

---

## 2026-05-05 — 部署

- GitHub repo：https://github.com/Elaine2899/graTravel.git
- 推送 main branch，Vercel 連結 GitHub 自動建置
- Firebase Auth 授權網域新增：`gra-travel.vercel.app`
- 正式網址：**gra-travel.vercel.app**

---

## 2026-05-06 — 功能擴充

### 拆帳功能
1. **刪除記錄**：ExpenseItem 加垃圾桶 icon，點擊後顯示確認/取消按鈕，確認後呼叫 Firestore `deleteDoc`
2. **不均等分帳**：
   - 新增費用頁加「均分 / 自訂金額」切換
   - 自訂模式：每位成員各自輸入負擔金額
   - 顯示即時差額（還剩 / 超出），金額不符時禁止儲存
   - `Expense` 型別新增 `splits?: Partial<Record<Member, number>>`
   - 結算演算法同步更新，支援 custom splits

### 行程頁
- **文史知識移出主畫面**：ActivityItem 展開後不再直接顯示 culturalNote
- 改為「📖 文史知識」按鈕，點擊後開啟 `CulturalNoteModal`（底部彈窗）
- 彈窗支援長文滾動，背景點擊可關閉

---

---

## 2026-05-06 — 拆帳功能擴充（第二波）

### 消費類別標籤
- 新增 `data/categories.ts`：定義 7 種類別（餐飲、交通、門票、購物、住宿、活動、其他），各附 emoji 和顏色
- `Expense` 型別新增 `category?: ExpenseCategory`
- 新增 / 編輯費用表單加入類別選擇器（橫向捲動 pill 按鈕）
- `ExpenseItem` 在品項名稱前顯示類別 tag

### 費用編輯頁 `/expenses/edit`
- 新增 `app/expenses/edit/page.tsx`
- 以 `getDoc` 預載資料（金額、品項、類別、付款人、分帳模式）
- 自動偵測原始資料是否為自訂分帳（檢查 `splits` 欄位是否存在）
- 切回均分模式時送出 `splits: null` 清除 Firestore 欄位
- `ExpenseItem` 新增鉛筆 icon，連結至 `/expenses/edit?id=XXX`
- 頁面以 `Suspense` 包裝（使用 `useSearchParams`）

### 結算換算台幣
- 拆帳頁新增 JPY / TWD 切換按鈕
- 換算匯率約 0.22（硬編碼，供旅途參考用）

---

## 2026-05-07 — 行程頁大升級

### 活動心情 emoji（per-activity）
- 原設計為每日共用心情（`moods/{date}`），改為各活動獨立 emoji 反應
- Firestore collection：`activityMoods/{activityId}` = `{ YY?: string, Wei?: string, Rae?: string }`
- `MoodPicker` 改以 `createPortal` 實作（fixed 定位底部浮層），避免 overflow 裁切問題
- 心情 chips 以 `e.stopPropagation()` 避免觸發卡片展開/收合
- `ActivityItem` 新增 props：`currentMember`、`activityMoods`

### 備選地點動態新增
- `PlacesModal` 改為內部自訂閱 Firestore（`dynamicPlaces where activityId == ...`）
- 新增 inline 表單：類別 pill 選擇 + 名稱 + 備注 + 新增按鈕
- 寫入 `dynamicPlaces/{id}` = `{ activityId, name, category, note, createdAt }`
- 靜態地點 + 動態地點同時顯示

### 記帳快捷按鈕 + 花費統計
- `ActivityItem` 展開後新增「💰 記帳」按鈕，連結至 `/expenses/add?activityId=XXX&day=N`
- `Expense` 型別新增 `activityId?: string`
- 新增費用表單讀取 `activityId` query param，寫入 Firestore
- 行程頁訂閱全部 expenses，以 `useMemo` 計算各 activityId 的總花費
- 有花費的活動卡片顯示灰色小字「共 ¥X,XXX」

### 每日旅遊日記
- 新增 `components/JournalSection.tsx`
- Firestore：`journal/{dayNumber}` doc，欄位 `{ YY?: string, Wei?: string, Rae?: string }`
- 可折疊（有內容時自動展開）；自己的區塊點擊後出現 inline textarea
- 儲存方式：blur 或 Enter 觸發（Shift+Enter 換行，Escape 取消）

### 行前準備清單 `/checklist`
- 新增 `data/checklist.ts`：13 項靜態清單，分 5 類（證件、票券、金錢、3C、個人）
- 新增 `app/checklist/page.tsx`：三人完成率進度條 + 依類別分組清單
- Firestore：`checklist/{member}` = `{ checkedIds: string[] }`
- 每個 item 顯示三人各自的打勾圓圈，只有自己的可以 toggle

### 訂位 / 票券記錄
- 新增 `components/ReservationSection.tsx`：顯示於行程頁底部（購物清單下方、日記上方）
- 新增 `app/reservations/add/page.tsx`：類型選擇、天數、時間、確認碼
- Firestore：`reservations/{id}` = `{ name, dayNumber, time?, confirmCode?, type, done, createdAt }`
- 支援確認碼點擊複製（`navigator.clipboard.writeText`）、已完成 toggle、帶確認的刪除

### 底部導航更新
- `BottomNav` 由 3 個 tab 擴充為 4 個：行程 ｜ 行前 ｜ 購物 ｜ 拆帳

---

## Firestore Collections 完整清單

| Collection | 用途 | 主要欄位 |
|---|---|---|
| `expenses` | 拆帳記錄 | amount, item, category, paidBy, splitAmong, splits?, activityId? |
| `activities` | 動態新增行程 | dayNumber, title, type, group, time?, note? |
| `activityMoods` | 各活動心情 emoji | `{activityId}` doc = `{ YY?, Wei?, Rae? }` |
| `dynamicPlaces` | 各活動動態備選地點 | activityId, name, category, note? |
| `wishlist` | 購物願望清單 | dayNumber, name, note?, purchased, locationId? |
| `journal` | 每日日記 | `{dayNumber}` doc = `{ YY?, Wei?, Rae? }` |
| `reservations` | 訂位/票券記錄 | name, dayNumber, time?, confirmCode?, type, done |
| `checklist` | 行前清單打勾狀態 | `{member}` doc = `{ checkedIds: string[] }` |

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

---

## 2026-05-09 — 行程資料全面整修（Day 4–8）

### 背景
出發前最後一週，根據 `info/` 目錄下各天 MD 參考資料，全面重整 `data/itinerary.ts`。

### 主要變更
- **Day 4 葵祭**：修正抵達御所時間（10:30 行列出發，需 09:50 到），加入 crosta 行李寄送選項，補充嵐山交通與景點細節
- **Day 5 奈良**：拆分興福寺/奈良公園為獨立卡片，補齊各景點間交通卡、午餐卡、春日大社詳細介紹
- **Day 5 交通修正**：奈良→天王寺方案一改為「近鐵奈良→鶴橋→大阪環狀線」（非近鐵→難波），方案二為 JR 直達 ¥510
- **Day 6–7**：重整大阪城、ytv 柯南、道頓堀、USJ 行程，補充午餐卡、早餐卡
- **Day 8**：10:00 抵達 KIX 辦理，倒推早餐與出發時間

---

## 2026-05-09 — 功能移除與重建

### 移除訂位/票券功能
需求變更，功能複雜度超過實際需求。
- 刪除 `components/ReservationSection.tsx`
- 刪除 `app/reservations/add/page.tsx`
- `app/itinerary/page.tsx` 移除相關 import、state、useEffect、JSX
- `types/index.ts` 移除 `ReservationType`、`Reservation` 介面
- Firestore `reservations` collection 停用（資料保留）

### 行前清單重建（13 → 40 項，5 → 8 類）
根據 `toBring.md` 全面重寫 `data/checklist.ts`：
- 新增分類：衣物、保養・美容、特殊行程
- 共 40 項，覆蓋所有出行必備物品

### 危機處理錦囊
`app/checklist/page.tsx` 新增 `CRISIS_TIPS` 陣列：
- **熱衰竭**：症狀 + 處理步驟 + 緊急電話（119）
- **護照遺失**：處理步驟 + 台北駐大阪辦事處聯絡方式
- 危機處理區塊移至頁面最上方

---

## 2026-05-09 — Google Drive 相簿連結

- 新增 `data/driveLinks.ts`：8 天的 Drive 資料夾連結集中管理
- `app/itinerary/page.tsx` 的每日主題列右側新增「📷 相簿」連結

---

## 2026-05-10 — 動態行程可編輯

### 問題
動態新增的行程只能刪除，無法修改。

### 實作
- 新增 `app/itinerary/edit/page.tsx`：以 `id` query param 從 Firestore 取得原始資料預填表單，送出時呼叫 `updateDoc`
- `ActivityItem` 新增 `editHref?: string` prop，顯示鉛筆圖示（藍色）與垃圾桶並排
- `GroupTabs` 與 `app/itinerary/page.tsx` 皆傳入 `editHref`

---

## 2026-05-10 — 文史知識延伸閱讀

### 設計
景點歷史說明加上「了解更多 →」連結，指向有料的中文 / 日文文章（非維基百科）。

### 實作
- `types/index.ts` 新增 `culturalNoteRef?: string` 欄位
- `CulturalNoteModal` 接受 `source?: string` prop，底部顯示外部連結
- `ActivityItem` 傳入 `source={details?.culturalNoteRef}`

### 六大景點奇文佚事 + 參考來源
| 景點 | 故事重點 | 來源 |
|---|---|---|
| 伏見稻荷 | 豐臣秀吉謝恩捐建樓門 | letsgojp（中文） |
| 興福寺阿修羅 | 光明皇后為亡母造像，三面映照哀愁 | 仏像旅（日文） |
| 東大寺 | 天花奪三成人口後的政治宣示 | Medium（繁中） |
| 春日大社 | 藤原氏用白鹿神話合法化政治控制 | 故事StoryStudio（繁中） |
| 葵祭 | 源氏物語「車爭ひ」的真實宮廷背景 | 京都市官方（日文） |
| 大阪城 | 德川填護城河的陷阱坑死豐臣家 | gtec（繁中） |

---

## 2026-05-10 — 使用說明頁

- 新增 `app/help/page.tsx`：涵蓋行程、拆帳、購物清單、錦囊四大功能說明
- `app/itinerary/page.tsx` 標題旁加「?」圓形按鈕連結至 `/help`

---

## 待辦：旅程結束後 — 旅行回顧頁

### 構想
旅程結束後製作「回顧頁」作為給 Wei、Rae 的驚喜，整合 App 內所有留存的記憶：

**素材來源**
- `journal/{dayNumber}`：三人的每日文字日記（可作為 voiceover / 旁白腳本）
- `activityMoods/{activityId}`：各景點的即時心情 emoji（作為轉場情緒點）
- Google Drive 相簿：照片與影片（已按天整理）
- `data/itinerary.ts`：行程時間軸與地點（骨架）

**回顧頁規格（待實作）**
- 每天一個區塊，顯示：日期主題、三人日記、各景點心情 emoji、相簿連結
- 全部唯讀，設計側重視覺呈現而非互動
- 可作為數位紀念冊，也可作為影片剪輯的腳本參考
- 考慮加入「解鎖」機制（旅程結束才顯示）或直接設為隱藏路由

**影片製作流程建議**
1. 看回顧頁，確認每天高潮點
2. 從 Drive 挑選每天 5–10 張代表照片 / 影片
3. CapCut 按天組裝，日記文字做成字幕或旁白
4. 心情 emoji 做成景點轉場小字卡

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

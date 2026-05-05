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

## 待辦 / 可能的未來擴充

- [ ] 旅途中新增景點即時筆記
- [ ] 消費類別標籤（餐飲 / 交通 / 門票 / 購物）
- [ ] 費用以新台幣顯示換算（匯率約 0.22）
- [ ] 離線 cache（PWA Service Worker）
- [ ] 行程頁支援手勢左右滑動換 day

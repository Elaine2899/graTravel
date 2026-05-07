export interface ChecklistItem {
  id: string
  label: string
  category: string
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'passport',   label: '護照',                          category: '證件' },
  { id: 'flight',     label: '機票確認信',                    category: '證件' },
  { id: 'hotel',      label: '訂房確認信',                    category: '證件' },
  { id: 'jrpass',     label: 'Haruka / JR Pass',             category: '票券' },
  { id: 'usj',        label: 'USJ 門票',                      category: '票券' },
  { id: 'cash',       label: '日幣現金',                      category: '金錢' },
  { id: 'card',       label: '信用卡',                        category: '金錢' },
  { id: 'phone',      label: '手機 + 充電器',                 category: '3C' },
  { id: 'powerbank',  label: '行動電源',                      category: '3C' },
  { id: 'adapter',    label: '轉接頭（台日規格相同，可不帶）', category: '3C' },
  { id: 'medicine',   label: '個人藥品',                      category: '個人' },
  { id: 'umbrella',   label: '雨傘 / 輕便雨衣',               category: '個人' },
  { id: 'clothes',    label: '換洗衣物（7 天）',               category: '個人' },
]

export const CHECKLIST_CATEGORIES = [...new Set(CHECKLIST_ITEMS.map((i) => i.category))]

export interface ChecklistItem {
  id: string
  label: string
  category: string
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 證件
  { id: 'passport',      label: '護照',                              category: '證件' },
  { id: 'student-id',    label: '學生證',                            category: '證件' },
  { id: 'flight',        label: '機票確認信',                        category: '證件' },
  { id: 'insurance',     label: '旅遊保險文件',                      category: '證件' },
  { id: 'visit-japan',   label: 'Visit Japan Web（海關預登記）',      category: '證件' },

  // 票券
  { id: 'jrpass',        label: 'Haruka 票（KIX→京都）',             category: '票券' },
  { id: 'usj',           label: 'USJ 門票',                          category: '票券' },

  // 金錢
  { id: 'cash',          label: '日幣現金',                          category: '金錢' },
  { id: 'wallet',        label: '錢包',                              category: '金錢' },
  { id: 'card',          label: '神奇小卡卡',                        category: '金錢' },

  // 衣物
  { id: 'clothes',       label: '衣服 7 套 + 內衣褲 + 襪子',         category: '衣物' },
  { id: 'jacket',        label: '外套（晚上約 18°C）',               category: '衣物' },
  { id: 'pajama',        label: '睡衣',                              category: '衣物' },
  { id: 'boots',         label: '靴子',                              category: '衣物' },
  { id: 'umbrella',      label: '雨傘 / 陽傘',                       category: '衣物' },
  { id: 'hat',           label: '帽子 / 墨鏡（可選）',               category: '衣物' },
  { id: 'dirty-bag',     label: '裝髒衣服的袋子',                    category: '衣物' },
  { id: 'sash',          label: '學士領巾',                          category: '衣物' },

  // 3C
  { id: 'phone',         label: '手機 + 充電器',                     category: '3C' },
  { id: 'powerbank',     label: '行動電源（需符合航空規定）',         category: '3C' },
  { id: 'earphones',     label: '耳機',                              category: '3C' },
  { id: 'laptop',        label: '電腦',                              category: '3C' },
  { id: 'network',       label: '網路（SIM 卡 / WiFi 分享器）',      category: '3C' },

  // 保養・美容
  { id: 'makeup',        label: '化妝品（防曬 / 底妝 / 彩妝全套）',  category: '保養・美容' },
  { id: 'skincare',      label: '保養品（化妝水噴霧 / 乳液）',       category: '保養・美容' },
  { id: 'cleanser',      label: '洗面乳',                            category: '保養・美容' },
  { id: 'conditioner',   label: '潤髮乳',                            category: '保養・美容' },
  { id: 'comb-mirror',   label: '梳子 / 鏡子',                       category: '保養・美容' },

  // 個人
  { id: 'contacts',      label: '隱眼（6天份）+ 藥水 + 眼鏡盒',     category: '個人' },
  { id: 'eyedrops',      label: '眼藥水',                            category: '個人' },
  { id: 'medicine',      label: '個人藥品',                          category: '個人' },
  { id: 'bug-med',       label: '蚊蟲咬傷藥',                        category: '個人' },
  { id: 'mask',          label: '口罩',                              category: '個人' },
  { id: 'sanitary',      label: '衛生棉 / 小剪刀',                   category: '個人' },
  { id: 'tissue',        label: '小包衛生紙 / 濕紙巾',               category: '個人' },
  { id: 'house-key',     label: '家裡鑰匙',                          category: '個人' },

  // 特殊行程
  { id: 'lightstick',    label: '十週年手燈 + 電池',                 category: '特殊行程' },
  { id: 'doll',          label: '娃娃',                              category: '特殊行程' },
  { id: 'cup-sleeve',    label: '杯套',                              category: '特殊行程' },
  { id: 'stamp-book',    label: '印章小本本',                        category: '特殊行程' },
]

export const CHECKLIST_CATEGORIES = [...new Set(CHECKLIST_ITEMS.map((i) => i.category))]

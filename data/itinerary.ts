import { Day } from '@/types'

export const ITINERARY: Day[] = [
  {
    dayNumber: 1,
    date: '05/12',
    weekday: '週二',
    theme: '落地 day',
    activities: [
      {
        id: 'd1-flight-out',
        time: '12:00',
        title: '共乘出發前往桃園機場',
        type: 'transport',
        details: {
          transportInfo: '共乘，記得出發時通知大家',
        },
      },
      {
        id: 'd1-checkin',
        time: '15:15',
        title: '✈ TPE → KIX 起飛',
        type: 'flight',
        details: {
          ticketInfo: '航班 IT212｜行李 20 公斤｜桃園機場 Terminal 1\n票價 NT$9,897 + 稅金 NT$1,500 + 加值服務 NT$2,850',
        },
      },
      {
        id: 'd1-arrive',
        time: '19:00',
        title: '抵達 KIX 關西國際機場',
        type: 'flight',
        details: {
          transportInfo: 'Terminal 1 入境',
          ticketInfo: '買 Haruka 特急票（最晚搭 20:46 班次）→ 京都車站\n京都車站轉地鐵烏丸線 → 四條站（6 號出口）→ 步行至飯店',
        },
      },
      {
        id: 'd1-hotel',
        time: '21:00',
        title: '✅ 入住 WAYFARER Kyoto Shijo',
        type: 'hotel',
        details: {
          transportInfo: '地址：768 Honryusuicho, Shimogyo Ward, Kyoto\nCheck-in：15:00–23:00｜Check-out：11:00',
        },
      },
      {
        id: 'd1-dinner',
        title: '吃晚餐',
        type: 'food',
        details: {
          recommendations: ['四條周邊覓食', '記得買隔天早餐'],
        },
      },
    ],
  },
  {
    dayNumber: 2,
    date: '05/13',
    weekday: '週三',
    theme: '和服 day',
    activities: [
      {
        id: 'd2-kimono',
        time: '09:30',
        title: '愛和服清水本店 換裝',
        type: 'attraction',
        details: {
          transportInfo: '公車 207 四條西洞院站 → 東山安井站（或 UBER）',
          ticketInfo: '換裝約 1 小時｜17:30 前歸還｜記得帶學生證！',
          recommendations: ['穿和服普遍被勒很緊，不好進食，袴相對舒適'],
        },
      },
      {
        id: 'd2-higashiyama',
        time: '11:00',
        title: '東山散步路線',
        type: 'attraction',
        details: {
          culturalNote: '東山地區保留了京都最完整的傳統町家街道，是江戶時代庶民生活的縮影。',
          recommendations: [
            '八坂五重塔 → 二年坂 → 三年坂 → 清水寺（往上）',
            '沿路吃點心 → 寧寧之道 → 八坂神社 → 祇園 → 花見小路（往下）',
            'GOKAGO：抹茶焙茶必喝',
          ],
        },
      },
      {
        id: 'd2-kiyomizudera',
        title: '清水寺',
        type: 'attraction',
        details: {
          culturalNote: '清水寺建於西元 778 年，現建築為 1633 年德川家光重建。清水舞台由 139 根大柱支撐，高 13 公尺，完全不使用釘子。「清水の舞台から飛び降りる」（從清水舞台跳下）是日語俗語，意指下定決心做某事。',
          ticketInfo: '門票 ¥500',
        },
      },
      {
        id: 'd2-yasaka',
        title: '八坂神社',
        type: 'attraction',
        details: {
          culturalNote: '八坂神社又稱「祇園神社」，是京都最古老的神社之一，建於西元 656 年。每年 7 月的祇園祭是全日本三大祭典之一，有超過 1,000 年歷史。',
        },
      },
      {
        id: 'd2-shimogamo',
        time: '15:00',
        title: '下鴨神社・糺之森',
        type: 'attraction',
        details: {
          transportInfo: '公車 205/206 或 祇園四條站搭京阪本線 → 出町柳站',
          culturalNote: '下鴨神社（賀茂御祖神社）建立於西元前，是京都最古老的神社之一。境內的「糺之森」是面積約 12.4 公頃的原始森林，自古便是神聖之地。',
          recommendations: [
            '四季御守',
            '水占卜（水みくじ）：將御籤浸入水中顯現文字',
            '河合神社：美麗神，鏡絵馬',
            '御守攤位約 17:00 關閉',
          ],
        },
      },
      {
        id: 'd2-return-kimono',
        time: '17:00',
        title: '歸還和服',
        type: 'transport',
        details: {
          transportInfo: '17:30 前必須歸還，留意時間！',
        },
      },
      {
        id: 'd2-dinner',
        title: '晚餐',
        type: 'food',
      },
    ],
  },
  {
    dayNumber: 3,
    date: '05/14',
    weekday: '週四',
    theme: '分散 day',
    activities: [
      {
        id: 'd3-breakfast',
        title: '找間早餐一起吃',
        type: 'food',
        group: 'all',
        details: { recommendations: ['四條站周邊'] },
      },
      // 宇治·稻荷組（YY + Rae）
      {
        id: 'd3-fushimi',
        time: '09:00',
        title: '伏見稻荷大社',
        type: 'attraction',
        group: 'YY+Rae',
        details: {
          transportInfo: '四條站 → 京都車站 → JR 奈良線 → JR 伏見稻荷站',
          culturalNote: '伏見稻荷大社是全日本約 30,000 座稻荷神社的總本社，建立於西元 711 年。以「千本鳥居」聞名，實際上有超過 1 萬座朱紅色鳥居綿延山道。鳥居由信眾和企業奉納，祈求生意興隆或願望成真。',
          recommendations: [
            '千本鳥居隧道',
            '登頂稻荷山（海拔 233m，往返約 2–3 小時）',
          ],
        },
      },
      {
        id: 'd3-uji',
        time: '12:00',
        title: '宇治散步',
        type: 'attraction',
        group: 'YY+Rae',
        details: {
          transportInfo: 'JR 奈良線 → JR 宇治站',
          culturalNote: '宇治是日本抹茶的發源地，自平安時代起就以茶葉聞名。宇治川沿岸風景優美，沿河散步可串聯各大景點。',
          recommendations: [
            '中村藤吉本店（抹茶甜點，超人氣，要先去拿號碼牌）',
            '平等院：鳳凰堂是 10 円硬幣上的圖案，門票 ¥600，湖中倒影超美',
            '宇治神社：兔子意象，可愛御守',
            '宇治上神社：世界遺產，綠意盎然',
            '沿宇治川散步',
          ],
        },
      },
      {
        id: 'd3-byodoin',
        title: '平等院鳳凰堂',
        type: 'attraction',
        group: 'YY+Rae',
        details: {
          culturalNote: '平等院建於西元 1052 年，是藤原賴通將父親道長的別墅改建而成的佛寺。鳳凰堂是日本 10 円硬幣背面的圖案，也是 NHK 大河劇常見場景。鳳凰堂內供奉的阿彌陀如來像（國寶）為定朝所作，是日本雕刻史上的里程碑。',
          ticketInfo: '庭園入場 ¥600，鳳凰堂內部參觀需另購 ¥300（每次限 50 人）',
        },
      },
      // 東京巨蛋組（Wei）
      {
        id: 'd3-shinkansen',
        time: '10:00',
        title: '搭新幹線前往東京',
        type: 'transport',
        group: 'Wei',
        details: {
          transportInfo: '京都車站搭新幹線 → 東京車站\n記得提前買好票！',
          ticketInfo: '東海道新幹線，車程約 2 小時 15 分',
        },
      },
      {
        id: 'd3-dome',
        time: '14:00',
        title: '前往東京巨蛋',
        type: 'attraction',
        group: 'Wei',
        details: {
          transportInfo: '東京車站 → 丸之內線 → 後樂園站 2 號出口步行 8 分鐘',
          ticketInfo: '記得拿 pick up！領 zone 卡！\n16:30 開演｜約 19:30 結束',
        },
      },
      {
        id: 'd3-back',
        time: '20:30',
        title: '搭新幹線返回京都',
        type: 'transport',
        group: 'Wei',
        details: {
          transportInfo: '後樂園站 → 丸之內線 → 池袋站 → 東京車站\n末班新幹線：21:24（建議搭 20:39 或 20:54 保險）\n約 24:00 前可抵達京都飯店',
        },
      },
      // 下午全員
      {
        id: 'd3-mob',
        time: '14:00',
        title: 'Mob Programming（全員上線）',
        type: 'attraction',
        group: 'all',
        details: {
          transportInfo: '記得要在線上！',
        },
      },
    ],
  },
  {
    dayNumber: 4,
    date: '05/15',
    weekday: '週五',
    theme: '忙碌 day',
    activities: [
      {
        id: 'd4-checkout',
        time: '10:00',
        title: '退房｜行李寄放飯店',
        type: 'hotel',
        details: {
          transportInfo: 'WAYFARER Kyoto Shijo check-out：11:00 前\n行李寄放後輕裝出發',
        },
      },
      {
        id: 'd4-gosho',
        time: '10:30',
        title: '京都御所・葵祭',
        type: 'attraction',
        details: {
          transportInfo: '四條站 → 烏丸線 → 丸太町站',
          culturalNote: '葵祭是京都三大祭之一，每年 5 月 15 日舉行，有超過 1,000 年歷史。遊行隊伍由上賀茂神社、下鴨神社的齋王代率領，穿著平安時代宮廷服飾，從京都御所出發。隊伍超過 500 人，全程約 8 公里。',
          recommendations: ['遊行隊伍從御所出發，人會很多，提早到佔位置'],
        },
      },
      {
        id: 'd4-lunch',
        time: '12:00',
        title: '御所附近午餐',
        type: 'food',
      },
      {
        id: 'd4-kinkakuji',
        time: '12:30',
        title: '金閣寺',
        type: 'attraction',
        details: {
          transportInfo: '公車 204 → 金閣寺道站',
          culturalNote: '金閣寺（鹿苑寺）建於 1397 年，是足利義滿的別墅。現在的建築是 1955 年重建，因 1950 年被一名見習僧侶縱火燒毀。三島由紀夫據此事件寫成小說《金閣寺》。上層兩層貼有純金箔，倒映在鏡湖池中的景象是京都最著名的景緻之一。',
          ticketInfo: '門票 ¥500',
          recommendations: ['計程車到嵐山（JR 嵐山站）約 15:10 抵達'],
        },
      },
      {
        id: 'd4-arashiyama',
        time: '15:10',
        title: '嵐山',
        type: 'attraction',
        details: {
          culturalNote: '嵐山自平安時代起就是貴族的度假勝地，保存了許多歷史建築和自然景觀。',
          recommendations: [
            '商店街覓食',
            '渡月橋：建於 9 世紀，因龜山天皇詠月而得名，曾出現在葛飾北齋浮世繪中',
            '嵯峨野竹林小徑：從野宮神社至天龍寺北門，長約 400 公尺',
            '御髮神社：全日本唯一的理髮業守護神社',
            '京都音樂盒堂嵯峨店：門口有舞妓裝置藝術，打卡聖地',
            '搭船遊嵐山（保津川）',
          ],
          transportInfo: 'JR 嵐山站 山陰本線 → 京都車站（研究行李寄送服務可不用回飯店）',
        },
      },
      {
        id: 'd4-to-osaka',
        time: '19:40',
        title: '前往大阪',
        type: 'transport',
        details: {
          transportInfo: '四條站取行李 → 阪急京都線 → 大阪梅田站（末班 23:17）\n梅田站轉御堂筋線 → 難波站\n步行約 14 分鐘至飯店',
        },
      },
      {
        id: 'd4-hotel-osaka',
        time: '21:00',
        title: '✅ 入住 Hotel Abitare Namba West',
        type: 'hotel',
        details: {
          transportInfo: '地址：2 Chome-2-44 Saiwaicho, Naniwa Ward, Osaka\n自助 check-in｜Check-in：16:00 起｜Check-out：10:00',
        },
      },
    ],
  },
  {
    dayNumber: 5,
    date: '05/16',
    weekday: '週六',
    theme: '小鹿 day',
    activities: [
      {
        id: 'd5-to-nara',
        time: '09:00',
        title: '前往奈良',
        type: 'transport',
        details: {
          transportInfo: '大阪難波站 → 近鐵奈良線 → 近鐵奈良站（離景點較近，推薦）\n或 JR 難波站 → 大和路線 → JR 奈良站\n車程約 1 小時',
        },
      },
      {
        id: 'd5-nara-park',
        title: '奈良公園・興福寺',
        type: 'attraction',
        details: {
          culturalNote: '奈良公園建立於 1880 年，面積約 660 公頃。園內自由放養超過 1,200 頭梅花鹿，牠們被視為春日大社神的使者，是國家天然紀念物。「鹿仙貝」（shika senbei）是專門賣給遊客餵鹿的米餅，鹿會對你低頭鞠躬討食。',
          recommendations: [
            '大佛布丁！（必吃）',
            '志津香釜飯：廣受好評，有素食選項',
            'YUKI 亭：蛋包飯',
          ],
        },
      },
      {
        id: 'd5-todaiji',
        title: '東大寺',
        type: 'attraction',
        details: {
          culturalNote: '東大寺大佛殿是世界現存最大的木造建築。大佛（盧舍那佛）高 14.98 公尺，建造於西元 743 年，為聖武天皇為祈求國家安泰所鑄。殿內有一根柱子有個洞，和大佛鼻孔同樣大小（37cm x 30cm），能鑽過去據說能得到幸福。',
          ticketInfo: '門票 ¥600',
        },
      },
      {
        id: 'd5-kasuga',
        title: '春日大社',
        type: 'attraction',
        details: {
          culturalNote: '春日大社建立於西元 768 年，是奈良時代守護都城的重要神社。境內有超過 3,000 座燈籠，包括石燈籠和吊燈籠，每年 2 月和 8 月舉行「萬燈籠」活動，場景夢幻。',
          ticketInfo: '外苑免費，本殿特別參拜需 ¥500',
        },
      },
      {
        id: 'd5-wakakusa',
        title: '若草山（可選）',
        type: 'attraction',
        details: {
          ticketInfo: '登頂約 1 小時，門票 ¥150',
          recommendations: ['可跳過，逛完奈良還有體力再考慮'],
        },
      },
      {
        id: 'd5-abeno',
        time: '17:00',
        title: '阿倍野 Harukas 夜景（可選）',
        type: 'attraction',
        details: {
          transportInfo: 'JR 奈良站 → JR 天王寺站\n或 近鐵奈良站 → 鶴橋站 → 大阪環狀線 → 天王寺站',
          culturalNote: '阿倍野 Harukas 高 300 公尺，是日本最高摩天大樓之一。58–60 樓為展望台，現有芙莉蓮聯動活動。',
          ticketInfo: '展望台門票 ¥1,800，從黃昏待到天黑最美',
        },
      },
    ],
  },
  {
    dayNumber: 6,
    date: '05/17',
    weekday: '週日',
    theme: '都市 day',
    activities: [
      {
        id: 'd6-osaka-castle',
        time: '10:00',
        title: '大阪城公園',
        type: 'attraction',
        details: {
          transportInfo: 'JR 難波站 → JR 大阪城公園站\n或 櫻川站 千日前線 → 谷町九丁目站 → 谷町線 → 谷町四丁目站',
          culturalNote: '大阪城由豐臣秀吉於 1583 年開始修建，是當時日本最大的城堡。現在的天守閣是 1931 年重建的鋼筋水泥版，但城壁和護城河仍保留歷史原貌。附近 ytv 大樓有柯南角色雕像！柯南最近也有相關活動。',
          ticketInfo: '天守閣門票 ¥600（可不進去）',
          recommendations: ['ytv 大樓旁有柯南角色雕像，值得繞過去看'],
        },
      },
      {
        id: 'd6-shinsaibashi',
        time: '13:00',
        title: '心齋橋 → 道頓堀 → 難波 慢慢逛',
        type: 'attraction',
        details: {
          transportInfo: '森之宮站 長堀鶴見綠地線 → 心齋橋站',
          culturalNote: '道頓堀是大阪最著名的娛樂街，以巨大的螃蟹、河童廣告招牌和固力果跑步人看板聞名。心齋橋筋商店街有超過 600 公尺長，是大阪最熱鬧的購物街。',
          recommendations: [
            '固力果跑步人看板打卡',
            '章魚燒、大阪燒（必吃）',
            '梅田空中展望庭園（要門票 ¥1,500，到 22:00，想逛街可跳過）',
          ],
        },
      },
    ],
  },
  {
    dayNumber: 7,
    date: '05/18',
    weekday: '週一',
    theme: '環球 day',
    activities: [
      {
        id: 'd7-usj-transit',
        time: '08:00',
        title: '前往 USJ',
        type: 'transport',
        details: {
          transportInfo: '櫻川站 阪神難波線 → 西九條站 → JR 夢咲線 → 環球城站\n車程約 30 分鐘',
          ticketInfo: '門票已買好！記得提前查當天開園時間（通常 9:00–21:00，有時提早）\n前一天查好隔天時間表',
        },
      },
      {
        id: 'd7-usj',
        title: '環球影城 USJ',
        type: 'attraction',
        details: {
          culturalNote: '大阪環球影城是日本第一座環球影城，2001 年開幕。任天堂園區（超級任天堂世界）是 USJ 最新也最熱門的園區，需要抽整理券才能入場（早上一到就要抽！）天黑後人潮減少，較容易直接進入。',
          recommendations: [
            '進場第一件事：抽任天堂園區整理券！',
            '哪裡人少去哪裡，不用硬照順序走',
            '現有聯動：咒術迴戰、東野圭吾、名偵探柯南',
            '想玩：大白鯊、咚奇剛礦山車、哈利波特禁忌之旅',
            '想看：水世界',
            '奶油啤酒（必喝）',
            '任天堂手錶遊戲需有 Nintendo Switch 手環（現場購買）',
            '我媽威脅我不要買魔杖（但還是自己決定啦）',
            '停運中：飛天翼龍',
          ],
        },
      },
    ],
  },
  {
    dayNumber: 8,
    date: '05/19',
    weekday: '週二',
    theme: '返程 day',
    activities: [
      {
        id: 'd8-checkout',
        time: '09:00',
        title: '退房',
        type: 'hotel',
        details: {
          transportInfo: 'Hotel Abitare Namba West check-out：10:00 前',
        },
      },
      {
        id: 'd8-to-airport',
        time: '10:30',
        title: '前往關西機場',
        type: 'transport',
        details: {
          transportInfo: '南海難波站 搭南海特急（rapi:t）→ 關西機場站\n車程約 1 小時｜難波站超大，提早出發！\n（難波站到南海難波站需步行約 1.2 公里）',
          ticketInfo: '建議 10:30 前出發，留足夠時間',
        },
      },
      {
        id: 'd8-flight-back',
        time: '12:20',
        title: '✈ KIX → TPE 起飛',
        type: 'flight',
        details: {
          ticketInfo: '航班 IT711｜行李 20 公斤｜關西機場 Terminal 1\n票價 NT$6,297 + 稅金 NT$2,811 + 加值服務 NT$2,850',
        },
      },
      {
        id: 'd8-arrive-tpe',
        time: '14:15',
        title: '抵達桃園機場',
        type: 'flight',
        details: {
          transportInfo: 'Terminal 1 入境\n記得安排共乘接送！',
        },
      },
    ],
  },
]

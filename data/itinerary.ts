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
        },
      },
      {
        id: 'd1-to-hotel',
        time: '19:30',
        title: 'KIX → 京都四條',
        type: 'transport',
        details: {
          transportInfo: '買 Haruka 特急票 → 京都車站（最晚搭 20:46 班次）\n京都車站轉地鐵烏丸線 → 四條站（6 號出口）→ 步行至飯店',
        },
      },
      {
        id: 'd1-hotel',
        time: '21:00',
        title: '✅ 入住 WAYFARER Kyoto Shijo',
        type: 'hotel',
        details: {
          transportInfo: '地址：768 Honryusuicho, Shimogyo Ward, Kyoto\nCheck-in：15:00–23:00｜Check-out：11:00',
          mapQuery: 'WAYFARER Kyoto Shijo',
        },
      },
      {
        id: 'd1-dinner',
        title: '吃晚餐',
        type: 'food',
        details: {
          recommendations: ['記得順手買隔天早餐'],
          foodRecs: [
            { name: 'めんや美鶴', note: '濃厚雞白湯拉麵，四條烏丸步行 3 分。平日到 23:30、週五六到 24:00' },
            { name: '天天有 四条烏丸店', note: '京都名物雞湯拉麵，4 種湯頭可選。到 22:30，在 COCON 烏丸地下' },
            { name: 'すしざんまい 京都河原町店', note: '迴轉壽司，河原町步行 10 分。到 22:30' },
            { name: '一蘭 京都河原町店', note: '博多豚骨拉麵，24 小時年中無休，河原町步行 10 分' },
            { name: '大豊ラーメン 木屋町店', note: '深夜拉麵，開到早上 6 點，木屋町步行 8 分' },
          ],
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
        id: 'd2-to-kimono',
        time: '09:00',
        title: '移動至愛和服清水本店',
        type: 'transport',
        details: {
          transportInfo: '公車 207：四條西洞院站 → 東山安井站，步行約 3 分',
          transportAlt: 'UBER（約 10 分鐘）',
        },
      },
      {
        id: 'd2-kimono',
        time: '09:30',
        title: '愛和服清水本店 換裝',
        type: 'attraction',
        details: {
          ticketInfo: '換裝約 1 小時｜17:30 前歸還｜記得帶學生證！',
          recommendations: ['穿和服普遍被勒很緊，不好進食，袴相對舒適'],
          mapQuery: '愛和服清水本店 京都',
        },
      },
      {
        id: 'd2-higashiyama',
        time: '10:30',
        title: '東山散步',
        type: 'attraction',
        details: {
          culturalNote: '東山地區保留了京都最完整的傳統町家街道，是江戶時代庶民生活的縮影。',
          mapQuery: '東山 二年坂 三年坂 京都',
          spotRecs: [
            { name: '八坂五重塔 → 二年坂 → 三年坂 → 清水寺（門票 ¥500）', note: '往上走' },
            { name: '寧寧之道 → 八坂神社 → 祇園 → 花見小路', note: '往下走，沿路可買點心' },
          ],
          foodRecs: [
            { name: 'GOKAGO', note: '抹茶焙茶甜點，東山知名打卡店，要排隊' },
            { name: '二年坂 茶寮 都路里', note: '抹茶冰淇淋、聖代，連鎖但品質穩定' },
            { name: '阿古屋茶屋', note: '豆腐料理，清水寺旁，適合午餐' },
            { name: 'Yorozuya Okageya', note: '日式甜點，麻糬年糕口感 Q，三年坂旁' },
            { name: '二年坂 Starbucks（京都町家店）', note: '保留傳統建築，和風空間，打卡點' },
          ],
        },
      },
      {
        id: 'd2-return-kimono',
        time: '14:00',
        title: '歸還和服',
        type: 'transport',
        details: {
          transportInfo: 'Deadline 17:30，提早 14:00 歸還，不趕時間',
          mapQuery: '愛和服清水本店 京都',
        },
      },
      {
        id: 'd2-to-shimogamo',
        time: '14:30',
        title: '移動至下鴨神社',
        type: 'transport',
        details: {
          transportInfo: '公車 205 / 206：東山安井站 → 下鴨神社前站',
          transportAlt: '祇園四條站 or 清水五條站 搭京阪本線 → 出町柳站，步行 10 分',
        },
      },
      {
        id: 'd2-shimogamo',
        time: '15:00',
        title: '下鴨神社・糺之森・河合神社',
        type: 'attraction',
        details: {
          culturalNote: '下鴨神社（賀茂御祖神社）建立於西元前，是京都最古老的神社之一。境內的「糺之森」是面積約 12.4 公頃的原始森林，自古便是神聖之地。',
          mapQuery: '下鴨神社 京都',
          spotRecs: [
            { name: '糺之森', note: '神社境內原始森林，清涼靜謐' },
            { name: '河合神社', note: '美麗之神，鏡絵馬──在繪馬臉上畫自己的妝容祈求美麗' },
          ],
          recommendations: [
            '四季御守',
            '水占卜（水みくじ）：將御籤浸入水中顯現文字',
            '御守攤位約 17:00 關閉，16:30 前入內較保險',
          ],
        },
      },
      {
        id: 'd2-to-haircut',
        time: '16:30',
        title: '移動至四条大宮',
        type: 'transport',
        details: {
          transportInfo: '出町柳站搭阪急京都本線 → 大宮站，步行約 5 分',
          transportAlt: '公車直達四条大宮站',
        },
      },
      {
        id: 'd2-haircut',
        time: '17:00',
        title: '✂ INCE HAIR 京都四条大宮店',
        type: 'attraction',
        details: {
          mapQuery: 'INCE HAIR 京都四条大宮',
        },
      },
      {
        id: 'd2-dinner',
        time: '20:00',
        title: '晚餐（已預約）モリタ屋 四条猪熊本店',
        type: 'food',
        details: {
          ticketInfo: '已預約，請準時抵達。離 INCE HAIR 步行約 5 分',
          mapQuery: 'モリタ屋 四条猪熊本店 京都',
        },
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
        time: '08:30',
        title: '找間早餐一起吃',
        type: 'food',
        group: 'all',
        details: {
          foodRecs: [
            { name: '旬菜いまり', note: '京の朝ごはん（¥1,500），土鍋飯、西京燒魚、おばんざい，07:30–10:00。每日限 30 組，需提前預約！' },
            { name: '節道 BUSHIDO', note: '鰹節丼定食，削りたて本枯節，07:00–15:00，四條烏丸步行 7 分' },
            { name: '小川珈琲 堺町錦店', note: '百年老舖，京町家改裝，九條蔥玉子三明治，07:00–20:00' },
            { name: 'イノダコーヒ 四条支店', note: '京都老牌咖啡館，西式早餐組合（牛角包、火腿蛋），07:00–，四條烏丸直達' },
          ],
        },
      },
      // 宇治·稻荷組（YY + Rae）
      {
        id: 'd3-to-fushimi',
        time: '09:30',
        title: '移動至伏見稻荷大社',
        type: 'transport',
        group: 'YY+Rae',
        details: {
          transportInfo: '步行至四條站（烏丸線）→ 京都車站 → JR 奈良線 → 稻荷站，步行約 1 分',
        },
      },
      {
        id: 'd3-fushimi',
        time: '10:10',
        title: '伏見稻荷大社',
        type: 'attraction',
        group: 'YY+Rae',
        details: {
          culturalNote: '伏見稻荷大社是全日本約 30,000 座稻荷神社的總本社，建立於西元 711 年。以「千本鳥居」聞名，實際上有超過 1 萬座朱紅色鳥居綿延山道。鳥居由信眾和企業奉納，祈求生意興隆或願望成真。',
          mapQuery: '伏見稲荷大社 京都',
          specialties: ['稻荷壽司', '狐狸烏龍麵', '稻荷仙貝'],
          spotRecs: [
            { name: '千本鳥居', note: '過四辻後人潮銳減，後半段更寧靜神聖' },
            { name: '奧之院「輕重石」', note: '許願後舉石，比想像輕則心願可成' },
            { name: '一峰（上社神蹟）', note: '稻荷山最高峰 233m，最強能量景點，可免費抽籤' },
          ],
          foodRecs: [
            { name: '稻荷茶寮', note: '神社境內「啼鳥庵」，推薦稻荷刨冰與稻荷聖代，迷你鳥居乾菓子超可愛' },
            { name: 'NEZAMEYA（祢ざめ家）', note: '1540 年創業老店，豆皮壽司招牌，豐臣秀吉命名。營業：10:00–16:00' },
          ],
        },
      },
      {
        id: 'd3-to-shourinji',
        time: '12:00',
        title: '移動至勝林寺',
        type: 'transport',
        group: 'YY+Rae',
        details: {
          transportInfo: '稻荷站搭 JR 奈良線 往京都方向 → 東福寺站（1 站，約 3 分）→ 步行約 8 分',
        },
      },
      {
        id: 'd3-shourinji',
        time: '12:15',
        title: '勝林寺',
        type: 'attraction',
        group: 'YY+Rae',
        details: {
          culturalNote: '勝林寺是東福寺的塔頭，建於 1550 年，供奉毘沙門天。以「東福寺的毘沙門天」聞名，境內清靜，花手水（花朵裝飾水盆）是熱門拍照景點。開放時間 10:00–16:00。',
          mapQuery: '勝林寺 東福寺 京都',
          recommendations: ['花手水隨季節更換，色彩繽紛，很適合拍照', '御朱印種類豐富'],
        },
      },
      {
        id: 'd3-to-uji',
        time: '13:00',
        title: '移動至宇治',
        type: 'transport',
        group: 'YY+Rae',
        details: {
          transportInfo: '東福寺站搭 JR 奈良線 往奈良方向 → JR 宇治站（約 20 分）',
        },
      },
      {
        id: 'd3-uji',
        time: '13:30',
        title: '宇治散步',
        type: 'attraction',
        group: 'YY+Rae',
        details: {
          culturalNote: '宇治是日本抹茶的發源地，自平安時代起就以茶葉聞名。宇治川沿岸風景優美，沿河散步可串聯各大景點。',
          mapQuery: '宇治市 京都府',
          specialties: ['宇治茶（抹茶・煎茶・玉露）', '茶だんご（抹茶丸子）', '源氏物語おかき'],
          spotRecs: [
            { name: '平等院鳳凰堂', note: '10 円硬幣圖案，湖中倒影超美，門票 ¥600，內部另購 ¥300（每場限 50 人）' },
            { name: '宇治神社', note: '兔子意象，可愛御守' },
            { name: '宇治上神社', note: '世界遺產，綠意盎然' },
          ],
          foodRecs: [
            { name: '中村藤吉本店', note: '宇治最著名抹茶老舖，生茶凍、抹茶聖代超人氣，一定要先拿號碼牌！' },
            { name: 'OHARA WARABIMOCHI', note: '現做蕨餅，口感超 Q 彈，宇治排隊名物' },
            { name: '伊藤久右衛門 宇治本店', note: '百年宇治茶老舖，茶蕎麥麵和抹茶甜點都值得嚐' },
            { name: '茶房 竹林', note: '宇治川旁小店，抹茶冰淇淋配景緻很好拍' },
          ],
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
          transportInfo: '京都車站搭新幹線 → 東京車站，車程約 2 小時 15 分',
          ticketInfo: '記得提前買好票！',
        },
      },
      {
        id: 'd3-to-dome',
        time: '13:30',
        title: '移動至東京巨蛋',
        type: 'transport',
        group: 'Wei',
        details: {
          transportInfo: '東京車站 → 東京メトロ丸之內線 → 後樂園站，2 號出口步行 8 分',
        },
      },
      {
        id: 'd3-dome',
        time: '14:00',
        title: '東京巨蛋',
        type: 'attraction',
        group: 'Wei',
        details: {
          ticketInfo: '記得拿 pick up！領 zone 卡！\n16:30 開演｜約 19:30 結束',
          mapQuery: '東京ドーム',
          foodRecs: [
            { name: '東京ドームドッグ', note: '場內名物大熱狗，¥550，各層都有賣' },
            { name: '金猫揚げ餃子', note: '脆皮煎餃，一口一個，¥650，紅杯裝超好拍' },
            { name: 'チーズバーガーメルト', note: '融化 Gouda 起司 + 牛肉漢堡，¥1,280' },
            { name: 'チュリトス', note: '條狀甜甜圈，¥450，肉桂 or 巧克力口味' },
          ],
        },
      },
      {
        id: 'd3-back',
        time: '20:30',
        title: '搭新幹線返回京都',
        type: 'transport',
        group: 'Wei',
        details: {
          transportInfo: '後樂園站 → 丸之內線 → 東京車站\n末班新幹線：21:24（建議搭 20:39 或 20:54 保險）\n約 24:00 前可抵達京都飯店',
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
          recommendations: ['記得要在線上！'],
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
        time: '09:00',
        title: '退房｜行李寄放飯店',
        type: 'hotel',
        details: {
          recommendations: [
            '11:00 前退房，行李寄放飯店大廳，傍晚回取後再出發',
            '【省事選項】crosta 行李轉送：¥2,500/件，09:00 前交件至京都車站，17:00–20:00 在難波飯店領取，可省去回飯店取行李的路程（詳見 d4-to-osaka 備案）',
          ],
        },
      },
      {
        id: 'd4-to-gosho',
        time: '09:30',
        title: '移動至京都御所',
        type: 'transport',
        details: {
          transportInfo: '飯店步行至四條站 → 地鐵烏丸線 → 丸太町站，步行約 5 分（共約 15 分）',
        },
      },
      {
        id: 'd4-gosho',
        time: '09:50',
        title: '京都御所・葵祭',
        type: 'attraction',
        details: {
          culturalNote: '京都御所是天皇自 14 世紀至明治維新（1869 年）遷都東京前的居所，現為免費開放的國民公園。\n\n【紫宸殿】御所最重要的正殿，天皇即位大典和重要儀式的舞台，屋頂採傳統桧皮葺工法，樓前左橘右櫻（「左近之桜、右近之橘」）為最具代表的景象。\n\n【清涼殿】天皇日常起居的私人殿堂，建築以通風涼爽著稱，是平安文學描述的宮廷日常場景所在。\n\n【御池庭】御所內最大庭園，以池泉迴遊式造景呈現，錦鯉悠游其中，春季楓紅秋季金黃。\n\n【葵祭】京都三大祭之一，每年 5 月 15 日舉行，超過 1,000 年歷史。遊行隊伍由上賀茂神社、下鴨神社的齋王代率領，穿著平安時代宮廷服飾從御所出發，超過 500 人、全程約 8 公里。\n\n免費入場｜導覽行程：09:30 / 10:30 / 13:30 / 14:30 各一場（英語）',
          mapQuery: '京都御苑',
          recommendations: [
            '遊行隊伍 10:30 從御所南門出發，提早 30–40 分鐘到佔位置',
            '人多時可退至御苑外側道路，逆著隊伍方向站定等待也是好視角',
            '免費入場，無需預約',
          ],
        },
      },
      {
        id: 'd4-lunch',
        time: '11:30',
        title: '御所附近午餐',
        type: 'food',
        details: {
          foodRecs: [
            { name: '丸太町 十二段家', note: '百年京料理老舖，招牌鯛魚茶泡飯，京町家格局，距丸太町站步行 3 分' },
            { name: '京都鶏白湯そば 純', note: '雞白湯拉麵，湯頭濃郁不膩，距御苑步行 5 分' },
            { name: '檜垣茶寮', note: '位於京都御苑園內，供應御所車御膳（日式套餐），午間 11:00–15:00' },
            { name: 'Songbird Coffee', note: '咖哩飯 cafe，選項豐富，週四公休，10:00–18:30' },
          ],
        },
      },
      {
        id: 'd4-to-arashiyama',
        time: '12:30',
        title: '移動至嵐山',
        type: 'transport',
        details: {
          transportInfo: '丸太町站 烏丸線 → 四条站 → 步行至四条大宮站 → 嵐電 → 嵐山站（約 40 分）',
          transportAlt: '【有 crosta 寄行李時】丸太町站 烏丸線 → 京都站（交件行李）→ JR 山陰本線 → 嵯峨嵐山站（約 35 分）',
        },
      },
      {
        id: 'd4-arashiyama',
        time: '13:30',
        title: '嵐山',
        type: 'attraction',
        details: {
          culturalNote: '嵐山自平安時代起就是貴族的度假勝地，保存了許多歷史建築和自然景觀。',
          mapQuery: '嵐山 京都',
          spotRecs: [
            { name: '渡月橋', note: '建於 9 世紀，因龜山天皇詠月而得名，曾出現在葛飾北齋浮世繪' },
            { name: '嵯峨野竹林小徑', note: '從野宮神社至天龍寺北門，長約 400 公尺' },
            { name: '御髮神社', note: '全日本唯一理髮業守護神社' },
            { name: '常寂光寺', note: '竹林旁安靜的山腹寺院，楓葉景點，可遠眺嵐山全景' },
            { name: '京都音樂盒堂嵯峨店', note: '門口有舞妓裝置藝術，打卡聖地' },
          ],
          foodRecs: [
            { name: 'Petit Bonheur', note: '嵐山商店街現做可麗餅，甜鹹口味齊全，排隊必吃' },
            { name: '豆乳冰淇淋', note: '商店街多家販售，濃郁豆香' },
            { name: '嵐山よしむら', note: '竹林旁景觀蕎麥麵，可從座位欣賞大堰川，午間 11:00–17:00' },
          ],
          recommendations: ['商店街有足湯（免費）可泡腳', '有 Snoopy、拉拉熊、miffy 周邊店', '可搭船遊保津川（需另外預約）'],
        },
      },
      {
        id: 'd4-to-osaka',
        time: '18:30',
        title: '前往大阪',
        type: 'transport',
        details: {
          transportInfo: '嵐電 嵐山站 → 四条大宮站 → 步行回飯店取行李\n四條站 阪急京都線 急行 → 大阪梅田站（約 45 分）\n梅田站 御堂筋線 → 難波站，步行約 14 分至飯店',
          transportAlt: '【有 crosta 寄行李時，免回飯店】JR 嵯峨嵐山站 → JR 大阪站（約 1 小時）→ 梅田站 御堂筋線 → 難波站',
        },
      },
      {
        id: 'd4-hotel-osaka',
        time: '20:30',
        title: '✅ 入住 Hotel Abitare Namba West',
        type: 'hotel',
        details: {
          recommendations: ['地址：2 Chome-2-44 Saiwaicho, Naniwa Ward, Osaka', '自助 check-in｜16:00 起｜退房 10:00'],
          mapQuery: 'Hotel Abitare Namba West Osaka',
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
          transportInfo: '飯店步行至大阪難波站 → 近鐵難波駅 奈良線 急行 → 近鐵奈良駅（約 40–50 分，距景點最近）',
          transportAlt: 'JR 難波站 → 大和路線 → JR 奈良站（約 45 分，需步行至景點較遠）',
        },
      },
      {
        id: 'd5-kofukuji',
        time: '10:10',
        title: '興福寺',
        type: 'attraction',
        details: {
          culturalNote: '興福寺創建於 669 年，平城京遷都後成為藤原氏氏神寺，曾是奈良最具勢力的寺院。五重塔（高 50 公尺）建於 730 年，是奈良的象徵地標，也是日本現存第二高木造塔。\n\n國寶館珍藏著名的「阿修羅立像」——六手、三面，神情哀愁而神秘，被譽為日本最美佛像之一，為奈良時代（8 世紀）乾漆造工藝的極致。',
          ticketInfo: '境內免費｜國寶館 ¥1,000｜東金堂 ¥300',
          mapQuery: '興福寺 奈良',
        },
      },
      {
        id: 'd5-nara-park',
        time: '10:50',
        title: '奈良公園・餵鹿',
        type: 'attraction',
        details: {
          culturalNote: '奈良公園面積約 660 公頃，自由放養超過 1,200 頭梅花鹿，被視為春日大社神的使者，是國家天然紀念物。鹿仙貝（shika senbei）¥200/捆，鹿會學著向人低頭鞠躬討食。',
          mapQuery: '奈良公園',
          foodRecs: [
            { name: '中谷堂', note: '猿沢池旁超速現打麻糬，師傅手速驚人如表演，可免費試吃' },
          ],
          recommendations: ['不餵時用手背讓鹿嗅，比較安全不易被頂', '仙貝藏好，鹿會扯包包！', '猿沢池倒影配五重塔是最美構圖之一'],
        },
      },
      {
        id: 'd5-lunch',
        time: '12:00',
        title: '奈良午餐',
        type: 'food',
        details: {
          foodRecs: [
            { name: '大佛布丁（大仏プリン）', note: '奈良名物，超大罐奶油布丁，多種口味，建議早點去避免售完' },
            { name: '志津香 釜飯', note: '奈良老字號，窯飯食材豐富，有素食選項，可能需排隊' },
            { name: 'YUKI 亭', note: '蛋包飯專賣，份量紮實，評價穩定' },
            { name: '柿の葉壽司 たなか', note: '奈良名物，鯖魚或鮭魚用柿葉包裹醃製，古樸風味' },
          ],
        },
      },
      {
        id: 'd5-to-todaiji',
        time: '13:15',
        title: '前往東大寺',
        type: 'transport',
        details: {
          transportInfo: '步行約 15 分，穿越奈良公園北側鹿群路徑',
        },
      },
      {
        id: 'd5-todaiji',
        time: '13:30',
        title: '東大寺',
        type: 'attraction',
        details: {
          culturalNote: '東大寺大佛殿是世界現存最大的木造建築，正面寬 57 公尺。殿內的大佛（盧舍那佛）高 14.98 公尺，鑄造於西元 743 年，聖武天皇為祈求國家安泰所建。\n\n【二月堂】在大佛殿後方山丘上，可俯瞰奈良市街全景，是拍攝大佛殿屋頂的最佳角度。',
          ticketInfo: '大佛殿 ¥600｜二月堂免費',
          mapQuery: '東大寺 奈良',
          recommendations: ['殿內木柱有個與大佛鼻孔同尺寸的洞（37×30 cm），鑽過去據說得幸運', '二月堂在東大寺後方山路步行 5 分，值得繞過去'],
          spotRecs: [
            { name: '春鹿酒造', note: '奈良知名清酒廠，東大寺周邊，可試飲，¥500 五杯套組，帶伴手禮的好地方' },
          ],
        },
      },
      {
        id: 'd5-to-kasuga',
        time: '14:45',
        title: '前往春日大社',
        type: 'transport',
        details: {
          transportInfo: '步行約 15 分，穿越飛火野草原（大片草地，鹿群聚集，風景最美路段）',
        },
      },
      {
        id: 'd5-kasuga',
        time: '15:00',
        title: '春日大社',
        type: 'attraction',
        details: {
          culturalNote: '春日大社建立於西元 768 年，奈良時代守護都城的重要神社，世界文化遺產。境內有超過 3,000 座燈籠（石燈籠 + 吊燈籠），每年 2 月與 8 月舉行「萬燈籠」夜間點燈，場景夢幻壯觀。春日大社同時也是白鹿傳說的起源地——白鹿引導神明從鹿島（茨城）來到奈良。',
          ticketInfo: '外苑免費｜本殿特別參拜 ¥500',
          mapQuery: '春日大社 奈良',
          foodRecs: [
            { name: '春日荷茶屋', note: '神苑內百年茶屋，萬葉粥套餐清淡雅緻，11:00–16:00' },
          ],
        },
      },
      {
        id: 'd5-wakakusa',
        time: '16:00',
        title: '若草山（可選）',
        type: 'attraction',
        details: {
          ticketInfo: '登山費 ¥150，單程約 30 分可到山頂，提供奈良全景',
          recommendations: ['時間不夠可跳過', '山頂可同時看到東大寺屋頂與奈良市街'],
          mapQuery: '若草山 奈良',
        },
      },
      {
        id: 'd5-to-abeno',
        time: '17:00',
        title: '移動至阿倍野',
        type: 'transport',
        details: {
          transportInfo: '近鐵奈良站 急行 → 大阪難波站（約 40 分）→ 御堂筋線 → 天王寺站（約 7 分）',
          transportAlt: 'JR 奈良站 大和路線 → JR 天王寺站（約 40 分，步行至 JR 奈良站需 20 分）',
        },
      },
      {
        id: 'd5-abeno',
        time: '18:30',
        title: '阿倍野 Harukas 展望台',
        type: 'attraction',
        details: {
          culturalNote: '阿倍野 Harukas 高 300 公尺，是日本最高的超高層建築。58–60 樓「Harukas 300」展望台視野 360 度無阻，晴天可見大阪灣和六甲山脈。從黃昏等到入夜可同時看到夕陽西沉和大阪夜景。\n\n現有《葬送のフリーレン》（芙莉蓮）聯動企劃，展望台內有限定裝飾與合照點。',
          ticketInfo: '展望台 Harukas 300 ¥1,800，建議黃昏前進場待到天黑',
          mapQuery: 'あべのハルカス 天王寺',
          recommendations: ['17:00 後入場可看夕陽也可看夜景，最划算', '天王寺公園和動物園在旁邊，可提早到附近晃'],
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
        id: 'd6-to-osaka-castle',
        time: '09:30',
        title: '移動至大阪城',
        type: 'transport',
        details: {
          transportInfo: '飯店步行至桜川站 → 千日前線 → 谷町九丁目站 → 谷町線 → 谷町四丁目站（¥240，大阪城最近出口）',
          transportAlt: '步行至 JR 難波站（約 10 分）→ 大和路快速 → JR 大阪城公園站',
        },
      },
      {
        id: 'd6-osaka-castle',
        time: '10:00',
        title: '大阪城公園・柯南巡禮',
        type: 'attraction',
        details: {
          culturalNote: '大阪城由豐臣秀吉於 1583 年開始修建，是當時日本最大的城堡，秀吉以此為根基統一天下。現在的天守閣是 1931 年重建版本，但城壁、石垣和護城河仍保留歷史原貌，城郭占地廣大，散步一圈風景優美。\n\n【柯南巡禮】大阪城旁的讀賣電視台（ytv 大樓）外廣場設有柯南偵探團多座角色銅像，是名偵探柯南粉絲必訪打卡點。大阪城公園內目前也有柯南聯動活動。',
          ticketInfo: '城郭免費散步｜天守閣 ¥600（可跳過）',
          mapQuery: '大阪城公園',
          spotRecs: [
            { name: 'ytv 大樓（読売テレビ）', note: '大阪城旁，戶外廣場有柯南偵探團多座角色銅像，步行約 5 分' },
            { name: 'MIRAIZA OSAKA-JO', note: '城郭內歷史建築改建，有咖啡廳、義大利餐廳、伴手禮店，環境優雅' },
          ],
          recommendations: [
            '柯南 25 周年活動中，出發前可查詢大阪城公園最新活動資訊',
            '天守閣 8 樓頂端可遠眺大阪市區，可進可不進',
          ],
        },
      },
      {
        id: 'd6-lunch',
        time: '12:00',
        title: '大阪城附近午餐',
        type: 'food',
        details: {
          foodRecs: [
            { name: 'MIRAIZA OSAKA-JO', note: '城郭內歷史建築，義大利料理，景觀佳，午間 11:00–16:00' },
            { name: '京橋 商店街', note: '森之宮站搭大阪環狀線 1 站到京橋，串炸、燒鳥、定食選擇多，大阪庶民風格' },
          ],
        },
      },
      {
        id: 'd6-to-shinsaibashi',
        time: '13:00',
        title: '移動至心齋橋',
        type: 'transport',
        details: {
          transportInfo: '森之宮站 長堀鶴見綠地線 → 心齋橋站（約 10 分，¥240）',
        },
      },
      {
        id: 'd6-shinsaibashi',
        time: '13:15',
        title: '心齋橋 → 道頓堀 → 難波 慢慢逛',
        type: 'attraction',
        details: {
          culturalNote: '道頓堀是大阪最著名的娛樂街，以螃蟹廣告招牌和固力果跑步人看板聞名。心齋橋筋商店街長超過 600 公尺，是大阪最熱鬧的購物街。黑門市場被稱為「大阪的廚房」，可邊走邊吃新鮮海鮮熟食。',
          mapQuery: '心斎橋筋商店街 大阪',
          recommendations: [
            '固力果跑步人看板打卡：道頓堀橋上朝東望最佳角度',
            '梅田空中展望庭園（梅田 Sky Building，¥1,500，22:00 前，可選）',
          ],
          foodRecs: [
            { name: '道頓堀 今井うどん', note: '百年老舖烏龍麵，湯頭鮮甜，道頓堀必吃之一' },
            { name: 'たこ家道頓堀くくる', note: '道頓堀知名章魚燒，皮薄內軟，醬料選擇多' },
            { name: '千とせ 本店', note: '大阪名物「肉吸」（肉湯泡飯），吉本藝人愛店，黑門市場附近' },
            { name: '美津野 大阪燒', note: '道頓堀老字號，山芋比例高，口感鬆軟，要排隊' },
          ],
          spotRecs: [
            { name: '黑門市場', note: '新鮮海鮮、水果、熟食攤位，邊走邊吃，週日最熱鬧' },
            { name: 'Don Quijote 道頓堀店', note: '24 小時，化妝品藥妝最便宜，最齊全' },
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
        id: 'd7-breakfast',
        time: '07:15',
        title: '早餐（快速出發前）',
        type: 'food',
        details: {
          foodRecs: [
            { name: '便利商店（7-Eleven / FamilyMart / Lawson）', note: '飯店附近多家，飯糰 + 三明治 + 咖啡，最快最省，強烈推薦 USJ 日首選' },
            { name: 'マクドナルド 難波', note: '難波周邊多店，早安餐 07:00 起，麥滿分/鬆餅套餐，快速填肚' },
            { name: 'ミスタードーナツ 難波', note: '甜甜圈 + 熱咖啡，座位少，建議外帶邊走' },
          ],
          recommendations: ['USJ 開園前排隊人很多，早餐以不超過 30 分鐘為原則', '可前一晚在便利商店買好早餐食材，隔天直接帶走'],
        },
      },
      {
        id: 'd7-usj-transit',
        time: '08:00',
        title: '前往 USJ',
        type: 'transport',
        details: {
          transportInfo: '飯店步行至桜川站 → 阪神難波線 → 西九條站 → JR 夢咲線 → 環球城站（車程約 30 分，¥400/人）',
        },
      },
      {
        id: 'd7-usj',
        time: '09:00',
        title: '環球影城 USJ',
        type: 'attraction',
        details: {
          culturalNote: '大阪環球影城 2001 年開幕，是日本最大的主題樂園之一。任天堂世界（超級任天堂世界）是最熱門的園區，以《超級瑪利歐》為主題，可配合 Nintendo Switch 手環進行互動遊戲。哈利波特魔法世界的霍格華茲城堡入夜後有燈光秀，奶油啤酒是必喝飲料（冰熱皆有）。\n\n現有聯動：咒術迴戰・東野圭吾・名偵探柯南。',
          ticketInfo: '門票已買好！開園時間通常 9:00–21:00（每日不同），前一天晚上記得確認隔日時間表',
          mapQuery: 'Universal Studios Japan Osaka',
          spotRecs: [
            { name: '超級任天堂世界', note: '進場第一件事立刻用 App 抽整理券！天黑後人少可直接進' },
            { name: '哈利波特魔法世界', note: '禁忌之旅（模擬飛行）、霍格華茲城堡，奶油啤酒必喝' },
            { name: '咚奇剛礦山車', note: '新設施，熱門，建議早到開園時衝' },
            { name: '大白鯊', note: '刺激，排隊時間相對短，適合空檔插隊' },
            { name: '水世界', note: '表演秀，事先查好當日場次時間（會淋濕！）' },
          ],
          foodRecs: [
            { name: '奶油啤酒（Butterbeer）', note: '哈利波特區必喝，冰飲版有奶油泡沫，甜而不膩' },
            { name: 'SUPER NINTENDO WORLD 小吃', note: '蘑菇形狀爆米花、問號磚塊可樂餅，園區限定造型食物' },
            { name: '環球美食廣場', note: '近入口處，拉麵、炸物、漢堡選擇多，人多時午餐前後避開尖峰' },
          ],
          recommendations: [
            '進場後哪裡人少去哪裡，不用硬照順序走',
            '想玩任天堂手環遊戲需在園內購買 Nintendo Switch 手環',
            '想買 USJ 髮箍（可愛度 100%），入口旁商店有賣',
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
        id: 'd8-breakfast',
        time: '08:00',
        title: '最後早餐',
        type: 'food',
        details: {
          foodRecs: [
            { name: '喫茶店モーニング', note: '大阪喫茶文化：一杯咖啡附贈吐司 + 水煮蛋，¥500–700，道地早餐體驗，難波周邊隨處可見' },
            { name: '551蓬萊 難波本店', note: '大阪名物豬肉包，現蒸熱騰騰，可當早餐外帶，09:00 起（確認當日開門時間），帶幾個上機！' },
            { name: '便利商店', note: '最後一次日本便利商店早餐，飯糰 + 關東煮，簡單但也是回憶' },
          ],
          recommendations: ['10:30 前要出門前往南海難波站，早餐控制在 1 小時內', '551蓬萊肉包帶上飛機可以！（熟食可帶登機）'],
        },
      },
      {
        id: 'd8-checkout',
        time: '09:00',
        title: '退房',
        type: 'hotel',
        details: {
          recommendations: ['10:00 前退房'],
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
          recommendations: ['Terminal 1 入境', '記得安排共乘接送！'],
        },
      },
    ],
  },
]

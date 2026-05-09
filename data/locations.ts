import { ITINERARY } from './itinerary'

export interface ShoppingLocation {
  id: string        // activity id
  name: string      // clean display name
  dayNumber: number
}

// Clean display names for each shopping-relevant activity
const CLEAN_NAMES: Record<string, string> = {
  'd1-arrive':        '關西機場（入境）',
  'd2-higasfhiyama':   '東山・二年坂・三年坂',
  'd2-kiyomizudera':  '清水寺',
  'd2-yasaka':        '八坂神社・祇園',
  'd2-shimogamo':     '下鴨神社・糺之森',
  'd3-fushimi':       '伏見稻荷大社',
  'd3-uji':           '宇治',
  'd3-byodoin':       '平等院',
  'd4-arashiyama':    '嵐山',
  'd5-nara-park':     '奈良公園',
  'd5-todaiji':       '東大寺',
  'd5-kasuga':        '春日大社',
  'd5-abeno':         '阿倍野・天王寺',
  'd6-osaka-castle':  '大阪城公園',
  'd6-shinsaibashi':  '心齋橋・道頓堀・難波',
  'd7-usj':           '環球影城 USJ',
  'd8-to-airport':    '關西機場（出發）',
}

const SHOPPING_IDS = new Set(Object.keys(CLEAN_NAMES))

export const SHOPPING_LOCATIONS: ShoppingLocation[] = ITINERARY.flatMap((day) =>
  day.activities
    .filter((a) => SHOPPING_IDS.has(a.id))
    .map((a) => ({
      id: a.id,
      name: CLEAN_NAMES[a.id],
      dayNumber: day.dayNumber,
    }))
)

export function getLocationName(locationId: string | null | undefined): string | null {
  if (!locationId) return null
  return CLEAN_NAMES[locationId] ?? null
}

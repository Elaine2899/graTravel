'use client'

import { createPortal } from 'react-dom'
import { deleteField, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Member } from '@/types'

const MOOD_EMOJIS = ['🔥', '😴', '🤩', '😊', '🥲', '😤', '🤔', '🤤', '🥳', '😎']

interface Props {
  member: Member
  activityId: string
  onClose: () => void
}

export default function MoodPicker({ member, activityId, onClose }: Props) {
  const handlePick = async (emoji: string) => {
    await setDoc(doc(db, 'activityMoods', activityId), { [member]: emoji }, { merge: true })
    onClose()
  }

  const handleClear = async () => {
    await setDoc(doc(db, 'activityMoods', activityId), { [member]: deleteField() }, { merge: true })
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bottom-24 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-gray-400 text-center mb-3">選一個心情</p>
        <div className="flex justify-around">
          {MOOD_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handlePick(emoji)}
              className="text-2xl p-1.5 rounded-xl hover:bg-gray-100 active:scale-90 transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
        <button
          onClick={handleClear}
          className="mt-3 w-full py-2 rounded-xl text-xs font-medium text-red-400 bg-red-50 active:bg-red-100 transition-colors"
        >
          清除心情
        </button>
      </div>
    </div>,
    document.body
  )
}

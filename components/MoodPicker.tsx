'use client'

import { useEffect, useRef } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Member } from '@/types'

const MOOD_EMOJIS = ['🔥', '😴', '🤩', '😊', '🥲', '😤', '🤔', '🤤', '🥳', '😎']

interface Props {
  member: Member
  date: string
  onClose: () => void
}

export default function MoodPicker({ member, date, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handlePick = async (emoji: string) => {
    await setDoc(doc(db, 'moods', date), { [member]: emoji }, { merge: true })
    onClose()
  }

  return (
    <div
      ref={ref}
      className="absolute left-4 right-4 top-full mt-1 z-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-3"
    >
      <div className="flex justify-around">
        {MOOD_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handlePick(emoji)}
            className="text-xl p-1.5 rounded-xl hover:bg-gray-100 active:scale-90 transition-all"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

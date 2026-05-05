'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  title: string
  content: string
  onClose: () => void
}

export default function CulturalNoteModal({ title, content, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] flex flex-col bg-white rounded-t-3xl max-w-lg mx-auto">
        {/* Handle + header */}
        <div className="shrink-0 pt-3 px-5 pb-4 border-b border-gray-100">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <h2 className="font-bold text-gray-900 text-base">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="overflow-y-auto px-5 py-4">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
        </div>
      </div>
    </>,
    document.body
  )
}

// components/DialogBridge.tsx
'use client'

import { useEffect } from 'react'
import { useDialogStore } from '@/lib/dialogStore'

export default function DialogBridge() {
  const push = useDialogStore((s) => s.push)

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      console.log('DialogBridge received:', e.data)
      if (e.data?.type === 'dialog') {
        push(e.data.payload)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [push])

  return null
}

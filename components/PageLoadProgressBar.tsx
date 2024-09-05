"use client"

import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { usePathname, useSearchParams } from 'next/navigation'

export function PageLoadProgressBar() {
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setProgress(100)
    const timer = setTimeout(() => setProgress(0), 400)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  if (progress === 0) return null

  return <Progress value={progress} className="h-1 fixed top-0 left-0 right-0 z-50" />
}
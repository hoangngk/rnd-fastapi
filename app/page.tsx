'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [input, setInput] = useState<string>('')
  const [searchResults, setSearchResults] = useState<{
    results: string[]
    duration: string
  }>()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined)
      const res = await fetch(`/api/search?q=${input}`)
    }

    fetchData()
  }, [input])

  useEffect(() => {
    if (inputRef.current) {
      console.log('focus')
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="flex justify-center items-center h-screen">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="px-3 py-2 border border-gray-300 w-1/2 rounded-lg"
      />
    </div>
  )
}

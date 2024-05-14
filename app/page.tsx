'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'

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
      const data = await res.json()
      setSearchResults(data)
    }

    fetchData()
  }, [input])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <main className="h-screen w-screen grainy">
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <h1 className="text-5xl tracking-tight font-bold">Speed Search</h1>
        <p className="text-zinc-600 text-lg max-w-prose text-center">
          A high-performance API built with Hono, Next.js and Cloudflare.
          <br /> Type a query blow and get your results in milliseconds.
        </p>
        <div className="w-1/2">
          <Command>
            <CommandInput
              value={input}
              onValueChange={(e) => setInput(e)}
              placeholder="Search countries..."
              className="placehoder:text-zinc-500"
            />
            <CommandList>
              {searchResults?.results?.length === 0 ? (
                <CommandEmpty>No result found.</CommandEmpty>
              ) : null}

              {searchResults?.results ? (
                <CommandGroup heading="Results">
                  {searchResults.results.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}
                      className="cursor-pointer">
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </div>
      </div>
    </main>
  )
}

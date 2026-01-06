'use client'

/**
 * Multi-Part Story Management Utilities
 * Handles parsing, splitting, and managing multi-part stories
 */

export interface StoryPart {
  partNumber: number
  title: string
  content: string
  summary?: string
  timestamp: number
  wordCount: number
  readingMinutes: number
}

export interface PartBookmark {
  storyId: string
  partNumber: number
  scrollPosition: number
  timestamp: number
}

/**
 * Parse a multi-part story into individual parts
 * Looks for part separators like:
 * ╔════════════════════════════════════════╗
 * ║         📖 Part 2 dimulai...           ║
 * ╚════════════════════════════════════════╝
 */
export function parseMultiPartStory(storyText: string): StoryPart[] {
  const parts: StoryPart[] = []
  
  // Split by part separator pattern
  const partSeparatorRegex = /╔═+╗[\s\S]*?📖 Part (\d+) dimulai\.\.\.[\s\S]*?╚═+╝/g
  const splits = storyText.split(partSeparatorRegex)
  
  if (splits.length === 1) {
    // Single part story
    const { title, content } = extractTitleAndContent(storyText)
    const wordCount = content.split(/\s+/).length
    
    parts.push({
      partNumber: 1,
      title: title || 'Cerita',
      content,
      timestamp: Date.now(),
      wordCount,
      readingMinutes: Math.ceil(wordCount / 200)
    })
  } else {
    // Multi-part story
    for (let i = 0; i < splits.length; i++) {
      if (splits[i].trim()) {
        const partContent = splits[i].trim()
        const { title, content } = extractTitleAndContent(partContent)
        const wordCount = content.split(/\s+/).length
        
        // Determine part number
        let partNumber = 1
        if (i > 0) {
          // Look for part number in previous split (the separator)
          const prevSplit = splits[i - 1]
          const match = prevSplit.match(/Part (\d+)/)
          partNumber = match ? parseInt(match[1]) : i + 1
        }
        
        parts.push({
          partNumber,
          title: title || `Part ${partNumber}`,
          content,
          timestamp: Date.now(),
          wordCount,
          readingMinutes: Math.ceil(wordCount / 200)
        })
      }
    }
  }
  
  return parts
}

/**
 * Extract title and content from story text
 */
function extractTitleAndContent(text: string): { title: string | null; content: string } {
  // Match **[TITLE]** or **TITLE**
  const titleMatch = text.match(/\*\*\[(.*?)\]\*\*/)
  if (titleMatch) {
    const title = titleMatch[1]
    const content = text.replace(titleMatch[0], '').trim()
    return { title, content }
  }
  
  const altTitleMatch = text.match(/\*\*(.*?)\*\*/)
  if (altTitleMatch && altTitleMatch.index === 0) {
    const title = altTitleMatch[1]
    const content = text.replace(altTitleMatch[0], '').trim()
    return { title, content }
  }
  
  return { title: null, content: text }
}

/**
 * Create a formatted multi-part story text
 */
export function formatMultiPartStory(parts: StoryPart[]): string {
  if (parts.length === 0) return ''
  if (parts.length === 1) return `**${parts[0].title}**\n\n${parts[0].content}`
  
  let formatted = `**${parts[0].title}**\n\n${parts[0].content}`
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]
    const separator = `\n\n╔════════════════════════════════════════╗\n║         📖 Part ${part.partNumber} dimulai...           ║\n║    Petualangan berlanjut...               ║\n╚════════════════════════════════════════╝\n\n`
    formatted += separator + `**${part.title}**\n\n${part.content}`
  }
  
  return formatted
}

/**
 * Get a specific part by number
 */
export function getPartByNumber(parts: StoryPart[], partNumber: number): StoryPart | null {
  return parts.find(p => p.partNumber === partNumber) || null
}

/**
 * Export a specific part as text
 */
export function exportPart(part: StoryPart): void {
  const partText = `${part.title}\n\nPart ${part.partNumber}\n\n${part.content}`
  const blob = new Blob([partText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${part.title} - Part ${part.partNumber}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export all parts as separate files in a zip (simplified version - exports one by one)
 */
export function exportAllParts(parts: StoryPart[]): void {
  parts.forEach((part, index) => {
    setTimeout(() => {
      exportPart(part)
    }, index * 500) // Stagger downloads
  })
}

/**
 * Save part bookmark to localStorage
 */
export function savePartBookmark(bookmark: PartBookmark): void {
  const bookmarks = getPartBookmarks()
  const existingIndex = bookmarks.findIndex(
    b => b.storyId === bookmark.storyId && b.partNumber === bookmark.partNumber
  )
  
  if (existingIndex >= 0) {
    bookmarks[existingIndex] = bookmark
  } else {
    bookmarks.push(bookmark)
  }
  
  localStorage.setItem('neon-tales-part-bookmarks', JSON.stringify(bookmarks))
}

/**
 * Get all part bookmarks
 */
export function getPartBookmarks(): PartBookmark[] {
  if (typeof window === 'undefined') return []
  
  const saved = localStorage.getItem('neon-tales-part-bookmarks')
  return saved ? JSON.parse(saved) : []
}

/**
 * Get bookmark for specific story part
 */
export function getPartBookmark(storyId: string, partNumber: number): PartBookmark | null {
  const bookmarks = getPartBookmarks()
  return bookmarks.find(
    b => b.storyId === storyId && b.partNumber === partNumber
  ) || null
}

/**
 * Update part with summary
 */
export function updatePartSummary(parts: StoryPart[], partNumber: number, summary: string): StoryPart[] {
  return parts.map(part => 
    part.partNumber === partNumber 
      ? { ...part, summary }
      : part
  )
}

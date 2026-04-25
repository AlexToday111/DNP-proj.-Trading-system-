import { useEffect, useMemo } from 'react'
import { type PageId } from '../types/trading'

const visitedPages = new Set<PageId>()

export function useFirstPageVisit(page: PageId) {
  const isFirstVisit = useMemo(() => !visitedPages.has(page), [page])

  useEffect(() => {
    visitedPages.add(page)
  }, [page])

  return isFirstVisit
}

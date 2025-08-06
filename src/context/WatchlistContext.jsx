import { createContext, useContext, useEffect, useState } from 'react'

// Context to track watchlist and browse count
const WatchlistContext = createContext()

export function WatchlistProvider({ children }) {
  // --- Watchlist state (persisted to localStorage) ---
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = window.localStorage.getItem('watchlist')
      return stored ? JSON.parse(stored) : []
    } catch (err) {
      return []
    }
  })

  const [browseCount, setBrowseCount] = useState(() => {
    try {
      const stored = window.localStorage.getItem('browseCount')
      return stored ? JSON.parse(stored) : 0
    } catch (err) {
      return 0
    }
  })

  useEffect(() => {
    window.localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [watchlist])
  useEffect(() => {
    window.localStorage.setItem('browseCount', JSON.stringify(browseCount))
  }, [browseCount])

  // --- Core functions ---
  const addToWatchlist = movie => {
    setWatchlist(prev => {
      if (prev.find(item => item.id === movie.id)) return prev
      return [...prev, movie]
    })
  }

  const removeFromWatchlist = id => {
    setWatchlist(prev => prev.filter(item => item.id !== id))
  }

  const incrementBrowseCount = () => setBrowseCount(count => count + 1)

  // --- New: Update rating/status for a movie ---
  const setWatchlistRating = (id, rating) => {
    setWatchlist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, rating } : item
      )
    )
  }

  const updateWatchlistStatus = (id, status) => {
    setWatchlist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status } : item
      )
    )
  }

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      browseCount,
      addToWatchlist,
      removeFromWatchlist,
      incrementBrowseCount,
      setWatchlistRating,
      updateWatchlistStatus,
    }}>
      {children}
    </WatchlistContext.Provider>
  )
}

// Hook for using the context in components
export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (!context) throw new Error('useWatchlist must be used within a WatchlistProvider')
  return context
}

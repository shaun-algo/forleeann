'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Attempt autoplay on user interaction
    const attemptAutoplay = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            // Autoplay was blocked, set to paused
            setIsPlaying(false)
          })
      }
    }

    // Try to play immediately
    attemptAutoplay()

    // Also try on first user interaction
    const handleFirstInteraction = () => {
      attemptAutoplay()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [])

  useEffect(() => {
    // Update audio volume
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/Enchanted.mp3"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isExpanded ? (
            // Expanded mini player box
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1E1A2E]/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-[#9B7FC8]/30"
            >
              <div className="flex items-center gap-4">
                {/* Spinning vinyl disk */}
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 10, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                  onClick={togglePlay}
                  className="relative cursor-pointer w-16 h-16 rounded-full overflow-hidden border-3 border-[#1E1A2E] shadow-lg flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="/taylorswift.jpeg"
                    alt="Taylor Swift Album Art"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#1E1A2E] border-2 border-[#9B7FC8]/50" />
                  </div>
                  {!isPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full"
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </motion.div>
                  )}
                </motion.div>

                {/* Controls */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">Enchanted</span>
                    <button
                      onClick={toggleExpand}
                      className="text-[#9B7FC8] hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Volume slider */}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#9B7FC8]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-[#9B7FC8]/30 rounded-full appearance-none cursor-pointer accent-[#9B7FC8]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Collapsed - just the disc
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 1 }}
              onClick={toggleExpand}
              className="relative cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 10, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#1E1A2E] shadow-lg"
                style={{
                  boxShadow: isPlaying
                    ? '0 0 30px rgba(155, 127, 200, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3)'
                    : '0 0 15px rgba(155, 127, 200, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                <img
                  src="/taylorswift.jpeg"
                  alt="Taylor Swift Album Art"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#1E1A2E] border-2 border-[#9B7FC8]/50" />
                </div>
              </motion.div>

              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'repeating-radial-gradient(circle at center, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

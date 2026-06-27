'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PetalsExplosion from './PetalsExplosion'

const FlowerMatchingGame = ({ onWin }: { onWin: () => void }) => {
  const [cards, setCards] = useState<Array<{ id: number; icon: string; isFlipped: boolean; isMatched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [isGameWon, setIsGameWon] = useState(false)
  const [showExplosion, setShowExplosion] = useState(false)

  const explosionSound = useRef<HTMLAudioElement | null>(null)
  const flowersSound = useRef<HTMLAudioElement | null>(null)
  const matchedSound = useRef<HTMLAudioElement | null>(null)

  // Flower icons for matching
  const flowerIcons = [
    '/icons/anemone.png',
    '/icons/daisy.png',
    '/icons/lavender.png',
    '/icons/rose.png',
    '/icons/sunflower.png',
    '/icons/flower-bouquet.png'
  ]

  // Initialize game
  const initializeGame = () => {
    const cardPairs = [...flowerIcons, ...flowerIcons]
    const shuffled = cardPairs
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlippedCards([])
    setIsGameWon(false)
    setShowExplosion(false)
  }

  useEffect(() => {
    initializeGame()
    
    // Initialize audio
    explosionSound.current = new Audio('/mp3_effects/explotion.mp3')
    flowersSound.current = new Audio('/mp3_effects/flowers.mp3')
    matchedSound.current = new Audio('/mp3_effects/matched.mp3')
  }, [])

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) return

    const newCards = [...cards]
    newCards[cardId].isFlipped = true
    setCards(newCards)

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped
      if (newCards[firstId].icon === newCards[secondId].icon) {
        // Match found - play matched sound immediately
        if (matchedSound.current) {
          matchedSound.current.currentTime = 0
          matchedSound.current.play()
        }

        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[firstId].isMatched = true
          matchedCards[secondId].isMatched = true
          setCards(matchedCards)
          setFlippedCards([])

          // Check if all matched
          if (matchedCards.every(card => card.isMatched)) {
            setIsGameWon(true)
            setShowExplosion(true)
            
            // Play flowers sound when all matched
            if (flowersSound.current) {
              flowersSound.current.currentTime = 0
              flowersSound.current.play()
            }
            
            onWin()
          }
        }, 500)
      } else {
        // No match - flip back
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[firstId].isFlipped = false
          resetCards[secondId].isFlipped = false
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Restart game
  const handleRestart = () => {
    initializeGame()
  }

  return (
    <section className="relative py-32 lg:py-40 px-8 lg:px-16 min-h-screen flex flex-col items-center justify-center">
      {showExplosion && <PetalsExplosion />}
      
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#9B7FC8] font-medium">
            Match the Flowers
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#4A4060] mb-8 text-sm"
        >
          Click the cards to find matching flower pairs
        </motion.p>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-8">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isFlipped || card.isMatched ? 1 : 0.95 }}
              className={`aspect-square rounded-lg flex items-center justify-center text-4xl transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? 'bg-gradient-to-br from-[#9B7FC8] to-[#BDB0D8] text-white'
                  : 'bg-[#1E1A2E]/5 hover:bg-[#9B7FC8]/10'
              } ${card.isMatched ? 'opacity-50' : ''}`}
            >
              {card.isFlipped || card.isMatched ? (
                <img src={card.icon} alt="Flower" className="w-8 h-8 object-contain" />
              ) : (
                '?'
              )}
            </motion.button>
          ))}
        </div>

        {/* Restart Button */}
        <motion.button
          onClick={handleRestart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-[#9B7FC8]/10 hover:bg-[#9B7FC8]/20 text-[#9B7FC8] rounded-full text-sm tracking-wide transition-all duration-300"
        >
          Restart Game
        </motion.button>

      </div>
    </section>
  )
}

export default FlowerMatchingGame

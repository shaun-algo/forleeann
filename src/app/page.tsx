'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Gallery3D from '@/components/Gallery3D'
import Fireworks from '@/components/Fireworks'
import FlowerMatchingGame from '@/components/FlowerMatchingGame'

// 3D Background with clean styling - optimized loading
const InteractiveBook = dynamic(() => import('@/components/InteractiveBook'), { ssr: false, loading: () => <div className="w-full h-full bg-[#F7F5FC] animate-pulse" /> })
const Butterflies = dynamic(() => import('@/components/Butterflies'), { ssr: false })

// Navigation
function Navigation({ hasFlower, onCartClick, cartRef, hasMinimizedOnce, shouldShake }: { hasFlower: boolean; onCartClick: () => void; cartRef: React.RefObject<HTMLButtonElement>; hasMinimizedOnce: boolean; shouldShake: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-8 lg:px-16 py-5 transition-all duration-500 ${scrolled
        ? 'bg-[#1E1A2E]/55 backdrop-blur-xl border-b border-white/5'
        : 'bg-black/10'
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.a
          href="#"
          className="font-serif italic text-xl text-white/90 tracking-wide"
          whileHover={{ scale: 1.02 }}
        >
          ♡
        </motion.a>

        <div className="hidden md:flex items-center gap-12">
          {['Gallery', 'Letter'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="text-xs tracking-[0.2em] uppercase text-[#C0AEDE] hover:text-white transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D5C8EE] transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            ref={cartRef}
            onClick={onCartClick}
            animate={shouldShake ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-10 h-10 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-colors ${hasFlower ? 'text-[#D5C8EE]' : 'text-white/60'}`}
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {hasMinimizedOnce && (
              <motion.img
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                src="/flower.png"
                alt="Flower"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 object-contain"
              />
            )}
          </motion.button>

          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-6 flex flex-col justify-between"
          >
            <span className={`block h-px bg-white/80 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px bg-white/80 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-white/80 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-6"
          >
            {['Gallery', 'Letter'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="block py-3 text-sm tracking-[0.15em] uppercase text-[#8A82A0]"
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// Section Divider - Clean minimal line
function SectionDivider() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="flex items-center justify-center py-4">
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={isInView ? { width: 96, opacity: 1 } : { width: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-px bg-gradient-to-r from-transparent via-[#BDB0D8] to-transparent"
      />
    </div>
  )
}

// Section Label - Clean typography
const SectionLabel = memo(function SectionLabel({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-16 ${align === 'center' ? 'text-center' : ''}`}
    >
      <span className="text-[11px] tracking-[0.25em] uppercase text-[#9B7FC8] font-medium">
        {children}
      </span>
    </motion.div>
  )
})

// Hero Section
const Hero = memo(function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-end overflow-hidden">

      {/* Hero background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Simple dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/15 to-black/25" />

      {/* Simple ambient orbs - reduced complexity */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#7A68B0]/25 blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#8A7ABE]/20 blur-[120px]"
      />

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 px-8 lg:px-16 pb-20 lg:pb-28 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/80 text-xs tracking-[0.3em] uppercase mb-6"
        >
          Mundulum quod tibi soli feci
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-light text-5xl md:text-7xl lg:text-8xl text-white leading-[1.08] mb-8 drop-shadow-lg"
        >
          Tu es<br />
          mea <span className="italic text-[#5A4A75]">carissima</span><br />
          omnia.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-white/70 text-sm tracking-wide"
        >
          Omne momentum memoriam nostri tenet.
        </motion.p>
      </motion.div>

      {/* Scroll indicator - minimal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 right-10 z-10 flex items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-10 bg-white/60"
        />
        <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase">scroll</span>
      </motion.div>
    </section>
  )
})


// Gallery is now handled by Gallery3D component

// Reasons Section - Clean Grid
const Reasons = memo(function Reasons() {
  const reasons = [
    { num: "01", text: "The way you laugh before the punchline even lands." },
    { num: "02", text: "How you make every room feel warmer just by being in it." },
    { num: "03", text: "You remember the small things no one else notices." },
    { num: "04", text: "The quiet mornings feel complete when you're there." },
    { num: "05", text: "You are somehow both soft and the strongest person I know." },
    { num: "06", text: "I'm better at being me because I know you." },
  ]

  return (
    <section
      className="relative py-32 lg:py-40 px-8 lg:px-16"
    >
      {/* Fixed background for parallax effect */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url(/stitch.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Reasons</SectionLabel>

        {/* Clean grid with subtle borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => {
            const ref = useRef(null)
            const isInView = useInView(ref, { once: true, margin: '-50px' })

            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, y: 35 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative p-8 lg:p-10 group cursor-pointer border border-transparent hover:border-[#9B7FC8]/10 rounded-lg transition-colors duration-500"
              >
                {/* Clean subtle background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#9B7FC8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Large number - clean typography */}
                <div className="font-serif text-5xl lg:text-6xl font-light text-[#D5C8EE] group-hover:text-[#9B7FC8]/30 transition-all duration-500">
                  {reason.num}
                </div>

                {/* Text */}
                <p className="mt-4 text-sm lg:text-base leading-relaxed text-[#1E1A2E] relative z-10">
                  {reason.text}
                </p>

                {/* Clean corner accent */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#9B7FC8]/20 group-hover:w-full group-hover:h-full group-hover:border-transparent group-hover:bg-[#9B7FC8]/5 transition-all duration-300" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
})

// Letter Section - Interactive Book
const Letter = memo(function Letter() {
  return (
    <section
      id="letter"
      className="relative py-24 sm:py-32 lg:py-40 px-2 sm:px-8 lg:px-16 overflow-hidden bg-[#F7F5FC]"
    >
      {/* Gentle lilac glow falling from above */}
      <div className="absolute pointer-events-none"
        style={{
          top: '15%', left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(300px, 45vw, 620px)',
          height: 'clamp(180px, 28vw, 380px)',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(155,127,200,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Lavender bloom reflection */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute pointer-events-none"
        style={{
          top: '30%', left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(260px, 40vw, 560px)',
          height: 'clamp(260px, 40vw, 560px)',
          background: 'radial-gradient(circle, rgba(155,127,200,0.2) 0%, rgba(155,127,200,0.05) 55%, transparent 80%)',
          filter: 'blur(55px)',
        }}
      />

      {/* Subtle surface shadow under the book */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(155,127,200,0.1) 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label adjusted for light bg */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#9B7FC8] font-medium">
            Mini Book
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <InteractiveBook />
        </motion.div>
      </div>
    </section>
  )
})

// Final CTA
const FinalCTA = memo(function FinalCTA() {
  return (
    <section className="relative py-40 lg:py-56 px-8 lg:px-16 overflow-hidden">
      {/* Hero background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/hero01.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60" />

      {/* Butterflies Canvas background */}
      <Butterflies />

      {/* Background accents */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#D5C8EE]/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#BDB0D8]/10 blur-[120px]" />
      </div>

      {/* Two-column layout: text left, image right */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">

        {/* Text content - centered */}
        <div className="flex-1 text-center">
          <motion.p
            initial={{ opacity: 0, y: 15, letterSpacing: '0.2em' }}
            whileInView={{ opacity: 1, y: 0, letterSpacing: '0.3em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#8A82A0] text-xs uppercase mb-6"
          >
            Forever &amp; always
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-8"
          >
            You&apos;re my <span className="italic text-[#9B7FC8]">favorite</span><br />
            kind of beautiful.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#8A82A0] text-lg"
          >
          </motion.p>

          {/* Floating hearts */}
          <div className="mt-16 flex gap-6 justify-center">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
                className="text-lg text-[#9B7FC8]/30"
              >
              </motion.span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
})

// Footer - Clean minimal
const Footer = memo(function Footer() {
  return (
    <footer className="relative py-16 px-8 lg:px-16 border-t border-[#1E1A2E]/5 bg-[#F7F5FC]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 select-none w-full">
        <p className="font-sans text-xs tracking-[0.15em] text-[#8A82A0]/80 uppercase">
          &copy; 2026. All rights reserved.
        </p>
        <p className="font-serif italic text-[#8A82A0] text-base">
          Designed &amp; Developed by Shaun
        </p>
      </div>
    </footer>
  )
})

// Main Page
export default function Home() {
  const [hasFlower, setHasFlower] = useState(false)
  const [showFlowerPopup, setShowFlowerPopup] = useState(false)
  const [hasMinimizedOnce, setHasMinimizedOnce] = useState(false)
  const [shouldShake, setShouldShake] = useState(false)
  const [showFlyingFlower, setShowFlyingFlower] = useState(false)
  const [flyingFlowerPos, setFlyingFlowerPos] = useState({ x: 0, y: 0 })
  const [popupLabel, setPopupLabel] = useState('Clever move! you can have my gift')
  const cartRef = useRef<HTMLButtonElement>(null)
  const targetPositionRef = useRef({ x: 0, y: 0 })

  const handleGameWin = () => {
    setHasFlower(true)
    setShowFlowerPopup(true)
    setPopupLabel('Clever move! you can have my gift')
  }

  const handleCartClick = () => {
    if (hasFlower) {
      setPopupLabel('MY ROSE LILIIES')
      setShowFlowerPopup(!showFlowerPopup)
    }
  }

  const handlePopupClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Calculate position before hiding popup
    if (cartRef.current) {
      const rect = cartRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      targetPositionRef.current = { x: centerX, y: centerY }

      // Start flying flower animation
      setFlyingFlowerPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      setShowFlyingFlower(true)

      // Animate to basket
      setTimeout(() => {
        setFlyingFlowerPos({ x: centerX, y: centerY })
      }, 50)
    }

    setHasMinimizedOnce(true)
    setShouldShake(true)
    setTimeout(() => setShouldShake(false), 500)
    setShowFlowerPopup(false)

    // Hide flying flower after animation
    setTimeout(() => setShowFlyingFlower(false), 600)
  }

  return (
    <main>
      <Navigation hasFlower={hasFlower} onCartClick={handleCartClick} cartRef={cartRef} hasMinimizedOnce={hasMinimizedOnce} shouldShake={shouldShake} />
      <Hero />
      <SectionDivider />
      <FlowerMatchingGame onWin={handleGameWin} />
      <Gallery3D />
      <Reasons />
      <Letter />
      <Fireworks />
      <FinalCTA />
      <Footer />

      {/* Flower Popup */}
      <AnimatePresence>
        {showFlowerPopup && hasFlower && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handlePopupClick}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-8 cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <span className="text-white/90 text-sm tracking-[0.2em] uppercase font-light">
                {popupLabel}
              </span>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{
                scale: 0.05,
                opacity: 0
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="relative"
            >
              <img
                src="/flower.png"
                alt="Your Bouquet"
                className="w-[80vw] h-[80vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying flower animation */}
      <AnimatePresence>
        {showFlyingFlower && (
          <motion.img
            initial={{ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 1, opacity: 1 }}
            animate={{ x: flyingFlowerPos.x, y: flyingFlowerPos.y, scale: 0.1, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            src="/flower.png"
            alt="Flying Flower"
            className="fixed z-[70] w-20 h-20 object-contain pointer-events-none"
          />
        )}
      </AnimatePresence>
    </main>
  )
}

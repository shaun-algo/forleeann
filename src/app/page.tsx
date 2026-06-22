'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// 3D Background with clean styling - optimized loading
const InteractiveBook = dynamic(() => import('@/components/InteractiveBook'), { ssr: false, loading: () => <div className="w-full h-full bg-[#F7F5FC] animate-pulse" /> })

// Navigation
function Navigation() {
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
          {['Our Story', 'Gallery', 'Letter'].map((item, i) => (
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

        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-8 h-6 flex flex-col justify-between"
        >
          <span className={`block h-px bg-white/80 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-px bg-white/80 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-px bg-white/80 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-6"
          >
            {['Our Story', 'Gallery', 'Letter'].map((item, i) => (
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
  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#BDB0D8] to-transparent" />
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
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50" />

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
          mea <span className="italic text-[#D5C8EE]">carissima</span><br />
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

// Story / Timeline Section
const Story = memo(function Story() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const timelineProgress = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%'])

  const stories = [
    { date: "Jan '23", title: "The first hello", description: "You walked in and everything got quieter. I didn't know it then, but that was the beginning." },
    { date: "Mar '23", title: "Our first night out", description: "You laughed at something I said and I decided right there — I wanted to make you laugh forever." },
    { date: "Jun '23", title: "I knew", description: "Somewhere between the drive home and the goodnight text, I knew I was completely yours." },
    { date: "Today", title: "Still here, still you", description: "Every ordinary day with you feels like something I'd write down to remember." },
  ]

  return (
    <section id="our-story" ref={containerRef} className="relative py-32 lg:py-40 px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <SectionLabel>Our Story</SectionLabel>

        {/* Clean timeline container */}
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-4 lg:left-8 top-0 bottom-0 w-px bg-[#1E1A2E]/10" />
          <motion.div
            style={{ height: timelineProgress }}
            className="absolute left-4 lg:left-8 top-0 w-px bg-gradient-to-b from-[#9B7FC8] to-[#BDB0D8]"
          />

          <div className="space-y-0">
            {stories.map((story, i) => {
              const ref = useRef(null)
              const isInView = useInView(ref, { once: true, margin: '-50px' })

              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-16 lg:pl-24 pb-16 last:pb-0"
                >
                  {/* Clean dot */}
                  <div className="absolute left-2 lg:left-6 top-1 w-2 h-2 rounded-full bg-[#F7F5FC] border-2 border-[#9B7FC8]" />

                  <span className="font-serif italic text-sm text-[#6B5A80] mb-2 block">{story.date}</span>
                  <h3 className="font-serif text-2xl lg:text-3xl font-light mb-4 leading-tight text-[#1E1A2E]">{story.title}</h3>
                  <p className="text-sm text-[#4A4060] leading-relaxed max-w-lg">{story.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
})

// Clean Gallery with Collage Layout
const Gallery = memo(function Gallery() {
  const photos = [
    { id: 1, span: 'col-span-2 row-span-2', color: '#7A68B0', aspect: 'aspect-square' },
    { id: 2, span: '', color: '#6858A0', aspect: 'aspect-square' },
    { id: 3, span: '', color: '#8A78C0', aspect: 'aspect-square' },
    { id: 4, span: '', color: '#5E5090', aspect: 'aspect-[4/3]' },
    { id: 5, span: 'col-span-2', color: '#7A68B0', aspect: 'aspect-[2/1]' },
    { id: 6, span: '', color: '#8A78C0', aspect: 'aspect-square' },
  ]

  return (
    <section id="gallery" className="relative py-32 lg:py-40 px-8 lg:px-16 bg-[#F2F0FA]">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Gallery</SectionLabel>

        {/* Clean collage grid */}
        <div className="grid grid-cols-4 gap-3 lg:gap-4 auto-rows-[180px] lg:auto-rows-[220px]">
          {photos.map((photo, i) => {
            const ref = useRef(null)
            const isInView = useInView(ref, { once: true, margin: '-50px' })

            return (
              <motion.div
                key={photo.id}
                ref={ref}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-xl overflow-hidden group cursor-pointer ${photo.span || ''}`}
              >
                {/* Clean color background */}
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${photo.color} 0%, ${photo.color}dd 100%)`,
                  }}
                />

                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif italic text-white/70 text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Your photo here
                  </span>
                </div>

                {/* Clean border on hover */}
                <div className="absolute inset-0 rounded-xl border-2 border-white/0 group-hover:border-white/20 transition-colors duration-300" />
              </motion.div>
            )
          })}
        </div>

        {/* Clean divider */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-6 text-[#BDB0D8]">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#BDB0D8]" />
            <span className="text-xl">♡</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#BDB0D8]" />
          </div>
        </div>
      </div>
    </section>
  )
})

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
    <section className="relative py-32 lg:py-40 px-8 lg:px-16">
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
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative p-8 lg:p-10 group"
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
      className="relative py-24 sm:py-32 lg:py-40 px-2 sm:px-8 lg:px-16 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 70%, #1E1238 0%, #110C24 45%, #0A0715 100%)',
      }}
    >
      {/* Deep edge vignette to frame the book */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 50% 50%, transparent 40%, rgba(4,3,12,0.65) 100%)',
        }}
      />

      {/* Warm amber/gold glow — mimics light falling on the book from above */}
      <div className="absolute pointer-events-none"
        style={{
          top: '15%', left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(300px, 45vw, 620px)',
          height: 'clamp(180px, 28vw, 380px)',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Lavender bloom — reflects the book cover colour into the bg */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.75, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute pointer-events-none"
        style={{
          top: '30%', left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(260px, 40vw, 560px)',
          height: 'clamp(260px, 40vw, 560px)',
          background: 'radial-gradient(circle, rgba(90,55,160,0.28) 0%, rgba(74,53,112,0.10) 55%, transparent 80%)',
          filter: 'blur(55px)',
        }}
      />

      {/* Subtle horizontal table-surface highlight under the book */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(30,18,56,0.8) 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label adjusted for dark bg */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#C0AEDE] font-medium">
            A Letter
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
      {/* Background accents */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#D5C8EE]/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#BDB0D8]/10 blur-[120px]" />
      </div>

      {/* Two-column layout: text left, image right */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">

        {/* Left — text content */}
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#8A82A0] text-xs tracking-[0.3em] uppercase mb-6"
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
            Every day, every moment, every breath — I&apos;m grateful it&apos;s with you.
          </motion.p>

          {/* Floating hearts */}
          <div className="mt-16 flex gap-6">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
                className="text-lg text-[#9B7FC8]/30"
              >
                ♡
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right — photo, vertically centred with text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex flex-1 justify-center items-center pointer-events-none select-none"
          style={{ opacity: 0.18 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/foreheadkiss.png"
            alt=""
            style={{
              width: 'clamp(260px, 28vw, 420px)',
              display: 'block',
              objectFit: 'contain',
              maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 22%, black 50%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 22%, black 50%)',
            }}
          />
        </motion.div>

      </div>
    </section>
  )
})

// Footer - Clean minimal
const Footer = memo(function Footer() {
  return (
    <footer className="relative py-16 px-8 lg:px-16 border-t border-[#1E1A2E]/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-serif italic text-[#8A82A0] text-base">
          made with love, just for you
        </p>
        <motion.span
          animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-2xl text-[#9B7FC8]"
        >
          ♡
        </motion.span>
      </div>
    </footer>
  )
})

// Main Page
export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <SectionDivider />
      <Story />
      <Gallery />
      <Reasons />
      <Letter />
      <FinalCTA />
      <Footer />
    </main>
  )
}

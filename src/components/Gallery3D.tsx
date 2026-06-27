'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/* ─────────────────────────────────────────
   Photo data — using existing photos
───────────────────────────────────────── */
const PHOTOS = [
  {
    id: '01',
    src: '/gallery/img.JPG',
  },
  {
    id: '02',
    src: '/gallery/img2.JPG',
  },
  {
    id: '03',
    src: '/gallery/img3.JPG',
  },
  {
    id: '04',
    src: '/gallery/img4.jpg',
  },
  {
    id: '05',
    src: '/gallery/img5.jpg',
  },
  {
    id: '06',
    src: '/gallery/img6.jpg',
  },
  {
    id: '07',
    src: '/gallery/img7.jpg',
  },
  {
    id: '08',
    src: '/gallery/img8.jpg',
  },
]

export default function Gallery3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress of the entire container height
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })

  // Smooth out the scroll progress using a spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
    restDelta: 0.001
  })

  // Map scroll progress to horizontal translation of the track
  // We translate from 0% (first card) to -75% (so the last card is visible on screen)
  const x = useTransform(smoothProgress, [0, 1], ['0%', '-75%'])

  return (
    <section
      ref={containerRef}
      className="relative h-[360vh]"
      style={{
        backgroundImage: 'url(/cloud.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay to adjust background opacity */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none" />
      {/* Sticky container that stays in viewport while user scrolls down */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-24">

        {/* Section Header - Clean Apple aesthetic with Light Lilac colors */}
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#9B7FC8] font-semibold block mb-3">
              Moments Collection
            </span>
            <h2 className="font-serif font-light text-4xl md:text-5xl text-[#1E1A2E] tracking-tight">
              Captured in <em className="text-[#9B7FC8] font-light italic">light</em>
            </h2>
          </div>
        </div>

        {/* Horizontal Moving Track */}
        <div className="flex-1 flex items-center relative my-4">
          <motion.div
            style={{ x }}
            className="flex gap-8 md:gap-10 px-8 md:px-16"
          >
            {PHOTOS.map((photo, i) => (
              <Card key={i} photo={photo} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Clean Portrait Card Component
───────────────────────────────────────── */
function Card({ photo }: { photo: typeof PHOTOS[0] }) {
  return (
    <div className="group relative w-[70vw] sm:w-[45vw] md:w-[22vw] max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[#9B7FC8]/15 cursor-pointer select-none transition-all duration-700 ease-out hover:border-[#9B7FC8]/30 shadow-[0_8px_30px_rgb(155,127,200,0.04)] hover:shadow-[0_20px_40px_rgba(155,127,200,0.12)]">
      {/* Background Image with smooth hover scale */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={`Memory ${photo.id}`}
          className="w-full h-full object-cover transform scale-[1.01] transition-transform duration-750 ease-out group-hover:scale-[1.06]"
        />
        {/* Lilac overlay for cute aesthetic */}
        <div className="absolute inset-0 bg-[#C8B8E8]/25 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-70" />
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#9B7FC8]/30 via-transparent to-[#D5C8EE]/10 opacity-40 transition-opacity duration-500 group-hover:opacity-50" />
      </div>

      {/* Card Number Top-Right */}
      <div className="absolute top-5 right-6 font-serif text-white/60 text-base group-hover:text-white/80 transition-colors duration-500 drop-shadow-md">
        {photo.id}
      </div>
    </div>
  )
}

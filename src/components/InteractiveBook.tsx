'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function InteractiveBook() {
  const [currentPage, setCurrentPage] = useState(0)
  const [visualPage, setVisualPage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward' | null>(null)
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const bookClosingAudioRef = useRef<HTMLAudioElement | null>(null)
  const leafOpenAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize audio elements with preload so the browser buffers them immediately.
  // We keep these as "source" nodes only — actual playback always uses cloneNode()
  // so rapid/overlapping flips each get their own independent audio context.
  useEffect(() => {
    const bookAudio = new Audio('/book-closing.mp3')
    bookAudio.preload = 'auto'
    bookClosingAudioRef.current = bookAudio

    const leafAudio = new Audio('/leaf_open.mp3')
    leafAudio.preload = 'auto'
    leafOpenAudioRef.current = leafAudio

    return () => {
      bookClosingAudioRef.current = null
      leafOpenAudioRef.current = null
    }
  }, [])

  /**
   * Play a sound by cloning the source node.
   * Cloning gives each call its own Audio instance, so:
   *  - rapid page turns never reset a still-playing sound mid-stream
   *  - overlapping flips can each make noise independently
   * The clone is discarded automatically after it ends.
   */
  const playSound = (sourceRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    const source = sourceRef.current
    if (!source) return
    try {
      const clone = source.cloneNode() as HTMLAudioElement
      clone.volume = source.volume
      clone.play().catch(err => console.log('Audio play failed:', err))
      // Let the browser GC the clone once it finishes
      clone.onended = () => { clone.onended = null }
    } catch (err) {
      console.log('Audio clone failed:', err)
    }
  }

  const leaves = [
    {
      id: 0,
      isCover: true,
      title: '📖',
      author: 'For You',
      front: {
        isCover: true,
        content: (
          <div className="flex flex-col items-center justify-between h-full py-10 px-4 text-[#D4AF37] select-none">
            <div className="w-full text-center mt-4">
              <div className="border border-[#C8B8E8]/30 p-5 rounded-lg bg-[#1E1530]/40 backdrop-blur-[2px]">
                <h1 className="font-serif font-light uppercase tracking-[0.1em] mb-3 text-[#D5C8EE]" style={{ fontSize: 'clamp(20px, 5vw, 44px)' }}>
                  Leaves
                </h1>
                <div className="w-10 h-[1px] bg-[#C8B8E8] mx-auto my-4" />
                <p className="font-serif italic tracking-[0.2em] text-[#F7F5FC]" style={{ fontSize: 'clamp(10px, 1.8vw, 18px)' }}>
                  short msgs
                </p>
              </div>
            </div>
            <div className="text-center font-serif tracking-[0.25em] text-[#F7F5FC]/80 animate-pulse mb-6" style={{ fontSize: 'clamp(7px, 1.2vw, 12px)' }}>

            </div>
          </div>
        )
      },
      back: {
        isInsideCover: true,
        content: (
          <div className="flex flex-col items-center justify-center h-full p-5 text-center bg-[#F7F5FC]">
            <div className="border border-[#9B7FC8]/20 p-3 rounded-lg w-full h-full flex flex-col justify-center items-center">
              <span className="text-2xl text-[#9B7FC8] mb-3">♡</span>
              <h2 className="font-serif italic text-[#1E1A2E] mb-2" style={{ fontSize: 'clamp(16px, 3.5vw, 30px)' }}>MY HONEY
              </h2>
              <p className="text-[#9B7FC8] font-serif italic mb-3" style={{ fontSize: 'clamp(8px, 1.1vw, 12px)', letterSpacing: '0.05em' }}>
                Mundulum quod tibi soli feci
              </p>
              <p className="text-[#8A82A0] font-serif" style={{ fontSize: 'clamp(7px, 0.9vw, 10px)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                A little universe I made just for you
              </p>
            </div>
          </div>
        )
      }
    },
    {
      id: 1,
      title: 'I',
      front: {
        content: (
          <div className="page__content-blockquote">
            <p className="page__content-blockquote-text">Love,</p>
            <p className="page__content-blockquote-text">Ginawa ko to para may babalikan ka whenever you need a reminder na sobrang loved ka. Di ko alam paano ko naswerete na ako napili mo.</p>
          </div>
        )
      },
      back: {
        content: (
          <div className="page__content-text">
            <p>Thank you for staying. Kahit ganito ako, kahit may mga pagkukulang ako, nandito ka pa rin. You chose to love me kahit alam mo nang mahirap.</p>
          </div>
        )
      }
    },
    {
      id: 2,
      title: 'II',
      front: {
        content: (
          <div className="page__content-text">
            <p>Sorry kung minsan ang layo ko in terms of quality time. Hindi dahil ayaw ko, you know naman nga amaw ko sabayan pa ng pagka busy ko sa buhay, pag help sa parents. Pero alam mo naman honey, ikaw pa rin cutiepie ko forever.</p>
          </div>
        )
      },
      back: {
        content: (
          <div className="page__content-text">
            <p>Sorry din kung di ako masyado emotionally available minsan honey. I know hindi ko lagi napapakita, pero you deserve all the love and attention in the world po, and deserve na deserve mo mga mabubuting tao na nasa paligid mo hehe.</p>
          </div>
        )
      }
    },
    {
      id: 3,
      title: 'III',
      front: {
        content: (
          <div className="page__content-text">
            <p>Years of LDR. Alam kong ang hirap, alam nating dalawa na mahirap. May mga araw na parang wala tayong time para mag-usap like yeah. Pero you stayed, kahit ang daming pinagdaanan natin, Thank you so much.</p>
          </div>
        )
      },
      back: {
        content: (
          <div className="page__content-text">
            <p>Lahat ng struggles, hindi mo ginawang rason para umalis. Instead, mas naging strong pa tayo. Thank you for not giving up on us honey, I'm gonna cry.</p>
          </div>
        )
      }
    },
    {
      id: 4,
      title: 'IV',
      front: {
        content: (
          <div className="page__content-text" style={{ textAlign: 'center' }}>
            <p style={{ fontStyle: 'italic', textIndent: 0, marginBottom: '0.4em', fontSize: 'inherit' }}>Ikaw</p>
            <p style={{ fontStyle: 'italic', textIndent: 0, marginBottom: '0.4em', fontSize: 'inherit' }}>home ko,</p>
            <p style={{ fontStyle: 'italic', textIndent: 0, marginBottom: '1.2em', fontSize: 'inherit' }}>bebi</p>
            <p style={{ textIndent: 0, fontSize: '0.72em', color: '#B8A9A5', letterSpacing: '0.05em' }}>You're my favorite person.</p>
          </div>
        )
      },
      back: {
        content: (
          <div className="page__content-text" style={{ textAlign: 'center' }}>
            <p style={{ fontStyle: 'italic', textIndent: 0, marginBottom: '1.2em', fontSize: 'inherit' }}>XOXAD,<br />nami-miss na kita super</p>
            <p style={{ textIndent: 0, fontSize: '0.72em', color: '#B8A9A5', letterSpacing: '0.05em' }}>Every little thing reminds me of you.</p>
          </div>
        )
      }
    },
    {
      id: 5,
      title: 'V',
      front: {
        content: (
          <div className="page__content-text">
            <p>Honey, I'll try to be better. Better sa pag-show ng emotions ko, better sa pag-effort, better sa pag-make time. Deserve mo lahat ng 'yon honey.</p>
          </div>
        )
      },
      back: {
        content: (
          <div className="page__content-blockquote-text" style={{ marginTop: '2rem', textAlign: 'center' }}>
            — always my honey ♡
          </div>
        )
      }
    },
    {
      id: 6,
      isCover: true,
      front: {
        isInsideCover: true,
        content: (
          <div className="flex flex-col items-center justify-center h-full p-5 text-center bg-[#F7F5FC]">
            <div className="border border-[#9B7FC8]/20 p-3 rounded-lg w-full h-full flex flex-col justify-center items-center">
              <img
                src="/foreheadkiss.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )
      },
      back: {
        isCover: true,
        content: (
          <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-[#D4AF37] select-none">
          </div>
        )
      }
    }
  ]

  const totalLeaves = leaves.length

  // Audio logic is handled directly in handlePageChange to avoid
  // stale-closure / double-fire issues with reactive effects.

  const handlePageChange = (pageIndex: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(pageIndex > currentPage ? 'forward' : 'backward')

    // Determine which sound to play based on the exact transition:
    //   front cover open  : 0 → 1          → book-closing
    //   back cover close  : (totalLeaves-1) → totalLeaves  → book-closing
    //   all other leafs   :                               → leaf_open
    const isFrontCoverOpen = currentPage === 0 && pageIndex === 1
    const isBackCoverClose = currentPage === totalLeaves - 1 && pageIndex === totalLeaves
    const isFrontCoverClose = currentPage === 1 && pageIndex === 0
    const isBackCoverOpen = currentPage === totalLeaves && pageIndex === totalLeaves - 1
    const isCoverTransition = isFrontCoverOpen || isBackCoverClose || isFrontCoverClose || isBackCoverOpen

    if (isCoverTransition) {
      // book-closing sound for front/back cover open & close
      playSound(bookClosingAudioRef)
    } else {
      // leaf_open sound for all inner-leaf page flips
      playSound(leafOpenAudioRef)
    }

    setCurrentPage(pageIndex)

    // Sync visual page stack appearance at the 450ms midpoint (90 degrees angle)
    setTimeout(() => {
      setVisualPage(pageIndex)
    }, 450)

    setTimeout(() => {
      setIsAnimating(false)
      setDirection(null)
    }, 900)
  }

  // Calculate how many pages are actually lying flat on the left and right stacks.
  // During flip animations, we exclude the page currently in the air.
  let flatLeftPages = currentPage
  let flatRightPages = totalLeaves - currentPage

  if (isAnimating) {
    if (direction === 'forward') {
      flatLeftPages = currentPage - 1
    } else if (direction === 'backward') {
      flatRightPages = totalLeaves - (currentPage + 1)
    }
  }

  const getLeftStackShadow = (leftCount: number) => {
    if (leftCount <= 0) return 'none'
    let shadow = ''
    const layers = Math.min(leftCount, 4)
    for (let i = 1; i <= layers; i++) {
      shadow += `-${i}px ${i}px 0px #e2ded9, `
    }
    shadow += `-${layers + 1}px ${layers + 1}px 10px rgba(0,0,0,0.15)`
    return shadow
  }

  const getRightStackShadow = (rightCount: number) => {
    if (rightCount <= 0) return 'none'
    let shadow = ''
    const layers = Math.min(rightCount, 4)
    for (let i = 1; i <= layers; i++) {
      shadow += `${i}px ${i}px 0px #e2ded9, `
    }
    shadow += `${layers + 1}px ${layers + 1}px 10px rgba(0,0,0,0.15)`
    return shadow
  }

  // When closed (cover showing), the book is really just one half-page wide.
  // We shift the outer wrapper so that half-page is visually centred.
  // forward-closed  → front cover lives on the RIGHT half  → shift wrapper left by 25 %
  // backward-closed → back cover lives on the LEFT half   → shift wrapper right by 25 %
  const closedShift = currentPage === 0 ? '-25%' : currentPage === totalLeaves ? '25%' : '0%'

  const showLeftShadowBed = flatLeftPages > 0
  const showRightShadowBed = flatRightPages > 0

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 w-full select-none">
      <div
        className="relative"
        style={{
          width: '100%',
          maxWidth: isMobile ? '380px' : '740px',
          aspectRatio: '1.4/1',
          transform: `translateX(${closedShift})`,
          transition: 'transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1)',
        }}
        onMouseMove={(e) => {
          if (isAnimating) return
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          if (x < rect.width / 2) {
            setHoverSide('left')
          } else {
            setHoverSide('right')
          }
        }}
        onMouseLeave={() => {
          setHoverSide(null)
        }}
      >
        {/* Book shadow bed (page stack depth) */}
        {/* Left stack shadow */}
        <div
          style={{
            display: showLeftShadowBed ? 'block' : 'none',
            position: 'absolute',
            left: '1.5%',
            top: '2%',
            width: '48.5%',
            height: '96%',
            backgroundColor: '#F7F5FC',
            borderRadius: '8px 0 0 8px',
            boxShadow: getLeftStackShadow(flatLeftPages),
            opacity: showLeftShadowBed ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Right stack shadow */}
        <div
          style={{
            display: showRightShadowBed ? 'block' : 'none',
            position: 'absolute',
            right: '1.5%',
            top: '2%',
            width: '48.5%',
            height: '96%',
            backgroundColor: '#F7F5FC',
            borderRadius: '0 8px 8px 0',
            boxShadow: getRightStackShadow(flatRightPages),
            opacity: showRightShadowBed ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Spine Crease Underlay (for cover background crease look) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '8px',
            transform: 'translateX(-50%)',
            backgroundColor: '#1E1311',
            boxShadow: '0 0 6px rgba(0,0,0,0.4)',
            zIndex: 1,
            opacity: currentPage > 0 && currentPage < totalLeaves ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}
        />

        {/* The 3D Book */}
        <div className="book" style={{ width: '100%', height: '100%', display: 'flex', perspective: '1500px', transformStyle: 'preserve-3d' }}>

          {leaves.map((leaf, index) => {
            const isFlipped = currentPage > index
            const isCoverLeaf = leaf.isCover

            const isVisuallyFlipped = visualPage > index

            const getTransform = () => {
              let angle = 0
              let zTranslate = 0

              if (isFlipped) {
                angle = -180
                if (index === currentPage - 1 && hoverSide === 'left' && !isAnimating) {
                  angle = -168
                }

                if (index === currentPage - 1) {
                  zTranslate = -20
                } else {
                  zTranslate = -(2 + index * 2)
                }
              } else {
                angle = 0
                if (index === currentPage && hoverSide === 'right' && !isAnimating) {
                  angle = -12
                }

                if (index === currentPage) {
                  zTranslate = 20
                } else {
                  zTranslate = 2 + (totalLeaves - index) * 2
                }
              }

              return `rotateY(${angle}deg) translateZ(${zTranslate}px)`
            }

            const isFlipping = isAnimating && (index === currentPage || index === currentPage - 1)
            const transitionStyle = isFlipping
              ? 'transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1), z-index 0.9s step-start'
              : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'

            const isClickable = (index === currentPage || index === currentPage - 1) && !isAnimating

            return (
              <div
                key={leaf.id}
                style={{
                  position: 'absolute',
                  top: isCoverLeaf ? 0 : '2%',
                  bottom: isCoverLeaf ? 0 : '2%',
                  left: '50%',
                  width: isCoverLeaf ? '50%' : '48.5%',
                  height: isCoverLeaf ? '100%' : '96%',
                  transformStyle: 'preserve-3d',
                  transform: getTransform(),
                  transition: transitionStyle,
                  transformOrigin: '0% 50%',
                  zIndex: isFlipping ? 20 : 10,
                  pointerEvents: isClickable ? 'auto' : 'none',
                  cursor: isClickable ? 'pointer' : 'default'
                }}
                onClick={() => {
                  if (!isClickable) return
                  if (index === currentPage) {
                    handlePageChange(currentPage + 1)
                  } else if (index === currentPage - 1) {
                    handlePageChange(currentPage - 1)
                  }
                }}
              >
                {/* Front face (Right side when open) */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(1px)',
                  visibility: isVisuallyFlipped ? 'hidden' : 'visible',
                  overflow: 'hidden',
                  borderRadius: isCoverLeaf ? '0 12px 12px 0' : '0 8px 8px 0',
                  border: isCoverLeaf ? 'none' : '1px solid rgba(0,0,0,0.06)',
                  borderLeft: 'none',
                  boxShadow: isCoverLeaf
                    ? '0 12px 30px rgba(0, 0, 0, 0.25), inset -3px 0 10px rgba(0, 0, 0, 0.05)'
                    : '0 4px 12px rgba(0, 0, 0, 0.06), inset 3px 0 10px rgba(0, 0, 0, 0.01)',
                  background: leaf.front.isCover
                    ? 'radial-gradient(circle, #8B7AB5 0%, #6B5B95 100%)'
                    : leaf.front.isInsideCover
                      ? '#F7F5FC'
                      : 'linear-gradient(to right, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 8%), #F7F5FC',
                }}
                >
                  {leaf.front.isCover && (
                    <div className="absolute inset-4 border border-[#C8B8E8]/40 rounded pointer-events-none flex flex-col justify-between p-4" />
                  )}
                  {leaf.front.isInsideCover && (
                    <div className="absolute inset-4 border border-[#9B7FC8]/15 rounded pointer-events-none" />
                  )}

                  <div className="page__content" style={{ padding: isMobile ? '10px 10px' : '16px clamp(12px, 3vw, 24px)', height: '100%', position: 'relative', textAlign: 'center', fontFamily: 'var(--font-cormorant), serif' }}>
                    {!isCoverLeaf && leaf.title && (
                      <div className="page__content-title" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: isMobile ? '9px' : 'clamp(10px, 1.4vw, 14.4px)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: isMobile ? '8px' : 'clamp(20px, 3vw, 36px)', marginBottom: isMobile ? '6px' : 'clamp(12px, 2vw, 20px)', color: '#9B7FC8', fontWeight: 600 }}>
                        {leaf.title}
                      </div>
                    )}

                    <div className="w-full h-[80%] flex flex-col justify-center">
                      {leaf.front.content}
                    </div>

                    {!isCoverLeaf && (
                      <div className="page__number" style={{ position: 'absolute', bottom: isMobile ? '8px' : '16px', right: isMobile ? '10px' : '20px', fontFamily: 'var(--font-cormorant), serif', fontSize: isMobile ? '7px' : 'clamp(8px, 1vw, 11px)', color: '#8A82A0', fontStyle: 'italic' }}>
                        {2 * index - 1}
                      </div>
                    )}
                  </div>
                </div>

                {/* Back face (Left side when open) */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg) translateZ(1px)',
                  visibility: isVisuallyFlipped ? 'visible' : 'hidden',
                  overflow: 'hidden',
                  borderRadius: isCoverLeaf ? '12px 0 0 12px' : '8px 0 0 8px',
                  border: isCoverLeaf ? 'none' : '1px solid rgba(0,0,0,0.06)',
                  borderRight: 'none',
                  boxShadow: isCoverLeaf
                    ? '0 12px 30px rgba(0, 0, 0, 0.25), inset 3px 0 10px rgba(0, 0, 0, 0.05)'
                    : '0 4px 12px rgba(0, 0, 0, 0.06), inset -3px 0 10px rgba(0, 0, 0, 0.01)',
                  background: leaf.back.isCover
                    ? 'radial-gradient(circle, #8B7AB5 0%, #6B5B95 100%)'
                    : leaf.back.isInsideCover
                      ? '#F7F5FC'
                      : 'linear-gradient(to left, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 8%), #F7F5FC',
                }}
                >
                  {leaf.back.isCover && (
                    <div className="absolute inset-4 border border-[#C8B8E8]/40 rounded pointer-events-none flex flex-col justify-between p-4" />
                  )}
                  {leaf.back.isInsideCover && (
                    <div className="absolute inset-4 border border-[#9B7FC8]/15 rounded pointer-events-none" />
                  )}

                  <div className="page__content" style={{ padding: isMobile ? '10px 10px' : '16px clamp(12px, 3vw, 24px)', height: '100%', position: 'relative', textAlign: 'center', fontFamily: 'var(--font-cormorant), serif' }}>
                    {!isCoverLeaf && leaf.title && (
                      <div className="page__content-title" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: isMobile ? '9px' : 'clamp(10px, 1.4vw, 14.4px)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: isMobile ? '8px' : 'clamp(20px, 3vw, 36px)', marginBottom: isMobile ? '6px' : 'clamp(12px, 2vw, 20px)', color: '#9B7FC8', fontWeight: 600 }}>
                        {leaf.title}
                      </div>
                    )}

                    <div className="w-full h-[80%] flex flex-col justify-center">
                      {leaf.back.content}
                    </div>

                    {!isCoverLeaf && (
                      <div className="page__number" style={{ position: 'absolute', bottom: isMobile ? '8px' : '16px', left: isMobile ? '10px' : '20px', fontFamily: 'var(--font-cormorant), serif', fontSize: isMobile ? '7px' : 'clamp(8px, 1vw, 11px)', color: '#8A82A0', fontStyle: 'italic' }}>
                        {2 * index}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )
          })}

        </div>

        {/* Crease shadow overlay (spine shadow) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '32px',
            transform: 'translateX(-50%)',
            zIndex: 15, // higher than static pages (10) but lower than flipping pages (20)
            pointerEvents: 'none',
            background: 'linear-gradient(to right, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.12) 100%)',
            opacity: visualPage > 0 && visualPage < totalLeaves ? 1 : 0,
            transition: 'opacity 0.9s ease'
          }}
        />
      </div>

      {/* Navigation Controls - Under the book */}
      <div className="flex justify-center gap-8 mt-8 z-10">
        <button
          onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 0 || isAnimating}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all font-medium disabled:opacity-30 disabled:cursor-not-allowed bg-[#8B7AB5] text-white hover:bg-[#6B5B95] hover:scale-110 shadow-md"
          style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '20px' }}
        >
          &lt;
        </button>
        <button
          onClick={() => currentPage < totalLeaves && handlePageChange(currentPage + 1)}
          disabled={currentPage === totalLeaves || isAnimating}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all font-medium disabled:opacity-30 disabled:cursor-not-allowed bg-[#8B7AB5] text-white hover:bg-[#6B5B95] hover:scale-110 shadow-md"
          style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '20px' }}
        >
          &gt;
        </button>
      </div>
    </div>
  )
}

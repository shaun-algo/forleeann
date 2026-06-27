import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'
import ScrollProgress from '@/components/ScrollProgress'
import BackgroundMusic from '@/components/BackgroundMusic'
import { Cormorant_Garamond, Tulpen_One } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-cormorant',
})

const tulpen = Tulpen_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-tulpen',
})

// Import CustomCursor with SSR disabled to prevent hydration errors
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
  ssr: false
})

export const metadata: Metadata = {
  title: 'For Alyssa ♡ | A Gift Made With Love',
  description: 'A small gift, made with everything. A digital love letter for the most special person.',
  keywords: ['love', 'gift', 'letter', 'romantic', 'special'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${tulpen.variable}`}>
      <body className="antialiased">
        <CustomCursor />
        <ScrollProgress />
        <BackgroundMusic />
        {children}
      </body>
    </html>
  )
}

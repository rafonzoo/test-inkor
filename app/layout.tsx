import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReactJS Interview | Next',
  description: 'ReactJS Interview by Inkor',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className + ' text-base pt-16'}>
        <div className='lg:max-w-[980px] md:max-w-[720px] max-w-[87.5%] mx-auto'>
          <Suspense
            fallback={
              <div className='text-center text-zinc-500 fixed w-full left-0 top-1/2 -translate-y-1/2 -mt-[10%]'>
                <p>Simulate {'"Auth Service"'}</p>
                <p>Loading page...</p>
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </body>
    </html>
  )
}

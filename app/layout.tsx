import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ML API Tester | Azure Machine Learning',
  description: 'Educational tool to test and explore Azure Machine Learning model endpoints',
  keywords: ['Azure', 'Machine Learning', 'API', 'Testing', 'Education'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}





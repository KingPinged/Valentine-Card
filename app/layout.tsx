import { Layout } from '@/components/dom/Layout'
import '@/global.css'

export const metadata = {
  title: 'Happy Valentine Day',
  description: 'Happy Valentine Day to a special someone',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className='antialiased'>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}

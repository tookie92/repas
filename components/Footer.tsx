"use client"
import { footerItem } from '@/lib/footerItem'

import Link from 'next/link'
import { usePathname} from 'next/navigation'
import React from 'react'


export const Footer = () => {

  const pathname = usePathname()
   

  return (
    <div className='fixed flex bottom-0 left-0 w-full h-24 z-20  items-center justify-center bg-beige text-black px-8 '>
      
       <div className='flex gap-x-9 items-center justify-center  w-full max-w-4xl'>
       {footerItem.map((item, index) => (
        <Link key={index} href={item.link} className={'flex flex-col items-center gap-x-2 hover:text-myGreen' + (pathname === item.link ? ' text-myRed' : '')}>
          <item.icon className='w-6 h-6' />
          <p className={`text-sm ${pathname === item.link ? 'text-myRed' : 'text-myGreen'}`}>{item.name}</p>
        </Link>
       ))}
       </div>
      
       
    </div>
    
  )
}

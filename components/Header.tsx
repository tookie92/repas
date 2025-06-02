"use client"

import { ClerkLoaded, SignedOut ,  SignedIn, UserButton, SignInButton} from '@clerk/nextjs'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'

type HeaderProps = {
    back?: boolean,
    login: boolean
}
export const Header = ({back = false, login =true}: HeaderProps) => {
  const router = useRouter()
  return (
    <div className='fixed flex top-0 left-0 w-full h-16 z-20  items-center bg-beige text-black px-8 justify-between'>
      {back && <div className='flex items-center gap-x-2' onClick={() => router.back()}>
        <ChevronLeft className='w-6 h-6 text-myGreen' />
       
        </div>
      }
       <p className='text-2xl font-bold text-myGreen'>Lisa</p>
       {login && <div>
          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" >
                <Button>Connexion</Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>}
       
    </div>
    
  )
}

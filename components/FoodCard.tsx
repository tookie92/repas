"use client";
import React from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
type FoodCardProps = {
    image: string,
    title: string,
    link: string
}
const FoodCard = ({image, title, link}: FoodCardProps) => {
  const router = useRouter()
  return (
    <Card onClick={()=> router.push(link)} className='w-full h-full px-3 flex cursor-pointer bg-myYellow border-none'>
        <CardHeader className='relative  h-[350px] w-full'>
            <Image src={image} alt={title} fill objectFit='cover'className=' object-cover rounded-lg' />
        </CardHeader>
        <CardContent className='flex text-white font-bold items-center justify-center'>
           {title}
        </CardContent>
    </Card>
  )
}

export default FoodCard
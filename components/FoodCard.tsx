import React from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import Image from 'next/image'
type FoodCardProps = {
    image: string,
    title: string,
}
const FoodCard = ({image, title}: FoodCardProps) => {
  return (
    <Card className='w-full h-[500px] px-3 flex'>
        <CardHeader className='relative  h-[450px] '>
            <Image src={image} alt={title} fill objectFit='cover'className=' object-cover rounded-lg' />
        </CardHeader>
        <CardContent className='flex items-center justify-center'>
           {title}
        </CardContent>
    </Card>
  )
}

export default FoodCard
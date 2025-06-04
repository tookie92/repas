"use client";
import React from 'react'
import { Card,  CardHeader } from './ui/card'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import {  Edit, Eraser, Eye } from 'lucide-react';


type FoodCardProps = {
    image: string,
    title: string,
    link: string,
    onDelete?: () => void,
    onEdit?: () => void
}
const FoodCard = ({image, title, link, onDelete, onEdit}: FoodCardProps) => {
  const router = useRouter()
 
  return (
    <Card  className='relative  w-full h-[400px] px-3 flex cursor-pointer  bg-myYellow border-none'>
      <CardHeader className='absolute top-3 left-3 z-30 text-white font-bold text-lg'>
        {title}
      </CardHeader>
      <div className='bg-black/50 rounded-lg absolute top-0 left-0 w-full h-full z-20' />
      <Image
        src={image}
        alt={title}
        fill
        className='object-cover rounded-lg'
        onClick={() => router.push(link)}
      />
      <div className='absolute bottom-3 right-3 z-30 flex text-white '>
        <Eye size={24} className='cursor-pointer' onClick={() => router.push(link)}/>
        <Edit size={24} className='cursor-pointer ml-2' onClick={onEdit}/>
        <Eraser size={24} className='cursor-pointer ml-2' onClick={onDelete}/>
      </div>
    </Card>
  )
}

export default FoodCard
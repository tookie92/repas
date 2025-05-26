"use client"
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'
import FoodCard from './FoodCard'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'

const MesCategories = () => {
    const categories = useQuery(api.categories.getCategories)
  return (
    <div className='w-full  h-[800px] flex items-center'>
       
        <Carousel className='w-full h-full'>
            <CarouselContent>
                {categories?.map((category, index) =>(
                    <CarouselItem  key={index}>
                         <FoodCard image={category.imageLink} title={category.title} link={`/categories/${category._id}`} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    </div>
  )
}

export default MesCategories
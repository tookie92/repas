"use client"
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'
import FoodCard from './FoodCard'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'

const MesCategories = () => {
    const categories = useQuery(api.categories.getCategories)
  return (
   
     
            <Carousel >
                <CarouselContent>
                    {categories?.map((category, index) =>(
                        <CarouselItem  key={index}>
                            <FoodCard image={category.imageLink} title={category.title} link={`/categories/${category._id}`} />
                        </CarouselItem>
                    ))}
                    <CarouselItem>
                        
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
   
  )
}

export default MesCategories
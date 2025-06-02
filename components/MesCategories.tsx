"use client"
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'
import FoodCard from './FoodCard'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import { Card, CardContent, } from './ui/card'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

const MesCategories = () => {
    const categories = useQuery(api.categories.getCategories)
  return (
    <>
    {categories?.length === 0 ? (
        <Card className='w-full h-full px-3 flex cursor-pointer bg-myYellow border-none'>
            <Dialog>
                <DialogTrigger asChild>
                     <CardContent className='flex text-white font-bold h-full items-center justify-center'>
                        Add your first category
                    </CardContent>
                </DialogTrigger>
                <DialogContent className='bg-myYellow text-white'>
                   hello
                </DialogContent>
            </Dialog>    
        </Card>
    ):
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    <CarouselItem>
                       <Card className='w-full h-full px-3 flex cursor-pointer bg-myYellow border-none'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <CardContent className='flex text-white font-bold h-full items-center justify-center'>
                                        Add your first category
                                    </CardContent>
                                </DialogTrigger>
                                <DialogContent className='bg-myYellow text-white'>
                                hello
                                </DialogContent>
                            </Dialog>    
                        </Card>
                    </CarouselItem>
                    {categories?.map((category, index) =>(
                        <CarouselItem  key={index} className='basis-3/3'>
                            <FoodCard image={category.imageLink} title={category.title} link={`/categories/${category._id}`} />
                        </CarouselItem>
                    ))}
                    
                </CarouselContent>
            </Carousel>
        }
    </>
   
      
   
  )
}

export default MesCategories
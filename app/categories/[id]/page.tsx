"use client";
import { FoodImage } from '@/components/FoodImage';
import FormFood from '@/components/FormFood';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import { useQuery } from 'convex/react';

import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'

const CategoriesPage = () => {
  const router  = useRouter()
 const params = useParams()
 const categoryId = params.id as Id<"categories">;
 const [searchQuery, setSearchQuery] = useState('');
  const categoryWithFoods = useQuery(api.categories.getCategoryWithFoods, { categoryId });

   const filteredFoods = categoryWithFoods?.food.filter((food) => {
    const query = searchQuery.toLowerCase();
    return food.title.toLowerCase().includes(query);
  });

  if (!filteredFoods|| filteredFoods.length === undefined) {
     <div className='flex flex-col items-center justify-center'>
        <p className='text-2xl font-bold text-myGreen'>No Food Found</p>
        <p className='text-xl text-myGreen'>Try another category</p>
      </div>
  }
  return (
    <div className='relative flex flex-col gap-y-3 px-8 mt-7'>
       <Header back />
      <div className='flex flex-row gap-x-3 mt-18 items-center'>
          
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='bg-white text-black rounded-lg p-2 w-full'
          />
          <Dialog>
          <DialogTrigger>
            <Button>Ajouter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                <FormFood  />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

          
      </div>
      <ScrollArea className='h-[600px] w-full '>
        {filteredFoods?.map((item, index) => (
        <div onClick={()=> router.push(`/categories/${categoryId}/food/${item._id}`)} key={index} className='p-3 bg-myYellow flex flex-row rounded-lg mb-2'>
          <div className='mr-4'>
             <FoodImage storageId={item.imageLink} className='rounded-lg' />
          </div>
                <div className='flex-1'>
                  <p className='text-myGreen text-lg font-bold'>{item.title}</p>
                  <p className='text-myGreen'>{item.description}</p>
                  <p className='text-myGreen'>Pour {item.person} personnes</p>
                </div>
        </div>
      ))}
      </ScrollArea>
      

     
    </div>
  )
}

export default CategoriesPage

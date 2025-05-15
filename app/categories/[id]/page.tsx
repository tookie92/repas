"use client";
import { FoodImage } from '@/components/FoodImage';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';

import { useParams } from 'next/navigation';
import React, { useState } from 'react'

const CategoriesPage = () => {
 const params = useParams()
 const categoryId = params.id as Id<"categories">;
 const [searchQuery, setSearchQuery] = useState('');
  const categoryWithFoods = useQuery(api.categories.getCategoryWithFoods, { categoryId });

   const filteredFoods = categoryWithFoods?.food.filter((food) => {
    const query = searchQuery.toLowerCase();
    return food.title.toLowerCase().includes(query);
  });

  return (
    <div className=' flex flex-col gap-y-3 px-8 mt-7'>
       <Header back />
      <div className='flex flex-row gap-x-3 items-center'>
          
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='bg-white text-black rounded-lg p-2 w-full'
          />
      </div>
      {filteredFoods? filteredFoods.map((item, index) => (
        <div key={index} className='p-3 bg-myYellow flex flex-row rounded-lg mb-2'>
          <div className='mr-4'>
             <FoodImage storageId={item.imageLink} className='rounded-lg' />
          </div>
                <div className='flex-1'>
                  <p className='text-myGreen text-lg font-bold'>{item.title}</p>
                  <p className='text-myGreen'>{item.description}</p>
                  <p className='text-myGreen'>Pour {item.person} personnes</p>
                </div>
              </div>
      )):<>
      <div className='flex flex-col items-center justify-center'>
        <p className='text-2xl font-bold text-myGreen'>No Food Found</p>
        <p className='text-xl text-myGreen'>Try another category</p>
      </div>
      </>}
    </div>
  )
}

export default CategoriesPage

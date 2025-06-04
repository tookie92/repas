"use client";

import { FoodImage } from '@/components/FoodImage';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { FoodDialog } from '@/components/FoodDialog';

const CategoriesPage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as Id<"categories">;
  const [open, setOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('');
  const categoryWithFoods = useQuery(api.categories.getCategoryWithFoods, { categoryId });
  const deleteFood = useMutation(api.food.deleteFood);

    // Récupération de l'utilisateur Clerk
  const { user} = useUser();
  
  // Récupération de l'utilisateur Convex basé sur le clerkId
  const convexUser = useQuery(
    api.users.getUserByClerkId, 
    user?.id ? { clerkId: user.id } : "skip"
  );

  //  if (!convexUser) {
  //   return (
  //     <div className="flex justify-center items-center p-8">
  //       <div className="text-lg">Synchronisation des données utilisateur...</div>
  //     </div>
  //   );
  // }


  const filteredFoods = categoryWithFoods?.food.filter((food) =>
    food.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (categoryWithFoods === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='relative flex flex-col gap-y-3 px-8 mt-7'>
      <Header back login />

      {/* Recherche + Ajout */}
      <div className='flex flex-row gap-x-3 mt-18 items-center'>
        <Input
          type="text"
          placeholder="Find a recipe"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='bg-white text-black rounded-lg p-2 w-full'
        />

        {/* Utilisation du FoodDialog pour l'ajout */}
        <FoodDialog  categoryId={categoryId}>
          <Button className="bg-myGreen hover:bg-myDarkGreen">
            Add Recipe
          </Button>
        </FoodDialog>
      </div>

      {/* Liste des recettes */}
      <ScrollArea className='h-[700px] w-full mt-7'>
        {filteredFoods?.map((item) => (
          <div
            key={item._id}
            className='p-3 bg-myYellow flex flex-row rounded-lg mb-2 cursor-pointer hover:bg-myLightYellow transition-colors'
          >
            <div className='mr-4'>
              <FoodImage
                storageId={item.imageLink}
                className='rounded-lg w-24 h-24 object-cover'
              />
            </div>
            <div className='flex-1'>
              <p className='text-myGreen text-lg font-bold'>{item.title}</p>
              <p className='text-myGreen line-clamp-2'>{item.description}</p>
              <p className='text-myGreen'>For {item.person} person{item.person > 1 ? 's' : ''}</p>
              <div className='flex gap-x-3 mt-2 items-center'>
                <EyeIcon
                  onClick={() => router.push(`/categories/${categoryId}/food/${item._id}`)}
                  className='text-myGreen w-5 h-5 hover:text-myDarkGreen'
                />

                {/* Utilisation du FoodDialog pour l'édition */}
                <FoodDialog categoryId={categoryId} foodToEdit={item}>
                  <PencilIcon className='text-myGreen w-5 h-5 hover:text-myDarkGreen' />
                </FoodDialog>

                {/* Bouton Supprimer (gardé séparé car logique différente) */}
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger asChild>
                    <Trash2Icon className='text-myGreen w-5 h-5 hover:text-myDarkGreen' />
                  </DrawerTrigger>
                  <DrawerContent className="w-full">
                    <DrawerHeader>
                      <DrawerTitle className="text-2xl">Delete the recipe</DrawerTitle>
                      <DrawerDescription>
                        Do you want to delete this recipe?
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className='flex justify-end gap-x-3 mt-4'>
                      <DrawerClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DrawerClose>
                    {!convexUser ? (<></>):(

                      <Button
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => {
                          deleteFood({ foodId: item._id , userId: convexUser._id }).then(() => router.refresh());
                        }}
                      >
                        Supprimer
                      </Button>
                    )}
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
        ))}
        <div className='h-[200px] w-full' />
      </ScrollArea>
    </div>
  );
};

export default CategoriesPage;
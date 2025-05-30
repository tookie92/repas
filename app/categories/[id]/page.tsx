"use client";

import { FoodImage } from '@/components/FoodImage';
import { FoodDialog } from '@/components/FoodDialog'; // Modifié
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CategoriesPage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as Id<"categories">;

  const [searchQuery, setSearchQuery] = useState('');
  const categoryWithFoods = useQuery(api.categories.getCategoryWithFoods, { categoryId });
  const deleteFood = useMutation(api.food.deleteFood);

  const filteredFoods = categoryWithFoods?.food.filter((food) =>
    food.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (categoryWithFoods === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div className='relative flex flex-col gap-y-3 px-8 mt-7'>
      <Header back />

      {/* Recherche + Ajout */}
      <div className='flex flex-row gap-x-3 mt-18 items-center'>
        <Input
          type="text"
          placeholder="Rechercher une recette"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='bg-white text-black rounded-lg p-2 w-full'
        />

        {/* Utilisation du FoodDialog pour l'ajout */}
        <FoodDialog categoryId={categoryId}>
          <Button className="bg-myGreen hover:bg-myDarkGreen">
            Ajouter une recette
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
              <p className='text-myGreen'>Pour {item.person} personne{item.person > 1 ? 's' : ''}</p>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Trash2Icon className='text-myGreen w-5 h-5 hover:text-myDarkGreen' />
                  </DialogTrigger>
                  <DialogContent className="w-full">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Supprimer la recette</DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette recette ?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='flex justify-end gap-x-3 mt-4'>
                      <DialogClose asChild>
                        <Button variant="secondary">Annuler</Button>
                      </DialogClose>
                      <Button
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => {
                          deleteFood({ foodId: item._id }).then(() => router.refresh());
                        }}
                      >
                        Supprimer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
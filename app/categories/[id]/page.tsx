"use client";
import { FoodImage } from '@/components/FoodImage';
import FormFood from '@/components/FormFood';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as Id<"categories">;
  const [searchQuery, setSearchQuery] = useState('');
  
  // Récupère les données de la catégorie avec ses recettes
  const categoryWithFoods = useQuery(api.categories.getCategoryWithFoods, { categoryId });

  // Filtre les recettes selon la recherche
  const filteredFoods = categoryWithFoods?.food.filter((food) => {
    const query = searchQuery.toLowerCase();
    return food.title.toLowerCase().includes(query);
  });

  // États de chargement
  if (categoryWithFoods === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  // Aucune recette trouvée
  if (!filteredFoods || filteredFoods.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-10'>
        <p className='text-2xl font-bold text-myGreen'>
          {searchQuery ? 'Aucun résultat' : 'Aucune recette trouvée'}
        </p>
        {searchQuery && (
          <p className='text-xl text-myGreen'>Recherche : `{searchQuery}`</p>
        )}
      </div>
    );
  }

  return (
    <div className='relative flex flex-col gap-y-3 px-8 mt-7'>
      <Header back />
      
      {/* Barre de recherche et bouton Ajouter */}
      <div className='flex flex-row gap-x-3 mt-18 items-center'>
        <Input
          type="text"
          placeholder="Rechercher une recette"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='bg-white text-black rounded-lg p-2 w-full'
        />
        
        {/* Dialogue pour ajouter une nouvelle recette */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-myGreen hover:bg-myDarkGreen">
              Ajouter une recette
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">Nouvelle Recette</DialogTitle>
            </DialogHeader>
            <FormFood catId={categoryId} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des recettes */}
      <ScrollArea className='h-[600px] w-full'>
        {filteredFoods.map((item) => (
          <div 
            key={item._id}
            onClick={() => router.push(`/categories/${categoryId}/food/${item._id}`)}
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
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

export default CategoriesPage;
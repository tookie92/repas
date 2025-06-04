"use client"
import { FoodImage } from '@/components/FoodImage'
import { Header } from '@/components/Header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { useParams} from 'next/navigation'
import React from 'react'

const FoodPage = () => {
    const {id, foodId} = useParams()
    
  // Récupérer la catégorie et ses plats depuis Convex
  const categoryWithFoods = useQuery(api.categories.getCategoryWithFoods, {
    categoryId: id as Id<"categories">,
  });

  // Récupérer les ingrédients associés au plat
  const foodIngredients = useQuery(api.foodIngredients.getFoodIngredients, {
    foodId: foodId as Id<"food">,
  });

  // Trouver le plat correspondant
  const food = categoryWithFoods?.food.find((f) => f._id.toString() === foodId);

   // Gérer les états de chargement et d'erreur
  if (categoryWithFoods === undefined || foodIngredients === undefined) {
    return (
      <div className='bg-beige flex-1 justify-center items-center'>
        <p className='mt-4'>Loading...</p>
      </div>
    );
  }

    if (!categoryWithFoods || !food) {
    return (
      <div className='bg-beige flex-1 justify-center items-center'>
        <p className='text-myGreen text-xl'>Food or category not found</p>
        {/* <Link href="/(root)/(tabs)/accueil" className='mt-4 bg-myGreen px-4 py-2 rounded-full'>
          <p className='text-beige'>Retour à l'accueil</p>
        </Link> */}
      </div>
    );
  }
  return (
    <div className='relative bg-beige h-full'>
      <Header login back/>
      <ScrollArea className='h-[100vh] w-full '>
        <FoodImage
          storageId={food.imageLink}
           className='w-full h-[350px] mb-4'
        />

        {/* contenu */}
        <div className='  p-4 flex items-start flex-col gap-y-3'>
          {/* Catégorie */}
          <div className='px-4 py-2 flex flex-row rounded-full border border-myGreen'>
            <p className='text-myGreen font-sans uppercase text-xl'>{categoryWithFoods.title}</p>
          </div>

          {/* Titre du plat */}
          <p className='text-3xl font-teko-bold text-myGreen mt-2'>{food.title}</p>

          {/* Description et détails */}
          <div className='flex flex-col gap-y-2 w-full'>
            <p className='font-sans text-myGreen text-xl uppercase'>Description</p>
            <div className='h-[0.5px] bg-myYellow' />
            <p className='mt-2 text-myGreen'>{food.description}</p>

            {/* Nombre de personnes */}
            {food.person <= 1 ? (
              <p className='mt-2 text-myGreen'>For {food.person} person</p>
            ) : (
              <p className='mt-2 text-myGreen'>For {food.person} persons</p>
            )}
          </div>

          {/* Ingrédients */}
          <div className='flex flex-col gap-y-2 w-full mt-4'>
            <p className='font-sans text-myGreen text-xl uppercase'>Ingredients</p>
            <div className='h-[0.5px] bg-myYellow' />
            {foodIngredients?.map((foodIngredient) =>{ 
               if (!foodIngredient || foodIngredient === null) {
                return null;
              }
              
              return(
             
              <div key={foodIngredient._id} className='flex flex-row items-start gap-x-3 mt-2'>
                <p className='text-myGreen font-bold'>•</p>
                <p className='text-myGreen flex-1'>
                  {foodIngredient.quantity} {foodIngredient.ingredient.unit} {foodIngredient.ingredient.name}
                </p>
              </div>
            )})}
          </div>

          {/* Étapes de préparation */}
          <div className='flex flex-col gap-y-2 w-full mt-4'>
            <p className='font-sans text-myGreen text-xl uppercase'>Steps of the preparation</p>
            <div className='h-[0.5px] bg-myYellow' />
            {food.steps.map((step, index) => (
              <div key={index} className='flex flex-col gap-y-4 mt-4'>
                {/* Numéro d'étape dans un cercle */}
                <div className='flex flex-row items-center gap-x-4'>
                  <div className='w-8 h-8 bg-myGreen rounded-full flex items-center justify-center'>
                    <p className='text-beige font-bold text-lg'>{step.stepNumber}</p>
                  </div>
                  <p className='text-myGreen font-bold text-lg'>Step {step.stepNumber}</p>
                </div>

                {/* Instruction de l'étape */}
                <p className='text-myGreen text-base pl-12'>{step.instruction}</p>

                {/* Séparateur (sauf pour la dernière étape) */}
                {index < food.steps.length - 1 && (
                  <div className='h-[0.5px] bg-myYellow mt-4' />
                )}
              </div>
            ))}
          </div>
          <div className='h-[200px] w-full'/>
        </div>
      </ScrollArea>
    </div>
  )
}

export default FoodPage
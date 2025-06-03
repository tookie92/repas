// components/FoodDialog.tsx
"use client";
import { useFoodFormStore } from "@/store/foodFormStore";
import { Id } from "@/convex/_generated/dataModel";
import { ReactNode, useState } from "react";
import FormFood from "./FormFood";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";

import { ScrollArea } from "./ui/scroll-area";


interface FoodDialogProps {
  categoryId: Id<"categories">;
  foodToEdit?: {
    _id: Id<"food">;
    title: string;
    description: string;
    person: number;
    imageLink: Id<"_storage">;
    steps: Array<{ stepNumber: number; instruction: string }>;
    ingredients: Array<{ ingredientId: Id<"ingredients">; quantity: string }>;
  };
  children: ReactNode;
}

export const FoodDialog = ({ categoryId, foodToEdit, children }: FoodDialogProps) => {
  const { setData, reset } = useFoodFormStore();
  const [open, setOpen] = useState(false);


  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div 
          onClick={() => {
            reset();
            if (foodToEdit) {
              // Transformer les ingrédients pour le format du formulaire
              const transformedIngredients = foodToEdit.ingredients.map(ing => ({
                id: crypto.randomUUID(),
                ingredientId: ing.ingredientId,
                name: "", // À charger séparément si nécessaire
                quantity: ing.quantity,
                unit: "", // À charger séparément si nécessaire
              }));

              setData({
                _id: foodToEdit._id,
                title: foodToEdit.title,
                description: foodToEdit.description,
                person: foodToEdit.person,
                imageLink: foodToEdit.imageLink,
                steps: foodToEdit.steps,
                ingredients: transformedIngredients,
              });
            }
          }}
        >
          {children}
        </div>
      </DrawerTrigger>
      <DrawerContent className="w-full">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">
            {foodToEdit ? "Modifier la recette" : "Nouvelle recette"}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[60vh]">
        <FormFood catId={categoryId} setOpen={(open)=>setOpen(open)} />
        <div className="h-44 lg:h-3"/>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
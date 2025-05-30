// components/FoodDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useFoodFormStore } from "@/store/foodFormStore";
import { Id } from "@/convex/_generated/dataModel";
import { ReactNode } from "react";
import FormFood from "./FormFood";

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

  return (
    <Dialog>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {foodToEdit ? "Modifier la recette" : "Nouvelle recette"}
          </DialogTitle>
        </DialogHeader>
        <FormFood catId={categoryId} />
      </DialogContent>
    </Dialog>
  );
};
import { Id } from "convex/_generated/dataModel";

export interface FormIngredient {
  id: string;
  ingredientId: Id<"ingredients"> | null;
  name: string;
  quantity: string;
  unit: string;
}

export interface FoodFormValues {
  _id?: Id<"food">; // Optionnel pour les mises à jour
  title: string;
  description: string;
  person: number;
  imageLink: Id<"_storage"> | null;
  steps: Array<{
    stepNumber: number;
    instruction: string;
  }>;
  ingredients: FormIngredient[];
}
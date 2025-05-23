import { z } from 'zod';

// Schéma pour les étapes
export const stepSchema = z.object({
  id: z.string(),
  stepNumber: z.number().min(1, "Le numéro d'étape est requis"),
  instruction: z.string().min(5, "L'instruction doit contenir au moins 5 caractères")
});

// Schéma pour les ingrédients
export const ingredientSchema = z.object({
  id: z.string(),
  ingredientId: z.string().nullable(),
  name: z.string().min(2, "Le nom de l'ingrédient est requis"),
  quantity: z.string().min(1, "La quantité est requise"),
  unit: z.string().min(1, "L'unité est requise")
});

// Schéma pour le formulaire de base
export const basicInfoSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  person: z.number().min(1, "Le nombre de personnes doit être au moins 1"),
  // categoryId: z.string().min(1, "La catégorie est requise")
});

// Schéma pour l'image
export const imageSchema = z.object({
  imageLink: z.instanceof(File, { message: "L'image est requise" })
});

// Schéma pour les étapes
export const stepsSchema = z.object({
  steps: z.array(z.object({
    stepNumber: z.number(),
    instruction: z.string().min(10, "L'instruction doit contenir au moins 10 caractères")
  })).min(1, "Au moins une étape est requise")
});

// Schéma pour les ingrédients

export const ingredientsSchema = z.object({
  ingredients: z.array(z.object({
    id: z.string(),
    ingredientId: z.string().min(1, "Sélectionnez un ingrédient"), // Plus de .nullable()
    name: z.string().min(1),
    quantity: z.string().min(1),
    unit: z.string().min(1)
  })).min(1)
});

// Schéma complet pour le formulaire
export const foodFormSchema = basicInfoSchema
  .merge(imageSchema)
  .merge(stepsSchema)
  .merge(ingredientsSchema);

export type FoodFormValues = z.infer<typeof foodFormSchema>;

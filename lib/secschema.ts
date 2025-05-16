import { z } from "zod";

export const FoodSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  description: z.string(),
  person: z.number().min(1, "Prévoir au moins 1 personne"),
  image: z.instanceof(File).optional(),
  steps: z.array(
    z.object({
      stepNumber: z.number(),
      instruction: z.string().min(1, "L'étape ne peut pas être vide"),
    })
  ),
  ingredients: z.array(
    z.object({
      ingredientId: z.string().min(1, "Choisis un ingrédient"),
      quantity: z.string().min(1, "La quantité est obligatoire"),
    })
  ),
});
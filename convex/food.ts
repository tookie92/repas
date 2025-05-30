import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// upsertFood
export const upsertFood = mutation({
  args: {
    foodId: v.optional(v.id('food')), // Nouveau - ID optionnel pour les mises à jour
    title: v.string(),
    description: v.string(),
    imageStorageId: v.id('_storage'),
    person: v.number(),
    categoryId: v.id('categories'),
    steps: v.array(v.object({
      stepNumber: v.number(),
      instruction: v.string(),
    })),
    ingredients: v.array(v.object({
      ingredientId: v.id('ingredients'),
      quantity: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    // Vérification de l'image
    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) {
      throw new Error("L'image n'a pas été trouvée dans le stockage");
    }

    // Données communes
    const foodData = {
      title: args.title,
      description: args.description,
      imageLink: args.imageStorageId,
      person: args.person,
      categoryId: args.categoryId,
      steps: args.steps,
    };

    // Logique d'upsert
    if (args.foodId) {
      // Mise à jour existante
      await ctx.db.patch(args.foodId, foodData);
      
      // Supprime les anciennes associations d'ingrédients
      const existingIngredients = await ctx.db
        .query('foodIngredients')
        .withIndex('by_food', q => q.eq('foodId', args.foodId as Id<'food'>))
        .collect();
      
      await Promise.all(existingIngredients.map(ing => ctx.db.delete(ing._id)));
    } else {
      // Création nouvelle
      args.foodId = await ctx.db.insert('food', foodData);
    }

    // Ajoute les nouveaux ingrédients (pour create et update)
    await Promise.all(args.ingredients.map(ingredient =>
      ctx.db.insert('foodIngredients', {
        foodId: args.foodId as Id<'food'>,
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity,
      })
    ));

    return args.foodId;
  },
});


// deleteFood
export const deleteFood = mutation({
  args: { foodId: v.id('food') },
  handler: async (ctx, args) => {
    await ctx.db.delete( args.foodId);
  },
});

// getFood
export const getFood = query({
  args: { foodId: v.id('food') },
  handler: async (ctx, args) => {
    const food = await ctx.db.get(args.foodId);
    if (!food) throw new Error("Plat non trouvé");

    const ingredients = await ctx.db
      .query('foodIngredients')
      .withIndex('by_food', q => q.eq('foodId', args.foodId))
      .collect();

    return {
      ...food,
      ingredients: ingredients.map(i => ({
        ingredientId: i.ingredientId,
        quantity: i.quantity
      }))
    };
  },
});


// Mutation pour générer une URL d'upload
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getImageUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
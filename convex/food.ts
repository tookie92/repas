
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const addFood = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageStorageId: v.id('_storage'), // Stocke l'ID de stockage plutôt qu'une URL
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
    // 1. Vérifier que l'image existe bien dans le stockage
    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) {
      throw new Error("L'image associée n'a pas été trouvée dans le stockage");
    }

    // 2. Insérer le nouveau plat avec le storageId de l'image
    const foodId = await ctx.db.insert('food', {
      title: args.title,
      description: args.description,
      imageLink: args.imageStorageId, // Stocke l'ID de stockage
      person: args.person,
      categoryId: args.categoryId,
      steps: args.steps,
    });

    // 3. Associer les ingrédients au plat
    for (const ingredient of args.ingredients) {
      await ctx.db.insert('foodIngredients', {
        foodId,
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity,
      });
    }

    // // 4. Déclencher une action interne si nécessaire (optionnel)
    // await ctx.scheduler.runAfter(0, internal.food.notifyNewFood, {
    //   foodId,
    // });

    return foodId;
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
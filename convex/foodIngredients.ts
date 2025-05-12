import { query } from './_generated/server';
import { v } from 'convex/values';

export const getFoodIngredients = query({
  args: { foodId: v.id('food') },
  handler: async (ctx, args) => {
    const foodIngredients = await ctx.db
      .query('foodIngredients')
      .withIndex('by_food', q => q.eq('foodId', args.foodId))
      .collect();

    // Récupérer les détails des ingrédients et filtrer les null
    const ingredients = await Promise.all(
      foodIngredients.map(async (foodIngredient) => {
        const ingredient = await ctx.db.get(foodIngredient.ingredientId);
        return ingredient ? { ...foodIngredient, ingredient } : null;
      })
    );

    // Filtrer les éléments null
    return ingredients.filter(Boolean);
  },
});
import { v } from 'convex/values';
import { query } from './_generated/server';

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Dans votre query Convex (api.categories.ts)
export const getCategoryWithFoods = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);
    if (!category) throw new Error("Category not found");

    const foods = await ctx.db
      .query("food")
      .withIndex("by_category", q => q.eq("categoryId", args.categoryId))
      .collect();

    const foodsWithIngredients = await Promise.all(
      foods.map(async food => {
        const ingredients = await ctx.db
          .query("foodIngredients")
          .withIndex("by_food", q => q.eq("foodId", food._id))
          .collect();
        return { ...food, ingredients };
      })
    );

    return { ...category, food: foodsWithIngredients };
  },
});

export const getGeneratedMealsCategory = query({
  handler: async (ctx) => {
      return await ctx.db
          .query('categories')
          .filter(q => q.eq(q.field('title'), 'Generated meals'))
          .unique();
  },
});
import { v } from 'convex/values';
import { query } from './_generated/server';

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getCategoryWithFoods = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);
    
    if (!category) return null;
    
    const foods = await ctx.db
      .query("food")
      .withIndex("by_category", q => q.eq("categoryId", args.categoryId))
      .collect();

    // Ajoutez les URLs d'images
    const foodsWithImages = await Promise.all(
      foods.map(async (food) => ({
        ...food,
        imageUrl: food.imageLink ? await ctx.storage.getUrl(food.imageLink) : null
      }))
    );
    
    return {
      ...category,
      food: foodsWithImages,
    };
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
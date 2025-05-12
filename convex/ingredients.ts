import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getIngredients = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('ingredients').collect();
  },
});
// In your ingredients.js Convex file
export const findOrCreate = mutation({
  args: { 
      name: v.string(),
      unit: v.string() 
  },
  handler: async (ctx, args) => {
      // Check if ingredient exists
      const existing = await ctx.db
          .query('ingredients')
          .filter(q => q.eq(q.field('name'), args.name.toLowerCase()))
          .unique();
          
      if (existing) {
          return existing._id;
      }
      
      // Create new ingredient
      return await ctx.db.insert('ingredients', {
          name: args.name.toLowerCase(),
          unit: args.unit.toLowerCase()
      });
  },
});
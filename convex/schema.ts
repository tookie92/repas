import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    categories:defineTable({
        title: v.string(),
        imageLink: v.string()
    }),
    food: defineTable({
        title: v.string(),
        description: v.string(),
        imageLink: v.id("_storage"), 
        person: v.number(),
        categoryId: v.id('categories'),
        steps: v.array(v.object({
          stepNumber: v.number(),
          instruction: v.string(),
        })),
      }).index('by_category', ['categoryId']),
    
      ingredients: defineTable({
        name: v.string(),
        unit: v.string(), // Exemple : "g", "tasse", "cuillère à soupe"
      }),
    
      foodIngredients: defineTable({
        foodId: v.id('food'),
        ingredientId: v.id('ingredients'),
        quantity: v.string(), // Exemple : "200", "1", "2"
      }).index('by_food', ['foodId']),

})
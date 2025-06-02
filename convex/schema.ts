import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Table pour les utilisateurs Clerk
    users: defineTable({
        clerkId: v.string(), // ID de l'utilisateur Clerk
        email: v.string(),
        first_name: v.optional(v.string()),
        last_name: v.optional(v.string()),
        bio: v.optional(v.string()),
        username: v.union(v.string(), v.null()), // Nom d'utilisateur, peut être null
        imageUrl: v.optional(v.string()),
    }).index('by_clerk_id', ['clerkId']),

    categories:defineTable({
        title: v.string(),
        imageLink: v.string(),
        userId: v.optional(v.id('users')),
    }),
   food: defineTable({
        title: v.string(),
        description: v.string(),
        imageLink: v.id("_storage"), 
        person: v.number(),
        categoryId: v.id('categories'),
        userId: v.id('users'), // Relier la recette à un utilisateur
        steps: v.array(v.object({
          stepNumber: v.number(),
          instruction: v.string(), 
        })),
    })
    .index('by_category', ['categoryId'])
    .index('by_user', ['userId'])
    .index('by_user_and_category', ['userId', 'categoryId']),
    
    ingredients: defineTable({
        name: v.string(),
        unit: v.string(), // Exemple : "g", "tasse", "cuillère à soupe"
        // Optionnel : permettre aux utilisateurs d'avoir leurs propres ingrédients
        userId: v.optional(v.id('users')),
    }).index('by_user', ['userId']),
    
    foodIngredients: defineTable({
        foodId: v.id('food'),
        ingredientId: v.id('ingredients'),
        quantity: v.string(), // Exemple : "200", "1", "2"
    }).index('by_food', ['foodId'])
  });
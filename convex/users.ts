import { v } from "convex/values";
import { internalMutation,  query } from "./_generated/server";

export const getAllUsers = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return users;
    },     
})

export const createUser = internalMutation({
    args:{
        clerkId: v.string(), // ID de l'utilisateur Clerk
        email: v.string(),
        first_name: v.optional(v.string()),
        last_name: v.optional(v.string()),
        bio: v.optional(v.string()),
        username: v.union(v.string(), v.null()), // Nom d'utilisateur, peut être null
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await ctx.db.insert("users",{
            ...args,
            username: args.username || `${args.first_name} ${args.last_name}`, // Assurez-vous que le nom d'utilisateur est null si non fourni
        });
        return userId;
    },
})

// Query pour récupérer un utilisateur par son clerkId
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

// Query pour récupérer un utilisateur par son ID Convex
export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});
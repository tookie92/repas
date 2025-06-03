import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ========== QUERIES EXISTANTES (INCHANGÉES) ==========
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

// ========== NOUVELLES QUERIES ==========

// Récupérer une catégorie par ID
export const getCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);
    if (!category) throw new Error("Catégorie non trouvée");
    return category;
  },
});

// Récupérer les catégories d'un utilisateur spécifique
export const getCategoriesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

// Récupérer toutes les catégories (publiques et utilisateur)
export const getAllCategoriesForUser = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const publicCategories = await ctx.db
      .query("categories")
      .filter(q => q.eq(q.field("userId"), undefined))
      .collect();

    if (!args.userId) {
      return publicCategories;
    }

    const userCategories = await ctx.db
      .query("categories")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .collect();

    return [...publicCategories, ...userCategories];
  },
});

// ========== MUTATIONS CRUD ==========

// Créer une nouvelle catégorie
export const createCategory = mutation({
  args: {
    title: v.string(),
    imageLink: v.string(),
    userId: v.optional(v.id("users")), // Optionnel pour les catégories publiques
  },
  handler: async (ctx, args) => {
    // Vérifier si une catégorie avec ce titre existe déjà pour cet utilisateur
    const existingCategory = await ctx.db
      .query("categories")
      .filter(q => 
        q.and(
          q.eq(q.field("title"), args.title),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .first();

    if (existingCategory) {
      throw new Error("Une catégorie avec ce nom existe déjà");
    }

    return await ctx.db.insert("categories", {
      title: args.title,
      imageLink: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      userId: args.userId,
    });
  },
});

// Mettre à jour une catégorie existante
export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    title: v.optional(v.string()),
    imageLink: v.optional(v.string()),
    userId: v.optional(v.id("users")), // Pour vérifier les permissions
  },
  handler: async (ctx, args) => {
    // Récupérer la catégorie existante
    const existingCategory = await ctx.db.get(args.categoryId);
    if (!existingCategory) {
      throw new Error("Catégorie non trouvée");
    }

    // Vérifier les permissions (si userId fourni)
    if (args.userId && existingCategory.userId !== args.userId) {
      throw new Error("Vous n'êtes pas autorisé à modifier cette catégorie");
    }

    // Préparer les données de mise à jour
    const updateData: Partial<{ title: string; imageLink: string }> = {};
    if (args.title !== undefined) updateData.title = args.title;
    if (args.imageLink !== undefined) updateData.imageLink = args.imageLink;

    // Vérifier l'unicité du titre si changé
    if (args.title && args.title !== existingCategory.title) {
      const duplicateCategory = await ctx.db
        .query("categories")
        .filter(q => 
          q.and(
            q.eq(q.field("title"), args.title),
            q.eq(q.field("userId"), existingCategory.userId),
            q.neq(q.field("_id"), args.categoryId)
          )
        )
        .first();

      if (duplicateCategory) {
        throw new Error("Une catégorie avec ce nom existe déjà");
      }
    }

    await ctx.db.patch(args.categoryId, updateData);
    return args.categoryId;
  },
});

// Supprimer une catégorie
export const deleteCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    userId: v.optional(v.id("users")), // Pour vérifier les permissions
  },
  handler: async (ctx, args) => {
    // Récupérer la catégorie
    const category = await ctx.db.get(args.categoryId);
    if (!category) {
      throw new Error("Catégorie non trouvée");
    }

    // Vérifier les permissions
    if (args.userId && category.userId !== args.userId) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cette catégorie");
    }

    // Vérifier s'il y a des plats dans cette catégorie
    const foodsInCategory = await ctx.db
      .query("food")
      .withIndex("by_category", q => q.eq("categoryId", args.categoryId))
      .collect();

    if (foodsInCategory.length > 0) {
      throw new Error(`Impossible de supprimer la catégorie. Elle contient ${foodsInCategory.length} plat(s)`);
    }

    // Supprimer la catégorie
    await ctx.db.delete(args.categoryId);
    return true;
  },
});

// Dupliquer une catégorie (utile pour créer des variantes)
export const duplicateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    newTitle: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Récupérer la catégorie source
    const sourceCategory = await ctx.db.get(args.categoryId);
    if (!sourceCategory) {
      throw new Error("Catégorie source non trouvée");
    }

    // Vérifier l'unicité du nouveau titre
    const existingCategory = await ctx.db
      .query("categories")
      .filter(q => 
        q.and(
          q.eq(q.field("title"), args.newTitle),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .first();

    if (existingCategory) {
      throw new Error("Une catégorie avec ce nom existe déjà");
    }

    // Créer la nouvelle catégorie
    return await ctx.db.insert("categories", {
      title: args.newTitle,
      imageLink: sourceCategory.imageLink,
      userId: args.userId,
    });
  },
});

// Compter le nombre de plats par catégorie
export const getCategoriesWithFoodCount = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const categories = args.userId 
      ? await ctx.db
          .query("categories")
          .filter(q => 
            q.or(
              q.eq(q.field("userId"), args.userId),
              q.eq(q.field("userId"), undefined)
            )
          )
          .collect()
      : await ctx.db.query("categories").collect();

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const foodCount = await ctx.db
          .query("food")
          .withIndex("by_category", q => q.eq("categoryId", category._id))
          .collect();
        
        return {
          ...category,
          foodCount: foodCount.length,
        };
      })
    );

    return categoriesWithCount;
  },
});
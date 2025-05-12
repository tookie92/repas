// convex/storage.ts
import { internalAction, mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const uploadImage = internalAction({
  args: {
    imageLink: v.any(), // Le fichier à uploader
  },
  handler: async (ctx, args) => {
    const storageId = await ctx.storage.store(new Blob(args.imageLink));
    return storageId; // Retourne l'ID du fichier stocké
  },
});


export const getImageUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
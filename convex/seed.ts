import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Insérer des catégories
    const cakeCategoryId = await ctx.db.insert('categories', {
      title: 'Cake',
      imageLink: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    });
    const dessertCategoryId = await ctx.db.insert('categories', {
      title: 'Dessert',
      imageLink: 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
    });
    const saltyCategoryId = await ctx.db.insert('categories', {
      title: 'Salé',
      imageLink: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc',
    });

    // Insérer des ingrédients
    const ingredient1Id = await ctx.db.insert('ingredients', {
      name: 'Farine',
      unit: 'g',
    });
    const ingredient2Id = await ctx.db.insert('ingredients', {
      name: 'Sucre',
      unit: 'g',
    });
    const ingredient3Id = await ctx.db.insert('ingredients', {
      name: 'Œufs',
      unit: '',
    });
    const ingredient4Id = await ctx.db.insert('ingredients', {
      name: 'Beurre',
      unit: 'g',
    });
    const ingredient5Id = await ctx.db.insert('ingredients', {
      name: 'Chocolat',
      unit: 'g',
    });
    const ingredient6Id = await ctx.db.insert('ingredients', {
      name: 'Fromage',
      unit: 'g',
    });
    const ingredient7Id = await ctx.db.insert('ingredients', {
      name: 'Pâtes',
      unit: 'g',
    });
    const ingredient8Id = await ctx.db.insert('ingredients', {
      name: 'Tomates',
      unit: 'g',
    });

    // Insérer des plats pour la catégorie "Cake"
    const cake1Id = await ctx.db.insert('food', {
      title: 'Gâteau au Chocolat',
      description: 'Un gâteau moelleux et riche en chocolat.',
      imageLink: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62',
      person: 6,
      categoryId: cakeCategoryId,
      steps: [
        { stepNumber: 1, instruction: 'Préchauffer le four à 180°C.' },
        { stepNumber: 2, instruction: 'Faire fondre le chocolat avec le beurre.' },
        { stepNumber: 3, instruction: 'Mélanger les œufs, le sucre et la farine.' },
        { stepNumber: 4, instruction: 'Incorporer le mélange chocolat-beurre et cuire au four pendant 25 minutes.' },
      ],
    });

    const cake2Id = await ctx.db.insert('food', {
      title: 'Cheesecake',
      description: 'Un dessert crémeux et délicieux.',
      imageLink: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df',
      person: 8,
      categoryId: cakeCategoryId,
      steps: [
        { stepNumber: 1, instruction: 'Écraser des biscuits pour former la base.' },
        { stepNumber: 2, instruction: 'Mélanger le fromage frais, le sucre et les œufs.' },
        { stepNumber: 3, instruction: 'Verser la préparation sur la base et cuire au four pendant 30 minutes.' },
      ],
    });

    // Insérer des plats pour la catégorie "Dessert"
    const dessert1Id = await ctx.db.insert('food', {
      title: 'Tiramisu',
      description: 'Un dessert italien à base de café et de mascarpone.',
      imageLink: 'https://images.unsplash.com/photo-1621877782687-5dcaacf6a0a2',
      person: 4,
      categoryId: dessertCategoryId,
      steps: [
        { stepNumber: 1, instruction: 'Préparer le café et laisser refroidir.' },
        { stepNumber: 2, instruction: 'Mélanger le mascarpone avec les œufs et le sucre.' },
        { stepNumber: 3, instruction: 'Tremper les biscuits dans le café et les disposer dans un plat.' },
        { stepNumber: 4, instruction: 'Alterner les couches de biscuits et de crème, puis réfrigérer.' },
      ],
    });

    const dessert2Id = await ctx.db.insert('food', {
      title: 'Mousse au Chocolat',
      description: 'Une mousse légère et onctueuse.',
      imageLink: 'https://images.unsplash.com/photo-1606313564205-45f40bf6c124',
      person: 4,
      categoryId: dessertCategoryId,
      steps: [
        { stepNumber: 1, instruction: 'Faire fondre le chocolat.' },
        { stepNumber: 2, instruction: 'Monter les blancs en neige.' },
        { stepNumber: 3, instruction: 'Incorporer délicatement le chocolat fondu aux blancs en neige.' },
        { stepNumber: 4, instruction: 'Réfrigérer pendant 2 heures.' },
      ],
    });

    // Insérer des plats pour la catégorie "Salé"
    const salty1Id = await ctx.db.insert('food', {
      title: 'Pâtes Carbonara',
      description: 'Un classique italien avec des pâtes, des œufs, du fromage et du bacon.',
      imageLink: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
      person: 4,
      categoryId: saltyCategoryId,
      steps: [
        { stepNumber: 1, instruction: 'Faire cuire les pâtes dans une casserole d\'eau bouillante salée.' },
        { stepNumber: 2, instruction: 'Pendant ce temps, faire revenir le bacon dans une poêle jusqu\'à ce qu\'il soit croustillant.' },
        { stepNumber: 3, instruction: 'Dans un bol, mélanger les œufs et le fromage râpé.' },
        { stepNumber: 4, instruction: 'Égoutter les pâtes et les mélanger avec le bacon et la sauce aux œufs.' },
      ],
    });

    const salty2Id = await ctx.db.insert('food', {
      title: 'Pizza Margherita',
      description: 'Une pizza simple et savoureuse avec de la tomate, de la mozzarella et du basilic.',
      imageLink: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94',
      person: 2,
      categoryId: saltyCategoryId,
      steps: [
        { stepNumber: 1, instruction: 'Étaler la pâte à pizza.' },
        { stepNumber: 2, instruction: 'Étaler la sauce tomate sur la pâte.' },
        { stepNumber: 3, instruction: 'Ajouter la mozzarella et le basilic.' },
        { stepNumber: 4, instruction: 'Cuire au four à 220°C pendant 10-12 minutes.' },
      ],
    });

    // Associer les ingrédients aux plats
    await ctx.db.insert('foodIngredients', { foodId: cake1Id, ingredientId: ingredient1Id, quantity: '200' });
    await ctx.db.insert('foodIngredients', { foodId: cake1Id, ingredientId: ingredient2Id, quantity: '150' });
    await ctx.db.insert('foodIngredients', { foodId: cake1Id, ingredientId: ingredient3Id, quantity: '3' });
    await ctx.db.insert('foodIngredients', { foodId: cake1Id, ingredientId: ingredient4Id, quantity: '100' });

    await ctx.db.insert('foodIngredients', { foodId: cake2Id, ingredientId: ingredient1Id, quantity: '150' });
    await ctx.db.insert('foodIngredients', { foodId: cake2Id, ingredientId: ingredient2Id, quantity: '100' });
    await ctx.db.insert('foodIngredients', { foodId: cake2Id, ingredientId: ingredient3Id, quantity: '2' });
    await ctx.db.insert('foodIngredients', { foodId: cake2Id, ingredientId: ingredient6Id, quantity: '200' });

    await ctx.db.insert('foodIngredients', { foodId: dessert1Id, ingredientId: ingredient2Id, quantity: '100' });
    await ctx.db.insert('foodIngredients', { foodId: dessert1Id, ingredientId: ingredient3Id, quantity: '3' });
    await ctx.db.insert('foodIngredients', { foodId: dessert1Id, ingredientId: ingredient5Id, quantity: '200' });

    await ctx.db.insert('foodIngredients', { foodId: dessert2Id, ingredientId: ingredient2Id, quantity: '50' });
    await ctx.db.insert('foodIngredients', { foodId: dessert2Id, ingredientId: ingredient3Id, quantity: '2' });
    await ctx.db.insert('foodIngredients', { foodId: dessert2Id, ingredientId: ingredient5Id, quantity: '150' });

    await ctx.db.insert('foodIngredients', { foodId: salty1Id, ingredientId: ingredient7Id, quantity: '200' });
    await ctx.db.insert('foodIngredients', { foodId: salty1Id, ingredientId: ingredient3Id, quantity: '2' });
    await ctx.db.insert('foodIngredients', { foodId: salty1Id, ingredientId: ingredient6Id, quantity: '50' });

    await ctx.db.insert('foodIngredients', { foodId: salty2Id, ingredientId: ingredient1Id, quantity: '200' });
    await ctx.db.insert('foodIngredients', { foodId: salty2Id, ingredientId: ingredient8Id, quantity: '100' });
    await ctx.db.insert('foodIngredients', { foodId: salty2Id, ingredientId: ingredient6Id, quantity: '150' });

    return 'Base de données remplie avec succès !';
  },
});
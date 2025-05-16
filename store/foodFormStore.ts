// store/foodFormStore.ts
import { create } from 'zustand';
import { Id } from '@/convex/_generated/dataModel';

// 1️⃣ Les "ingrédients" de ton état global
interface FoodFormState {
  // Infos de base
  title: string;
  description: string;
  imageUri: string | null; // URL temporaire de l'image
  imageStorageId: string; // ID de l'image dans Convex
  person: number;
  
  // Étapes de préparation
  steps: {
    stepNumber: number;
    instruction: string;
  }[];
  
  // Ingrédients
  ingredients: {
    ingredientId: Id<'ingredients'>;
    quantity: string;
  }[];
  
  // Navigation
  currentStep: number;

  // 2️⃣ Les "actions" (recettes magiques)
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setImageUri: (uri: string | null) => void;
  setImageStorageId: (id: string) => void;
  setPerson: (person: number) => void;
  
  // Gestion des étapes
  addStep: () => void;
  removeStep: (index: number) => void;
  updateStep: (index: number, instruction: string) => void;
  
  // Gestion des ingrédients
  addIngredient: () => void;
  removeIngredient: (index: number) => void;
  updateIngredient: (index: number, ingredientId: Id<'ingredients'>, quantity: string) => void;
  
  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

// 3️⃣ La "cuisine" (création du store)
export const useFoodFormStore = create<FoodFormState>((set) => ({
  // 🥣 Ingrédients initiaux (formulaire vide)
  title: '',
  description: '',
  imageUri: null,
  imageStorageId: '',
  person: 0,
  steps: [{ stepNumber: 1, instruction: '' }],
  ingredients: [{ ingredientId: '' as Id<'ingredients'>, quantity: '' }],
  currentStep: 0,

  // 🔮 Potions magiques (actions)
  // Mise à jour des champs simples
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setImageUri: (imageUri) => set({ imageUri }),
  setImageStorageId: (imageStorageId) => set({ imageStorageId }),
  setPerson: (person) => set({ person }),

  // Ajouter une étape (ex: "Étape 2: Mélanger")
  addStep: () => set((state) => ({
    steps: [...state.steps, { 
      stepNumber: state.steps.length + 1, 
      instruction: '' 
    }]
  })),

  // Supprimer une étape
  removeStep: (index) => set((state) => {
    const newSteps = state.steps.filter((_, i) => i !== index);
    // Réorganise les numéros (ex: supprimer l'étape 2 → l'étape 3 devient 2)
    return {
      steps: newSteps.map((step, i) => ({ 
        ...step, 
        stepNumber: i + 1 
      }))
    };
  }),

  // Modifier le texte d'une étape
  updateStep: (index, instruction) => set((state) => {
    const newSteps = [...state.steps];
    newSteps[index].instruction = instruction;
    return { steps: newSteps };
  }),

  // Ajouter un ingrédient (ex: "Farine, 200g")
  addIngredient: () => set((state) => ({
    ingredients: [...state.ingredients, { 
      ingredientId: '' as Id<'ingredients'>, 
      quantity: '' 
    }]
  })),

  // Supprimer un ingrédient
  removeIngredient: (index) => set((state) => ({
    ingredients: state.ingredients.filter((_, i) => i !== index)
  })),

  // Modifier un ingrédient
  updateIngredient: (index, ingredientId, quantity) => set((state) => {
    const newIngredients = [...state.ingredients];
    newIngredients[index] = { ingredientId, quantity };
    return { ingredients: newIngredients };
  }),

  // Navigation
  nextStep: () => set((state) => ({ 
    currentStep: state.currentStep + 1 
  })),
  prevStep: () => set((state) => ({ 
    currentStep: state.currentStep - 1 
  })),

  // Réinitialiser tout le formulaire
  resetForm: () => set({
    title: '',
    description: '',
    imageUri: null,
    imageStorageId: '',
    person: 0,
    steps: [{ stepNumber: 1, instruction: '' }],
    ingredients: [{ ingredientId: '' as Id<'ingredients'>, quantity: '' }],
    currentStep: 0
  })
}));
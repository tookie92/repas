import { create } from 'zustand';
import { Id } from '@/convex/_generated/dataModel';
import { z } from 'zod';
import { basicInfoSchema, foodFormSchema, imageSchema, ingredientsSchema, stepsSchema } from '@/lib/secschema';

interface Step {
  stepNumber: number;
  instruction: string;
}

interface Ingredient {
  ingredientId: Id<'ingredients'> | null;
  name: string;
  quantity: string;
  unit: string;
}

interface FoodFormState {
  // Données du formulaire
  title: string;
  description: string;
  imageFile: File | null;
  imageStorageId: string;
  person: number;
  steps: Step[];
  ingredients: Ingredient[];
  currentStep: number;
  categoryId: Id<'categories'> | null;
  
  // Validation et erreurs
  formErrors: Record<string, string[]>;
  
  // Actions - Mise à jour champs de base
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setImageFile: (file: File | null) => void;
  setImageStorageId: (id: string) => void;
  setPerson: (person: number) => void;
  setCategoryId: (id: Id<'categories'> | null) => void;
  
  // Actions - Étapes
  addStep: () => void;
  removeStep: (index: number) => void;
  updateStep: (index: number, instruction: string) => void;
  
  // Actions - Ingrédients
  addIngredient: () => void;
  removeIngredient: (index: number) => void;
  updateIngredient: (
    index: number, 
    data: { 
      ingredientId?: Id<'ingredients'> | null,
      name?: string,
      quantity?: string,
      unit?: string
    }
  ) => void;
  
  // Navigation et validation
  nextStep: () => boolean;
  prevStep: () => void;
  validateCurrentStep: () => boolean;
  validateForm: () => boolean;
  
  // Réinitialisation
  resetForm: () => void;
}

const useFoodFormStore = create<FoodFormState>((set, get) => ({
  // Valeurs initiales
  title: '',
  description: '',
  imageFile: null,
  imageStorageId: '',
  person: 2,
  steps: [{ stepNumber: 1, instruction: '' }],
  ingredients: [{ ingredientId: null, name: '', quantity: '', unit: '' }],
  currentStep: 0,
  categoryId: null,
  formErrors: {},

  // Actions - Mise à jour des champs de base
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setImageFile: (imageFile) => set({ imageFile }),
  setImageStorageId: (imageStorageId) => set({ imageStorageId }),
  setPerson: (person) => set({ person }),
  setCategoryId: (categoryId) => set({ categoryId }),

  // Actions - Étapes
  addStep: () => set((state) => ({
    steps: [...state.steps, { stepNumber: state.steps.length + 1, instruction: '' }]
  })),

  removeStep: (index) => set((state) => {
    if (state.steps.length <= 1) return state; // Garder au moins une étape
    
    const newSteps = state.steps.filter((_, i) => i !== index);
    return {
      steps: newSteps.map((step, i) => ({ ...step, stepNumber: i + 1 }))
    };
  }),

  updateStep: (index, instruction) => set((state) => {
    const newSteps = [...state.steps];
    if (newSteps[index]) {
      newSteps[index].instruction = instruction;
    }
    return { steps: newSteps };
  }),

  // Actions - Ingrédients
  addIngredient: () => set((state) => ({
    ingredients: [...state.ingredients, { ingredientId: null, name: '', quantity: '', unit: '' }]
  })),

  removeIngredient: (index) => set((state) => {
    if (state.ingredients.length <= 1) return state; // Garder au moins un ingrédient
    
    return {
      ingredients: state.ingredients.filter((_, i) => i !== index)
    };
  }),

  updateIngredient: (index, data) => set((state) => {
    const newIngredients = [...state.ingredients];
    if (newIngredients[index]) {
      newIngredients[index] = { ...newIngredients[index], ...data };
    }
    return { ingredients: newIngredients };
  }),

  // Navigation et validation
  validateCurrentStep: () => {
    const { currentStep, title, description, person, categoryId, imageFile, steps, ingredients } = get();
    let errors: Record<string, string[]> = {};
    let isValid = true;

    try {
      switch (currentStep) {
        case 0: // Infos de base
          basicInfoSchema.parse({
            title,
            description,
            person,
            categoryId
          });
          break;
        case 1: // Image
          imageSchema.parse({
            imageLink: imageFile
          });
          break;
        case 2: // Étapes
          // Transformer les étapes pour le schéma de validation
          const stepsWithId = steps.map(step => ({
            id: `step-${step.stepNumber}`,
            stepNumber: step.stepNumber,
            instruction: step.instruction
          }));
          
          stepsSchema.parse({
            steps: stepsWithId
          });
          break;
        case 3: // Ingrédients
          // Transformer les ingrédients pour le schéma de validation
          const ingredientsWithId = ingredients.map((ing, index) => ({
            id: `ing-${index}`,
            ingredientId: ing.ingredientId,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit
          }));
          
          ingredientsSchema.parse({
            ingredients: ingredientsWithId
          });
          break;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Fixed: Convert ZodError's fieldErrors into the expected Record<string, string[]> format
        const fieldErrors = error.formErrors.fieldErrors;
        const processedErrors: Record<string, string[]> = {};
        
        // Transform each error field to ensure they are string[]
        Object.entries(fieldErrors).forEach(([key, messages]) => {
          processedErrors[key] = messages || [];
        });
        
        errors = processedErrors;
        isValid = false;
      }
    }

    set({ formErrors: errors });
    return isValid;
  },
  
  validateForm: () => {
    const { title, description, person, categoryId, imageFile, steps, ingredients } = get();
    let isValid = true;
    let errors: Record<string, string[]> = {};

    try {
      // Transformer les données pour correspondre au schéma
      const stepsWithId = steps.map(step => ({
        id: `step-${step.stepNumber}`,
        stepNumber: step.stepNumber,
        instruction: step.instruction
      }));
      
      const ingredientsWithId = ingredients.map((ing, index) => ({
        id: `ing-${index}`,
        ingredientId: ing.ingredientId,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit
      }));
      
      foodFormSchema.parse({
        title,
        description,
        person,
        categoryId,
        imageLink: imageFile,
        steps: stepsWithId,
        ingredients: ingredientsWithId
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Fixed: Convert ZodError's fieldErrors into the expected Record<string, string[]> format
        const fieldErrors = error.formErrors.fieldErrors;
        const processedErrors: Record<string, string[]> = {};
        
        // Transform each error field to ensure they are string[]
        Object.entries(fieldErrors).forEach(([key, messages]) => {
          processedErrors[key] = messages || [];
        });
        
        errors = processedErrors;
        isValid = false;
      }
    }

    set({ formErrors: errors });
    return isValid;
  },
  
  nextStep: () => {
    const { validateCurrentStep, currentStep } = get();
    
    // Valider l'étape actuelle avant de passer à la suivante
    if (validateCurrentStep()) {
      set({ currentStep: currentStep + 1 });
      return true;
    }
    
    return false;
  },
  
  prevStep: () => set((state) => {
    if (state.currentStep > 0) {
      return { currentStep: state.currentStep - 1 };
    }
    return state;
  }),

  // Réinitialisation
  resetForm: () => set({
    title: '',
    description: '',
    imageFile: null,
    imageStorageId: '',
    person: 2,
    steps: [{ stepNumber: 1, instruction: '' }],
    ingredients: [{ ingredientId: null, name: '', quantity: '', unit: '' }],
    currentStep: 0,
    categoryId: null,
    formErrors: {}
  })
}));

export default useFoodFormStore;
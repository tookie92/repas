"use client";
import React, { useState } from "react";
import BasicInfo from "./step/BasicInfo";
import Ingredients from "./step/Ingredients";
import Steps from "./step/Steps";
import ImageUpload from "./step/ImageUpload";
import { useFoodFormStore } from "@/store/foodFormStore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FormIngredient } from "@/types/food";
import Confirmation from "./step/Confirmation";

// Types pour les props des composants
type StepComponentProps = {
  onNext: () => void;
  onPrev: () => void;
  onSubmit?: () => Promise<void>;
  isLastStep?: boolean;
  isFirstStep?: boolean;
};

type StepConfig = {
  component: React.ComponentType<StepComponentProps>;
};

const steps: StepConfig[] = [
  { 
    component: BasicInfo 
  },
  { 
    component: Ingredients 
  },
  { 
    component: Steps 
  },
  { 
    component: ImageUpload 
  },
  { 
    component: (props) => (
      <Confirmation 
        onPrev={props.onPrev} 
        onSubmit={props.onSubmit || (() => Promise.resolve())} 
        isLastStep={props.isLastStep}
      />
    )
  }
];

const FormFood = ({ catId }: { catId: string }) => {
  const [step, setStep] = useState(0);
  const { data, reset } = useFoodFormStore();
  const addFoodMutation = useMutation(api.food.addFood);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

const handleSubmit = async () => {
  try {
    // Validation
    const requiredFields = ['title', 'description', 'imageLink'];
    const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);
    if (missingFields.length > 0) {
      throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
    }

    // Transformation sécurisée des ingrédients
    const ingredients = data.ingredients || [];
    const validIngredients = ingredients.filter((i): i is FormIngredient => !!i.ingredientId);
    
    const transformedIngredients = validIngredients.map(({ ingredientId, quantity }) => ({
      ingredientId: ingredientId!, // Le ! est sûr grâce au filtre
      quantity
    }));

    await addFoodMutation({
      title: data.title!,
      description: data.description!,
      person: data.person || 1,
      categoryId: catId as Id<"categories">,
      imageStorageId: data.imageLink as Id<"_storage">,
      steps: data.steps || [],
      ingredients: transformedIngredients,
    });

    reset();
    setStep(0);
  } catch (error) {
    console.error("Erreur lors de la soumission:", error);
    // Ajouter une notification utilisateur ici
  }
};

  const StepComponent = steps[step].component;

  return (
    <div className=" flex flex-col gap-y-5 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Ajouter un plat</h1>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">
            Étape {step + 1} sur {steps.length}
          </p>
        </div>
        <div className="w-full h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <StepComponent
        onNext={next}
        onPrev={prev}
        onSubmit={handleSubmit}
        isLastStep={step === steps.length - 1}
        isFirstStep={step === 0}
      />
    </div>
  );
};

export default FormFood;
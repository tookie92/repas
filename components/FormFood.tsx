"use client";

import React, { useState } from "react";
import BasicInfo from "./step/BasicInfo";
import Ingredients from "./step/Ingredients";
import Steps from "./step/Steps";
import ImageUpload from "./step/ImageUpload";
import Confirmation from "./step/Confirmation";

import { useFoodFormStore } from "@/store/foodFormStore";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FormIngredient } from "@/types/food";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Import Clerk hook

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
  { component: BasicInfo },
  { component: Ingredients },
  { component: Steps },
  { component: ImageUpload },
  {
    component: (props) => (
      <Confirmation
        onPrev={props.onPrev}
        onSubmit={props.onSubmit || (() => Promise.resolve())}
        isLastStep={props.isLastStep}
      />
    ),
  },
];

interface FormFoodProps {
  catId: string;
  setOpen?: (open: boolean) => void;
}
const FormFood = ({ catId, setOpen }: FormFoodProps) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { data, reset } = useFoodFormStore();
  const addFoodMutation = useMutation(api.food.upsertFood);
  
  // Récupération de l'utilisateur Clerk
  const { user, isLoaded } = useUser();
  
  // Récupération de l'utilisateur Convex basé sur le clerkId
  const convexUser = useQuery(
    api.users.getUserByClerkId, 
    user?.id ? { clerkId: user.id } : "skip"
  );

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    try {
      // Vérification que l'utilisateur est connecté et récupéré
      if (!isLoaded || !user) {
        throw new Error("Utilisateur non connecté");
      }

      if (!convexUser?._id) {
        throw new Error("Utilisateur non trouvé dans la base de données");
      }

      // Vérifie les champs obligatoires
      const requiredFields = ["title", "description", "imageLink"];
      const missingFields = requiredFields.filter(
        (field) => !data[field as keyof typeof data]
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Champs manquants: ${missingFields.join(", ")}`
        );
      }

      // Filtrer les ingrédients valides
      const ingredients = data.ingredients || [];
      const validIngredients = ingredients.filter(
        (i): i is FormIngredient => !!i.ingredientId
      );

      const transformedIngredients = validIngredients.map(
        ({ ingredientId, quantity }) => ({
          ingredientId: ingredientId!,
          quantity,
        })
      );

      console.log("Données envoyées à la mutation:", {
        userId: convexUser._id,
        foodId: data._id,
        title: data.title,
        description: data.description,
        person: data.person || 1,
        categoryId: catId,
        imageStorageId: data.imageLink,
        steps: data.steps || [],
        ingredients: transformedIngredients,
      });

      // Mutation upsert avec l'ID de l'utilisateur Convex
      await addFoodMutation({
        userId: convexUser._id, // ID de l'utilisateur dans Convex
        foodId: data._id, // présent uniquement en cas d'édition
        title: data.title!,
        description: data.description!,
        person: data.person || 1,
        categoryId: catId as Id<"categories">,
        imageStorageId: data.imageLink as Id<"_storage">,
        steps: data.steps || [],
        ingredients: transformedIngredients,
      }).then(() => {
        console.log("Plat ajouté ou modifié avec succès");
        router.refresh();
        reset();
        setStep(0);
        if (setOpen) {
          setOpen(false); // Ferme le drawer après succès
        }
      });

      reset(); // Réinitialise le store
      setStep(0); // Retour au premier step
       // Rechargement
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      // Tu peux afficher une notification ici
    }
  };

  // Affichage de chargement si l'utilisateur n'est pas encore chargé
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Chargement de lutilisateur...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-red-500">Vous devez être connecté pour accéder à cette page</div>
      </div>
    );
  }

  if (!convexUser) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Synchronisation des données utilisateur...</div>
      </div>
    );
  }

  const StepComponent = steps[step].component;

  return (
    <div className="flex flex-col gap-y-5 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Add a recipe</h1>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">
            Step {step + 1} on {steps.length}
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
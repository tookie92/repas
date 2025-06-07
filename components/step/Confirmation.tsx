"use client";
import React from "react";
import { Button } from "../ui/button";
import { useFoodFormStore } from "@/store/foodFormStore";
import { ScrollArea } from "../ui/scroll-area";



// Définition des propriétés attendues par le composant
type ConfirmationProps = {
  onPrev: () => void;          // Fonction pour revenir à l'étape précédente
  onSubmit: () => Promise<void>; // Fonction asynchrone pour soumettre le formulaire
  onNext?: () => void;         // Optionnel - fonction pour passer à l'étape suivante
  isLastStep?: boolean;        // Optionnel - indique si c'est la dernière étape
  isFirstStep?: boolean;       // Optionnel - indique si c'est la première étape
};

const Confirmation = ({ onPrev, onSubmit }: ConfirmationProps) => {
  const { data } = useFoodFormStore();
 
  
  // Fonction qui gère la soumission
  const handleSubmit = async () => {
    try {
      await onSubmit();
       // On attend que la soumission se termine
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
      // Vous pourriez ajouter ici un message d'erreur pour l'utilisateur
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Please check  the informations</h2>
      
      {/* Aperçu des données du formulaire */}
      <ScrollArea className="w-full h-72 overflow-y-auto p-4 bg-white rounded-md shadow-sm">
        <pre className="bg-gray-100 p-4 rounded-md">
          {JSON.stringify(data, null, 2)}
        </pre>
      </ScrollArea>
      
      {/* Boutons de navigation */}
      <div className="flex gap-2">
        <Button onClick={onPrev} variant="outline">
          Back
        </Button>
        
        <Button onClick={handleSubmit}>
          Validate
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
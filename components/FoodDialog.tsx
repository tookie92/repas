"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormFood from "./FormFood";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect } from "react";
import { useFoodFormStore } from "@/store/foodFormStore";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Edit2Icon } from "lucide-react";

type FoodDialogProps = {
  open: boolean;
  onClose: () => void;
  foodId?: Id<"food">;
  categoryId: Id<"categories">;
};

const FoodDialog = ({ open, onClose, foodId, categoryId }: FoodDialogProps) => {
  const { setData } = useFoodFormStore();

  const food = useQuery(api.food.getFood, foodId ? { foodId } : "skip");

  useEffect(() => {
    if (food && foodId) {
      setData({
        _id: foodId,
        title: food.title,
        description: food.description,
        person: food.person,
        imageLink: food.imageLink,
        steps: food.steps,
        ingredients: food.ingredients.map((i, index) => ({
          id: String(index),
          ingredientId: i.ingredientId,
          name: "", // optionnel si déjà connu ailleurs
          quantity: i.quantity,
          unit: "", // optionnel
        })),
      });
    }
  }, [food, foodId, setData]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger >
          <Button variant="ghost" className="h-auto w-auto p-2">
            <Edit2Icon className="h-4 w-4" />
          </Button>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{foodId ? "Modifier" : "Ajouter"} un plat</DialogTitle>
        </DialogHeader>
        <FormFood catId={categoryId} />
      </DialogContent>
    </DialogTrigger>
    </Dialog>
  );
};

export default FoodDialog;

"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ingredientsSchema } from "../../lib/secschema";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useFoodFormStore } from "@/store/foodFormStore";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type IngredientsProps = {
  onNext: () => void;
  onPrev: () => void;
};

const Ingredients = ({ onNext, onPrev }: IngredientsProps) => {
  const { setData, data } = useFoodFormStore();
  
  const form = useForm<z.infer<typeof ingredientsSchema>>({
    resolver: zodResolver(ingredientsSchema),
    defaultValues: {
      ingredients: data.ingredients?.length ? data.ingredients : [{ 
        id: crypto.randomUUID(),
        ingredientId: null,
        name: "", 
        quantity: "", 
        unit: "" 
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const onSubmit = (values: z.infer<typeof ingredientsSchema>) => {
    setData(values);
    onNext();
  };

  const allIngredients = useQuery(api.ingredients.getIngredients) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-bold">Ingrédients</h2>
        
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-3">
            <h3 className="font-medium">Ingrédient {index + 1}</h3>
               
           <FormField
              control={form.control}
              name={`ingredients.${index}.ingredientId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom*</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const selectedIngredient = allIngredients.find(ing => ing._id === value);
                        field.onChange(value); // Value est toujours une string
                        form.setValue(`ingredients.${index}.name`, selectedIngredient?.name || "");
                        form.setValue(`ingredients.${index}.unit`, selectedIngredient?.unit || "");
                      }}
                      value={field.value || undefined} // Convertit "" en undefined
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez un ingrédient" />
                      </SelectTrigger>
                      <SelectContent>
                        {allIngredients.map((ingredient) => (
                          <SelectItem key={ingredient._id} value={ingredient._id}>
                            {ingredient.name} ({ingredient.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`ingredients.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="500, 2, 1/2..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`ingredients.${index}.unit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unité*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="g, ml, cuillères..." readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
              className="mt-2"
            >
              Supprimer
            </Button>
          </div>
        ))}
        
       <Button
          type="button"
          variant="outline"
          onClick={() => append({ 
            id: crypto.randomUUID(),
            ingredientId: "", // Chaîne vide au lieu de null
            name: "", 
            quantity: "", 
            unit: "" 
          })}
          className="w-full"
        >
          + Ajouter un ingrédient
        </Button>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrev}>
            Précédent
          </Button>
          <Button type="submit">
            Suivant
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Ingredients;
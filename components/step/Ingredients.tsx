"use client";
import React, { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ingredientsSchema } from "../../lib/secschema";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useFoodFormStore } from "@/store/foodFormStore";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";


type IngredientsProps = {
  onNext: () => void;
  onPrev: () => void;
};

const Ingredients = ({ onNext, onPrev }: IngredientsProps) => {
  const { setData, data } = useFoodFormStore();
  const [suggestions, setSuggestions] = useState<{_id: Id<"ingredients">, name: string, unit: string}[]>([]);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);
  
  const form = useForm<z.infer<typeof ingredientsSchema>>({
    resolver: zodResolver(ingredientsSchema),
    defaultValues: {
      ingredients: data.ingredients?.length ? data.ingredients : [{ 
        id: crypto.randomUUID(),
        ingredientId: "",
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
  const findOrCreateIngredient = useMutation(api.ingredients.findOrCreate);

  const handleNameChange = async (index: number, value: string) => {
    form.setValue(`ingredients.${index}.name`, value);
    
    if (value.length > 1) {
      const filtered = allIngredients.filter(ing => 
        ing.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    
    form.setValue(`ingredients.${index}.ingredientId`, "");
  };

  const handleSuggestionClick = async (index: number, ingredient: {_id: Id<"ingredients">, name: string, unit: string}) => {
    form.setValue(`ingredients.${index}.name`, ingredient.name);
    form.setValue(`ingredients.${index}.ingredientId`, ingredient._id);
    form.setValue(`ingredients.${index}.unit`, ingredient.unit);
    setSuggestions([]);
  };

  const handleNameBlur = async (index: number) => {
    // Petit délai pour permettre le clic sur les suggestions
    setTimeout(() => {
      const name = form.getValues(`ingredients.${index}.name`);
      const unit = form.getValues(`ingredients.${index}.unit`);
      
      if (name && unit) {
        findOrCreateIngredient({ name, unit })
          .then(ingredientId => {
            form.setValue(`ingredients.${index}.ingredientId`, ingredientId);
          })
          .catch(error => {
            console.error("Error creating ingredient:", error);
          });
      }
      setSuggestions([]);
    }, 200);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-bold">Ingredients</h2>
        
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
            <h3 className="font-medium">Ingredient {index + 1}</h3>
               
            <FormField
              control={form.control}
              name={`ingredients.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Nom de l'ingrédient"
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        onBlur={() => handleNameBlur(index)}
                        autoComplete="off"
                      />
                      {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {suggestions.map((ingredient, i) => (
                            <li
                            key={ingredient._id}
                            ref={el => { suggestionRefs.current[i] = el; }} // Juste l'affectation, pas de retour
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSuggestionClick(index, ingredient)}
                          >
                            {ingredient.name} ({ingredient.unit})
                          </li>

                          ))}
                        </ul>
                      )}
                    </div>
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
                    <FormLabel>Quantity*</FormLabel>
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
                    <FormLabel>Unit*</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="g, ml, cuillères..." 
                        onBlur={() => handleNameBlur(index)}
                      />
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
              Delete
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ 
            id: crypto.randomUUID(),
            ingredientId: "",
            name: "", 
            quantity: "", 
            unit: "" 
          })}
          className="w-full"
        >
          + Add a ingrédient
        </Button>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button type="submit">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Ingredients;
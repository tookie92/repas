"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepsSchema } from "../../lib/secschema";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useFoodFormStore } from "@/store/foodFormStore";
import { Textarea } from "../ui/textarea";

type StepsProps = {
  onNext: () => void;
  onPrev: () => void;
};

const Steps = ({ onNext, onPrev }: StepsProps) => {
  const { setData, data } = useFoodFormStore();
  
  const form = useForm<z.infer<typeof stepsSchema>>({
    resolver: zodResolver(stepsSchema),
    defaultValues: {
      steps: data.steps?.length ? data.steps : [{
        stepNumber: 1,
        instruction: ""
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const onSubmit = (values: z.infer<typeof stepsSchema>) => {
    setData(values);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-bold">Steps of the preparations</h2>
        
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Step {index + 1}</h3>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                Delete
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name={`steps.${index}.instruction`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Instruction</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe the step in details..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => append({
            stepNumber: fields.length + 1,
            instruction: ""
          })}
          className="w-full"
        >
          + Add a step
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

export default Steps;
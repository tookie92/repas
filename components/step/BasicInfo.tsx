import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicInfoSchema } from "../../lib/secschema";
import { useFoodFormStore } from "@/store/foodFormStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";

interface BasicInfoProps {
  onNext: () => void; 
}

const BasicInfo = ({ onNext }: BasicInfoProps) => {
  const { setData, data } = useFoodFormStore();
     // 1. Define your form.
  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
     defaultValues: {
    ...data,
    person: data.person || 1 // Valeur par défaut numérique
  }
  })

    function onSubmit(values: z.infer<typeof basicInfoSchema>) {
      setData(values);
      onNext();
    console.log(values)
    }
  return (
    <Form {...form} >
      <form className="flex flex-col gap-y-10" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titree</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="shadcn" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persons</FormLabel>
              <FormControl>
               <Input
                type="number"
                placeholder="2"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
       
        <Button className="mt-2" type="submit">Suivant</Button>
        </form>
    </Form>
  );
};

export default BasicInfo;
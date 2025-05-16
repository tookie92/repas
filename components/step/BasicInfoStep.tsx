// import useFoodFormStore from '@/store/foodFormStore';
import React from 'react';
import { Input } from '../ui/input';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
// import { Button } from '../ui/button';
 
const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  person: z.number().min(1).max(100),
})



const BasicInfoStep = () => {
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      person: 0,
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  // const { title, description, person, setTitle, setDescription, setPerson } = useFoodFormStore();
  
  return (
    // <div>
    //   <p className='text-myGreen mb-1'>Titre*</Text>
    //   <Input
    //     value={title}
    //     onChange={setTitle}
    //     className='bg-white p-3 rounded-lg mb-4 border border-myGreen'
    //     placeholderTextColor="#4A6741"
    //   />
      
    //   <p className='text-myGreen mb-1'>Description</Text>
    //   <TextInput
    //     value={description}
    //     onChangeText={setDescription}
    //     className='bg-white p-3 rounded-lg mb-4 border border-myGreen'
    //     placeholderTextColor="#4A6741"
    //     multiline
    //     numberOfLines={4}
    //     style={{ textAlignVertical: 'top' }}
    //   />
      
    //   <p className='text-myGreen mb-1'>Nombre de personnes*</Text>
    //   <TextInput
    //     value={person ? person.toString() : ''}
    //     onChangeText={(text) => setPerson(parseInt(text) || 0)}
    //     className='bg-white p-3 rounded-lg mb-4 border border-myGreen'
    //     placeholderTextColor="#4A6741"
    //     keyboardType="numeric"
    //   />
    // </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                <Input placeholder="description" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type='number' placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  );
};

export default BasicInfoStep;
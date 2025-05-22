"use client"

import { z } from "zod"
import { basicInfoSchema } from '@/lib/secschema'
import { zodResolver } from "@hookform/resolvers/zod"
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

const BasicInfo = () => {
     const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: "",
      description: "",
      person: 1,
    //   categoryId: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof basicInfoSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
             <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="title" {...field} />
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
                    <Textarea placeholder="description" {...field} />
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
                <FormLabel>Persons</FormLabel>
                <FormControl>
                    <input type="number" placeholder="description" {...field} />
                </FormControl>
                <FormDescription>
                    This is your public display name.
                </FormDescription>
                <FormMessage />
                </FormItem>
          )}
        />
        </form>
    </Form>
  )
}

export default BasicInfo
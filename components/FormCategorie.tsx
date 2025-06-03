import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'

const formSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
})
 

const FormCategorie = () => {
    const {user} = useUser()
    const convexUser = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : "skip")

    const addCategory = useMutation(api.categories.createCategory)
     // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })
 
  // 2. Define a submit handler.
async function onSubmit(values: z.infer<typeof formSchema>) {
  await addCategory({
    ...values,
    userId: convexUser?._id,
    imageLink: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", // URL directe valide
  });
  console.log(values);
}
  return (
    <div className='p-7'>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Title" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" className="w-full">
                Submit
            </Button>
        </form>
    </Form>
    </div>
  )
}

export default FormCategorie
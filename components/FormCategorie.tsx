import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Id } from '@/convex/_generated/dataModel';

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
});

type FormSchema = z.infer<typeof formSchema>;

type FormCategorieProps = {
  category?: {
    _id: Id<'categories'>;
    title: string;
    imageLink: string;
  };
  onSuccess?: () => void;
};

const FormCategorie = ({ category, onSuccess }: FormCategorieProps) => {
  const { user } = useUser();
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const addCategory = useMutation(api.categories.createCategory);
  const updateCategory = useMutation(api.categories.updateCategory);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: category?.title || "",
    },
  });

  // Update form values when category changes
  useEffect(() => {
    if (category) {
      form.reset({ title: category.title });
    }
  }, [category, form]);

  const onSubmit = async (values: FormSchema) => {
    try {
      if (!convexUser?._id) throw new Error("Convex user not loaded");

      if (category) {
        // 🔁 Update
        await updateCategory({
          categoryId: category._id,
          title: values.title,
          imageLink: category.imageLink,
          userId: convexUser._id,
        });
      } else {
        // ➕ Create
        await addCategory({
          ...values,
          userId: convexUser._id,
          imageLink: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        });
      }

      if (onSuccess) onSuccess(); // callback pour fermer le drawer par ex.
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="p-7">
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
            {category ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormCategorie;

"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { imageSchema } from "../../lib/secschema";
import { Button } from "../ui/button";
import { useFoodFormStore } from "@/store/foodFormStore";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
// import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";

type ImageUploadProps = {
  onNext: () => void;
  onPrev: () => void;
};

const ImageUpload = ({ onNext, onPrev }: ImageUploadProps) => {
  // const { toast } = useToast();
  const { setData, data } = useFoodFormStore();
  const generateUploadUrl = useMutation(api.food.generateUploadUrl);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      imageLink: data.imageLink || null
    }
  });

  const onSubmit = async (values: z.infer<typeof imageSchema>) => {
    try {
      setIsUploading(true);
      
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      
      // Step 2: Upload the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": values.imageLink!.type },
        body: values.imageLink,
      });

      if (!result.ok) throw new Error("Upload failed");
      
      const { storageId } = await result.json();
      
      // Step 3: Save the newly allocated storage id to the form data
      setData({ imageLink: storageId });
      onNext();
      
    } catch (error) {
      // toast({
      //   title: "Erreur d'upload",
      //   description: "L'image n'a pas pu être téléchargée",
      //   variant: "destructive",
      // });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="imageLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image du plat</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                      }
                    }}
                  />
                  {field.value && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Fichier sélectionné: {(field.value as File).name}
                      </p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrev}
            disabled={isUploading}
          >
            Précédent
          </Button>
          <Button 
            type="submit" 
            disabled={!form.watch("imageLink") || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Suivant"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ImageUpload;
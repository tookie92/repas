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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type ImageUploadProps = {
  onNext: () => void;
  onPrev: () => void;
};

const ImageUpload = ({ onNext, onPrev }: ImageUploadProps) => {
  const { setData, data } = useFoodFormStore();
  const generateUploadUrl = useMutation(api.food.generateUploadUrl);
  const getImageUrl = useQuery(api.food.getImageUrl, 
    data.imageLink ? { storageId: data.imageLink } : "skip");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Valeur par défaut correctement typée
  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      imageLink: null
    }
  });

  const onSubmit = async (values: z.infer<typeof imageSchema>) => {
    try {
      setIsUploading(true);
      
      // Si aucun nouveau fichier n'est sélectionné, on garde l'image existante
      if (!values.imageLink && data.imageLink) {
        onNext();
        return;
      }

      // Si un nouveau fichier est sélectionné
      if (values.imageLink instanceof File) {
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();
        
        // Step 2: Upload the file to the URL
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": values.imageLink.type },
          body: values.imageLink,
        });

        if (!result.ok) throw new Error("Upload failed");
        
        const { storageId } = await result.json();
        
        // Step 3: Save the newly allocated storage id to the form data
        setData({ imageLink: storageId });
      }
      
      onNext();
      
    } catch (error) {
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
                  {/* Afficher l'image actuelle si elle existe */}
                  {data.imageLink && getImageUrl && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl}
                        alt="Image actuelle du plat"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <p className="text-white font-medium">
                          Image actuelle
                        </p>
                      </div>
                    </div>
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        field.onChange(file);
                      } else {
                        // Réinitialiser à null si aucun fichier n'est sélectionné
                        field.onChange(null);
                      }
                    }}
                  />
                  {selectedFile ? (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Nouveau fichier sélectionné: {selectedFile.name}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {data.imageLink 
                          ? "Aucun nouveau fichier sélectionné. L'image actuelle sera conservée." 
                          : "Aucune image sélectionnée"}
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
            disabled={isUploading}
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
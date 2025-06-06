"use client";
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react';
import FoodCard from './FoodCard';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { Card, CardContent } from './ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import FormCategorie from './FormCategorie';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';

const MesCategories = () => {
  const categories = useQuery(api.categories.getCategories);
  const deleteCategory = useMutation(api.categories.deleteCategory);
  const { user } = useUser();
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    _id: Id<"categories">;
    title: string;
    imageLink: string;
  } | null>(null);



  const monuserId = convexUser?._id;

  const handleDelete = async (categoryId: Id<"categories">) => {
    const confirmed = confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      await deleteCategory({ categoryId, userId: monuserId });
    } catch (error) {
      alert(error ?? "Erreur inconnue lors de la suppression");
    }
  };

  const openEditDrawer = (category: typeof editingCategory) => {
    setEditingCategory(category);
    setDrawerOpen(true);
  };

  const openCreateDrawer = () => {
    setEditingCategory(null); // Pas de catégorie → on est en création
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCategory(null);
  };

  return (
    <>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        {categories?.length === 0 ? (
          <Card className="w-full h-[300px] mt-28 px-3 flex cursor-pointer bg-myYellow border-none">
            <DrawerTrigger asChild>
              <CardContent className="flex text-white font-bold h-full items-center justify-center">
                Add your first category
              </CardContent>
            </DrawerTrigger>
            <DrawerContent>
              <FormCategorie category={editingCategory!} onSuccess={closeDrawer} />
            </DrawerContent>
          </Card>
        ) : (
          <div className="flex mt-24 w-full h-[400px] px-3">
            <Carousel opts={{ align: "start" }} className="w-full h-full">
              <CarouselContent>
                <CarouselItem className="basis-1/3">
                  <Card
                    onClick={openCreateDrawer}
                    className="w-full h-full px-3 flex cursor-pointer items-center justify-center bg-myYellow/10 border border-dashed border-white/20 hover:border-myYellow"
                  >
                    <CardContent className="flex text-xs text-white font-bold h-full items-center justify-center">
                      + Add a category
                    </CardContent>
                  </Card>
                </CarouselItem>
                {categories?.map((category, index) => (
                  <CarouselItem key={index} className="basis-3/3">
                    <FoodCard
                      image={category.imageLink}
                      title={category.title}
                      onEdit={() =>
                        openEditDrawer({
                          _id: category._id,
                          title: category.title,
                          imageLink: category.imageLink,
                        })
                      }
                      link={`/categories/${category._id}`}
                      onDelete={() => handleDelete(category._id)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}

        {/* Drawer Formulaire (éditable ou création) */}
        <DrawerContent>
          <FormCategorie category={editingCategory ?? undefined} onSuccess={closeDrawer} />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MesCategories;

"use client";
import { Header } from "@/components/Header";
import MesCategories from "@/components/MesCategories";

export default function Home() {
  return (
    <div className="lg:hidden relative w-full h-screen flex flex-col">
     <Header />
     <div className='flex flex-col gap-y-3 mt-20'>
        <p className=' font-bold text-4xl text-beige text-center'>
          Classic Recipes and Fresh Takes, made for you
        </p>
        <p className=' font-sans text-xl  text-beige text-center'>
          Try our ready in minute frozen meals
        </p>
      </div>
      <div className="px-8 mt-7">
        <MesCategories />
      </div>
    </div>
  );
}

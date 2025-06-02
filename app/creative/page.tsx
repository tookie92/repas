"use client";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
  
import { Input } from "@/components/ui/input";

export default function CreativePage() {
  return (
    <div className="lg:hidden bg-myRed relative items-center justify-center w-full min-h-screen flex flex-col pt-12">
      <Header login/>
     <div className='flex flex-col gap-y-3 items-center justify-center '>
        <p className=' font-bold text-3xl text-beige text-center'>
          Classic  made for you
        </p>
        <p className=' font-sans text-xl  text-beige text-center'>
          Try our ready in minute frozen meals
        </p>
      </div>
      <div className="px-8 flex flex-col gap-y-3 mt-7">
        <Input placeholder="Rechercher un plat" className="bg-white" />
      </div>
      <Footer />
    </div>
  );
}
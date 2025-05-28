"use client";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import MesCategories from "@/components/MesCategories";

export default function Home() {
  return (
    <div className="lg:hidden bg-myRed relative   w-full min-h-screen flex flex-col py-24">
      <Header />
      <div className="px-8 flex flex-col gap-y-3 ">
      <div className='flex flex-col gap-y-3 items-center justify-center '>
          <p className=' font-bold text-3xl text-beige text-center'>
            Classic  made for you
          </p>
          <p className=' font-sans text-xl  text-beige text-center'>
            Try our ready in minute frozen meals
          </p>
        </div>
        <div className="flex flex-col gap-y-3 mt-7">
          <MesCategories />
          {/* <FoodCard/> */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

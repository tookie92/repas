"use client";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import MesCategories from "@/components/MesCategories";



export default function Home() {
  return (
    <div className="lg:hidden bg-myRed relative   w-full min-h-screen flex flex-col py-24">
      <Header login />
      <div className=" relative px-8 flex flex-col gap-y-3 h-full w-full  ">
        {/* title principal */}
        <div className='flex flex-col gap-y-3 items-center justify-center '>
          <p className=' font-bold text-3xl text-beige text-center'>
            Classic  made for you
          </p> 
        </div>
        {/* Liste des categories */}
        
          <MesCategories />
          {/* <FoodCard/> */}
      </div>
      <Footer />
    </div>
  );
}

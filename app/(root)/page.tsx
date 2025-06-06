"use client";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import MesCategories from "@/components/MesCategories";
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { useRef } from "react";
import Rive from '@rive-app/react-canvas';



gsap.registerPlugin(useGSAP);


export default function Home() {
  const container= useRef<HTMLDivElement>(null);
   const remoteRiveUrl =
    "https://raw.githubusercontent.com/tookie92/riveassets/main/assets/tendance.riv";

  useGSAP(() => {
    if (container.current) {
      gsap.to(container.current,  { yPercent: -100, duration: 1, ease: "slow(0.7,0.7,false)", delay:6});
    }
  }, [container]);
  return (
    <div className="lg:hidden bg-myRed relative   w-full min-h-screen flex flex-col py-24">
      <Header login />
      <div ref={container} className="absolute top-0 left-0 w-full h-full bg-myRed to-transparent z-50">
        <Rive
          src={remoteRiveUrl}
          stateMachines="State Machine 1"
          artboard="Artboard"
        />
      </div>
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

"use client";
import Rive from '@rive-app/react-canvas';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(useGSAP);


export default function Home() {
  const router = useRouter();


const container = useRef<HTMLDivElement>(null);

useGSAP(() => {
    if (container.current) {
      gsap.to(
        container.current,
        { yPercent: -100, duration: 1, ease: "power1.inOut", delay: 6.5 },
        
      );
    }
  });

  // Redirect to /bienvenue after 6.9 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/bienvenue");
    }, 6900);
    return () => clearTimeout(timer);
  },);
  
   const remoteRiveUrl =
    "https://raw.githubusercontent.com/tookie92/riveassets/main/assets/tendance.riv";

 
  return (
    <div className="lg:hidden bg-myRed relative   w-full min-h-screen flex flex-col py-24">
     
      <div ref={container} className="absolute top-0 left-0 w-full h-full bg-myRed to-transparent z-50">
        <Rive
          src={remoteRiveUrl}
          stateMachines="State Machine 1"
          artboard="Artboard"
          shouldResizeCanvasToContainer={true}
        />
      </div>
      
    </div>
  );
}

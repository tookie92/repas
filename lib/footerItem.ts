import { HouseIcon,  LucideProps } from "lucide-react"
import React from "react"

type FooterProps={
    name: string,
    link: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}


export const footerItem : FooterProps[] = [
    {
    name: "Accueil",
    link: "/bienvenue",
    icon: HouseIcon,
  },
    {
    name: "creative",
    link: "/creative",
    icon: HouseIcon,
  },
]
 

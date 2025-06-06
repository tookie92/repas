"use client";
import { useState, useEffect } from "react";

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Image from "next/image";

interface FoodImageProps {
  storageId: Id<'_storage'> | null;
  className?: string;
  width?: number;
  height?: number;
}

export const FoodImage = ({ storageId, className, width, height }: FoodImageProps) => {
  const [error, setError] = useState(false);
  const imageUrl = useQuery(api.food.getImageUrl, storageId ? { storageId } : 'skip');

  useEffect(() => {
    setError(false); // Reset error when image changes
  }, [storageId]);

  if (!storageId || !imageUrl) {
    return (
      <Image
        width={width || 80}
        height={height || 80}
        alt="Placeholder Image"
        src={"/placeholder-image.jpg"}
        className={className}
      />
    );
  }

  return (
    <Image
        width={width || 80}
        height={height || 80}
        alt="Placeholder Image"
        src={error?"/placeholder-image.jpg":imageUrl}
        className={className}
        onError={() => setError(true)}
        
    />
   
  );
};
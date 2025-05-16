import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function ImageStep() {
  const { register, watch } = useFormContext();
  const image = watch("image");

  return (
    <div>
      <h3>Image de la recette</h3>
      <Input
        type="file"
        accept="image/*"
        {...register("image")}
      />
      {image && (
        <Image
          src={URL.createObjectURL(image[0])}
          alt="Preview"
          className="w-40 h-40 object-cover"
          width={400}
          height={400}
        />
      )}
    </div>
  );
}
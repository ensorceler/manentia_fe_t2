"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/Card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const ProductCard = ({ id, title, description, imageUrl }: Props) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => {
        router.push(`/products/${id}`);
      }}
      className="rounded-xl max-w-xs active:scale-[98%] cursor-pointer"
    >
      <CardHeader className="relative h-48 mb-3">
        <Image
          src={imageUrl}
          fill
          alt={`image_${id}`}
          className="rounded-t-xl"
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

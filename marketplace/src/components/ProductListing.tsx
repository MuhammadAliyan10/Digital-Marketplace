import { Product } from "@/trpc/payloadTypes";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatePrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config/Index";
import ImageSlider from "./ImageSlider";

interface ProductListingProps {
  product: Product | null;
  index: number;
}
const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);
    return () => clearTimeout(timer);
  }, [index]);
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product?.category
  )?.label;
  const ProductPlaceHolder = () => {
    return (
      <div className="flex flex-col w-full">
        <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
          <Skeleton className="h-full w-full" />
        </div>
        <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
        <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
        <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
      </div>
    );
  };
  if (!product || !isVisible) {
    return <ProductPlaceHolder />;
  }
  if (isVisible && product) {
    return (
      <Link
        className={cn("invisible w-full h-full group/main cursor-pointer", {
          "visible animate-in fade-in-5": isVisible,
        })}
        href={`/products/${product.id}`}
      >
        <div className="flex flex-col w-full">
          <ImageSlider urls={[]} />
          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          <p className="mt-1 font-medium text-sm text-gray-900">
            {formatePrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }

  return <div></div>;
};

export default ProductListing;

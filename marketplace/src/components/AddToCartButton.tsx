"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/Hooks/useCart";
import { Product } from "@/trpc/payloadTypes";

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
    return () => clearTimeout(timeOut);
  }, [isSuccess]);
  return (
    <Button
      onClick={() => {
        setIsSuccess(true);
        addItem(product);
      }}
      size="lg"
      className="w-full"
    >
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;

"use client";
import { useCart } from "@/Hooks/useCart";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/config/Index";
import { cn, formatePrice } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = () => {
  const { items, removeItem } = useCart();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  );
  const fee = 1;

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Shopping Cart
      </h1>
      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <div
          className={cn("lg:col-span-7", {
            "rounded-lg border-2 border-dashed border-zinc-200 p-12":
              items.length === 0,
          })}
        >
          <h2 className="sr-only">Items in your shopping cart</h2>
          {isMounted && items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-1">
              <div
                className="relative mb-4 h-40 w-40 text-muted-foreground"
                aria-hidden="true"
              >
                <Image
                  src="/hippo-empty-cart.png"
                  fill
                  loading="eager"
                  alt="Empty shopping cart hippo"
                />
              </div>
              <h3 className="font-semibold text-2xl">Your cart is empty</h3>
              <p className="text-muted-foreground text-center">
                Whoops! Nothing to show here yet.
              </p>
            </div>
          ) : null}
          <ul
            className={cn({
              "divide-y divide-gray-200 border-b border-gray-200":
                isMounted && items.length > 0,
            })}
          >
            {isMounted &&
              items.map(({ product }) => {
                const label = PRODUCT_CATEGORIES.find(
                  (c) => c.value === product.category
                )?.label;
                const { image } = product.images[0];
                return (
                  <li className="flex py-6 sm:py-10" key={product.id}>
                    <div className="flex shrink-0">
                      <div className="relative h-24 w-24">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            src={image.url}
                            fill
                            className="object-cover h-full w-full rounded-md object-center sm:h-48 sm:w-48"
                            alt={product.name}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 ml-4 justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`/product/${product.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-muted-foreground">
                              Category: {label}
                            </p>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatePrice(product.price)}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                          <div className="absolute top-0 right-0">
                            <Button
                              aria-label="remove product"
                              onClick={() => removeItem(product.id)}
                              variant={"ghost"}
                            >
                              <X className="h-5 w-5" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Eligible for instant delivery</span>
                      </p>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-gray-900 font-medium text-sm">
                {isMounted ? (
                  formatePrice(cartTotal)
                ) : (
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                )}
              </p>
            </div>
            <div className="flex items-center justify-between border-gray-400 border-t pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Flat Transaction Fee</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {isMounted ? (
                  formatePrice(fee)
                ) : (
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-base font-medium text-gray-900">
                Order Total
              </div>
              <div className="font-medium text-base text-gray-900">
                {isMounted ? (
                  formatePrice(cartTotal + fee)
                ) : (
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                )}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="w-full " size={"lg"}>
              Checkout
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;

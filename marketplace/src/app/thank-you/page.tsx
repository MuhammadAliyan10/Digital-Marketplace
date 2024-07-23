import { getServerSideUser } from "@/lib/payload-utils";
import Image from "next/image";
import React from "react";
import { cookies } from "next/headers";
import { getPayloadClient } from "@/getPayload";
import { notFound, redirect } from "next/navigation";
import { Product, ProductFile, User } from "@/trpc/payloadTypes";
import { PRODUCT_CATEGORIES } from "@/config/Index";
import { formatePrice } from "@/lib/utils";
import Link from "next/link";
import PaymentStatus from "@/components/PaymentStatus";
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
const Page = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId;
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);
  const payload = await getPayloadClient();
  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });
  const [order] = orders;
  if (!order) {
    return notFound();
  }
  const products = order.products as Product[];
  const totalPrice = products.reduce(
    (totalPrice, { price }) => totalPrice + price,
    0
  );
  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;
  if (orderUserId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${orderId}`);
  }
  return (
    <div className="relative lg:min-h-full">
      <div className=" hidden lg:block h-80 sm:block overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          alt="Thank you"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-x-2 lg:max-w-7xl lg:px-8 lg:py-32 xl:gap-x-24">
        <div className="lg:col-start-2">
          <p className="text-sm font-medium text-blue-600">Order successful</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Thanks for ordering
          </h1>
          {order._isPaid ? (
            <p className="mt-2 text-base text-muted-foreground">
              Your order was processed and you assets are available to download
              blow. We&apos;ve send your receipt and order details to{" "}
              {typeof order.user !== "string" && (
                <span className="font-medium text-gray-900">
                  {order.user.email}
                </span>
              )}
            </p>
          ) : (
            <p className="mt-2 text-base text-muted-foreground">
              We appreciate your order, and we&apos;re currently processing it.
              So hang tight and we&apos;ll send you confirmation very soon!
            </p>
          )}
          <PaymentStatus
            orderEmail={(order.user as User).email}
            isPaid={order._isPaid}
            orderId={order.id}
          />
          <div className="mt-16 text-sm font-medium">
            <div className="text-muted-foreground">Order nr.</div>
            <div className="mt-2 text-gray-900">{order.id}</div>
            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
              {(order.products as Product[]).map((product) => {
                const label = PRODUCT_CATEGORIES.find(
                  (c) => c.value === product.category
                )?.label;
                const downloadUrl = (product.product_files as ProductFile)
                  .url as string;
                const { image } = product.images[0];
                return (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="relative h-24 w-24">
                      {typeof image !== "string" && image.url && (
                        <Image
                          src={image.url}
                          fill
                          alt={`${product.name} image`}
                          className="flex-none rounded-md object-cover object-center bg-gray-100"
                        />
                      )}
                    </div>
                    <div className="flex-auto flex flex-col justify-between">
                      <div className="space-y-1 ">
                        <h3 className="text-gray-900">{product.name}</h3>
                        <p className="my-1">Category : {label}</p>
                      </div>
                      {order._isPaid ? (
                        <a
                          href={downloadUrl}
                          download={product.name}
                          className="text-blue-900 hover:underline underline-offset-2"
                        >
                          Download Assets
                        </a>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <p className="flex-none font-medium text-gray-900">
                      {formatePrice(product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm text-muted-foreground font-medium">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="text-gray-900">{formatePrice(totalPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>Transaction Fee</p>
                <p className="text-gray-900">{formatePrice(1)}</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <p className="text-base">Total</p>
                <p className="text-base">{formatePrice(totalPrice + 1)} </p>
              </div>
            </div>
            <div className="mt-16 border-t border-gray-200 text-right py-6">
              <Link
                href={"/products"}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Continue Shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

"use client";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
interface PaymentStatusProps {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
}

const PaymentStatus = ({ orderEmail, orderId, isPaid }: PaymentStatusProps) => {
  const router = useRouter();
  const { data } = trpc.payment.pollOrderStatus.useQuery(
    {
      orderId,
    },
    {
      enabled: isPaid === false,
      refetchInterval: (data) => (data?.isPaid ? false : 1000),
    }
  );

  useEffect(() => {
    if (data?.isPaid) router.refresh();
  }, [data?.isPaid, router]);
  return (
    <div className="mt-16 gird grid-cols-2 gap-x-4 text-sm text-gray-600">
      <div>
        <p className="font-medium text-gray-900">Shipping to</p>
        <p>{orderEmail}</p>
      </div>
      <div>
        <p className="font-medium text-gray-900 mt-2">Order status</p>
        <p>{isPaid ? "Payment successful" : "Payment pending.."}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;

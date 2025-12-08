"use client";

import { useSearchParams } from "next/navigation";
import OrderSuccess from "@/components/OrderSuccess";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const arrivalDate = searchParams.get("arrivalDate") ?? "";

  if (!orderId) {
    return (
      <main className="flex flex-col min-h-screen" role="main" aria-label="Order success page">
        <div className="flex-1 p-4">
          <div role="alert" aria-live="assertive" className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h1 className="text-xl font-semibold text-red-800 mb-2">Order Information Not Available</h1>
            <p className="text-red-700">No order information available. Please check your order history or contact support.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen" role="main" aria-label="Order success page">
      <div className="flex-1 p-4">
        <OrderSuccess orderId={orderId} arrivalDate={arrivalDate} />
      </div>
    </main>
  );
}

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
          <div role="alert" aria-live="assertive">
            <p className="p-4">No order information available.</p>
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

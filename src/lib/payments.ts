"use client";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (data: Record<string, unknown>) => void) => void;
    };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load payment gateway."));
    document.body.appendChild(script);
  });
}

export async function startPayment(bookingId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const orderRes = await fetch("/api/payment/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId }),
  });
  const orderData = await orderRes.json();
  if (!orderRes.ok) throw new Error(orderData.error || "Could not start payment.");

  await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!window.Razorpay) throw new Error("Payment gateway failed to load.");

  return new Promise((resolve) => {
    const rzp = new window.Razorpay!({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "CheckMyPhone",
      description: `Phone Inspection · ${orderData.receipt || ""}`,
      order_id: orderData.orderId,
      prefill: orderData.prefill,
      theme: { color: "#D97706" },
      handler: async (response: Record<string, unknown>) => {
        try {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");
          resolve({ success: true });
        } catch (err) {
          resolve({ success: false, error: err instanceof Error ? err.message : "Verification failed" });
        }
      },
      modal: {
        ondismiss: () => resolve({ success: false, error: "Payment was cancelled." }),
      },
    });
    rzp.open();
  });
}

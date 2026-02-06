"use client";

import { useEffect, useRef, useState } from "react";
import type { Order } from "@/types/schema";

const DOORBELL_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4a3f63d179.mp3?filename=doorbell-100549.mp3";

interface OrderAlertProps {
  orders: Order[];
}

export function OrderAlert({ orders }: OrderAlertProps) {
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [activeAlert, setActiveAlert] = useState<Order | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!alertsEnabled) {
      return;
    }
    const pendingOrder = orders.find(
      (order) => order.status?.toLowerCase() === "pending"
    );
    if (pendingOrder) {
      setActiveAlert(pendingOrder);
    }
  }, [alertsEnabled, orders]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(DOORBELL_URL);
      audioRef.current.loop = true;
    }
    if (activeAlert && alertsEnabled) {
      audioRef.current.play().catch(() => undefined);
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [activeAlert, alertsEnabled]);

  const acknowledgeAlert = () => {
    setActiveAlert(null);
  };

  return (
    <div className="rounded-2xl border border-brand-gold/40 bg-brand-cream p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-maroon">
            Admin order alerts
          </p>
          <p className="text-xs text-brand-maroon/70">
            Enable alerts to hear new pending orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAlertsEnabled(true)}
            className="rounded-full bg-brand-maroon px-4 py-2 text-xs font-semibold text-brand-cream"
          >
            Enable Alerts
          </button>
          <button
            type="button"
            onClick={acknowledgeAlert}
            className="rounded-full border border-brand-maroon px-4 py-2 text-xs font-semibold text-brand-maroon"
          >
            Acknowledge
          </button>
        </div>
      </div>
      {activeAlert ? (
        <p className="mt-3 text-sm text-brand-maroon">
          New pending order received.
        </p>
      ) : (
        <p className="mt-3 text-sm text-brand-maroon/70">
          No pending alerts right now.
        </p>
      )}
    </div>
  );
}

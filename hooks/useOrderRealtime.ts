"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/api";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Browser Notification helpers
// ---------------------------------------------------------------------------

function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isNotificationSupported()) return "unsupported";
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return "unsupported";
  }
}

function sendOrderNotification(orderId: string, status: string): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== "granted") return;

  // Only send when the user is not actively viewing the page
  if (typeof document !== "undefined" && !document.hidden) return;

  const shortId = orderId.length > 8 ? orderId.slice(0, 8) : orderId;

  try {
    new Notification("Order Update", {
      body: `Your order #${shortId} is now: ${status}`,
      icon: "/favicon.ico",
      tag: `order-${orderId}`, // Prevent duplicate notifications for the same order
    });
  } catch {
    // Notification constructor can throw in some environments (e.g. SSR, service workers)
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseOrderRealtimeOptions {
  /** Callback fired whenever the order status changes via realtime */
  onStatusChange?: (newStatus: string, payload: Record<string, unknown>) => void;
  /** Whether to request and use browser push notifications. Defaults to true. */
  enableNotifications?: boolean;
}

interface UseOrderRealtimeReturn {
  /** True once the Supabase Realtime channel is actively subscribed */
  isSubscribed: boolean;
  /** Current browser notification permission state, or 'unsupported' */
  notificationPermission: NotificationPermission | "unsupported";
  /** Manually request notification permission from the user */
  requestPermission: () => Promise<void>;
}

export function useOrderRealtime(
  orderId: string,
  options?: UseOrderRealtimeOptions
): UseOrderRealtimeReturn {
  const { onStatusChange, enableNotifications = true } = options ?? {};

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >(() => {
    if (!isNotificationSupported()) return "unsupported";
    return Notification.permission;
  });

  // Keep a stable ref to the callback so the channel listener always
  // invokes the latest version without re-subscribing.
  const onStatusChangeRef = useRef(onStatusChange);
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  const channelRef = useRef<RealtimeChannel | null>(null);

  // ---- Supabase Realtime subscription ----
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newRow = payload.new as Record<string, unknown>;
          const newStatus = (newRow.status as string) ?? "";

          // Fire the consumer callback
          onStatusChangeRef.current?.(newStatus, newRow);

          // Send a browser notification if enabled
          if (enableNotifications) {
            sendOrderNotification(orderId, newStatus);
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
      setIsSubscribed(false);
    };
  }, [orderId, enableNotifications]);

  // ---- Permission request helper ----
  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setNotificationPermission(result);
  }, []);

  // Sync permission if it changes externally (e.g. user revokes in browser settings)
  useEffect(() => {
    if (!isNotificationSupported()) return;

    // The Permissions API lets us watch for changes
    let cleanup: (() => void) | undefined;

    navigator.permissions
      ?.query({ name: "notifications" as PermissionName })
      .then((permStatus) => {
        const onChange = () => {
          setNotificationPermission(Notification.permission);
        };
        permStatus.addEventListener("change", onChange);
        cleanup = () => permStatus.removeEventListener("change", onChange);
      })
      .catch(() => {
        // Permissions API not available – fall back to no watching
      });

    return () => cleanup?.();
  }, []);

  return {
    isSubscribed,
    notificationPermission,
    requestPermission,
  };
}

import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";

const TOAST_DURATION_MS = 3000;

export const Toasts = () => {
  const toasts = useGameStore((state) => state.toasts);
  const removeToast = useGameStore((state) => state.removeToast);

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), TOAST_DURATION_MS)
    );
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-xl border border-coffee-200 bg-white/95 px-4 py-3 text-sm shadow-md"
        >
          <p className="font-medium text-coffee-700">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};

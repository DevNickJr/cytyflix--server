import cron from "node-cron";

// Lazy imports to avoid circular dependency issues at startup
let bookingServiceRef: { autoRelease: () => Promise<{ processed: number }> } | null = null;
let rentPaymentServiceRef: { autoRelease: () => Promise<{ processed: number }> } | null = null;

export function initializeScheduler() {
  // Import lazily after all modules are initialized
  const { bookingService } = require("@/modules/bookings/booking.module");
  const { rentPaymentService } = require("@/modules/rent-payments/rent-payment.module");
  bookingServiceRef = bookingService;
  rentPaymentServiceRef = rentPaymentService;

  // Run booking auto-release every hour
  cron.schedule("0 * * * *", async () => {
    try {
      const result = await bookingServiceRef!.autoRelease();
      if (result.processed > 0) {
        console.log(`[Cron] Booking auto-release: ${result.processed} bookings processed`);
      }
    } catch (error) {
      console.error("[Cron] Booking auto-release failed:", error);
    }
  });

  // Run rent payment auto-release every hour
  cron.schedule("30 * * * *", async () => {
    try {
      const result = await rentPaymentServiceRef!.autoRelease();
      if (result.processed > 0) {
        console.log(`[Cron] Rent payment auto-release: ${result.processed} payments processed`);
      }
    } catch (error) {
      console.error("[Cron] Rent payment auto-release failed:", error);
    }
  });

  console.log("Cron scheduler initialized.");
}

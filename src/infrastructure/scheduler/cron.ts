import cron from 'node-cron';
import { bookingService } from '@/modules/bookings/booking.module';
import { rentPaymentService } from '@/modules/rent-payments/rent-payment.module';
// Lazy imports to avoid circular dependency issues at startup
export function initializeScheduler() {
  // Run booking auto-release every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await bookingService.autoRelease();
      if (result.processed > 0) {
        console.log(
          `[Cron] Booking auto-release: ${result.processed} bookings processed`
        );
      }
    } catch (error) {
      console.error('[Cron] Booking auto-release failed:', error);
    }
  });

  // Run rent payment auto-release every hour
  cron.schedule('30 * * * *', async () => {
    try {
      const result = await rentPaymentService.autoRelease();
      if (result.processed > 0) {
        console.log(
          `[Cron] Rent payment auto-release: ${result.processed} payments processed`
        );
      }
    } catch (error) {
      console.error('[Cron] Rent payment auto-release failed:', error);
    }
  });

  console.log('Cron scheduler initialized.');
}

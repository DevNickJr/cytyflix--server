interface CalendarEventData {
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  startTime: string; // "HH:mm" or "10:00 AM" format
  durationMinutes?: number;
}

function parseStartDateTime(date: Date, time: string): Date {
  const d = new Date(date);
  // Try parsing "HH:mm" format
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    d.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
    return d;
  }
  // Try parsing "10:00 AM" format
  const ampmMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const period = ampmMatch[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    d.setHours(hours, minutes, 0, 0);
    return d;
  }
  // Fallback: set to noon
  d.setHours(12, 0, 0, 0);
  return d;
}

function formatDateUTC(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

export function generateGoogleCalendarLink(data: CalendarEventData): string {
  const start = parseStartDateTime(data.startDate, data.startTime);
  const end = new Date(
    start.getTime() + (data.durationMinutes || 60) * 60 * 1000
  );

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: data.title,
    dates: `${formatDateUTC(start)}/${formatDateUTC(end)}`,
    details: data.description,
  });
  if (data.location) params.set('location', data.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookCalendarLink(data: CalendarEventData): string {
  const start = parseStartDateTime(data.startDate, data.startTime);
  const end = new Date(
    start.getTime() + (data.durationMinutes || 60) * 60 * 1000
  );

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: data.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: data.description,
  });
  if (data.location) params.set('location', data.location);

  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}

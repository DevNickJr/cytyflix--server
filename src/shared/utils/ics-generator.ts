interface ICSEventData {
  uid: string;
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  startTime: string;
  durationMinutes?: number;
  organizerName?: string;
  organizerEmail?: string;
}

function parseStartDateTime(date: Date, time: string): Date {
  const d = new Date(date);
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    d.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
    return d;
  }
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
  d.setHours(12, 0, 0, 0);
  return d;
}

function formatICSDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function generateICSContent(data: ICSEventData): string {
  const start = parseStartDateTime(data.startDate, data.startTime);
  const end = new Date(
    start.getTime() + (data.durationMinutes || 60) * 60 * 1000
  );

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CytyFlix//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${data.uid}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${escapeICSText(data.title)}`,
    `DESCRIPTION:${escapeICSText(data.description)}`,
  ];

  if (data.location) {
    lines.push(`LOCATION:${escapeICSText(data.location)}`);
  }

  if (data.organizerName && data.organizerEmail) {
    lines.push(
      `ORGANIZER;CN=${escapeICSText(data.organizerName)}:mailto:${data.organizerEmail}`
    );
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

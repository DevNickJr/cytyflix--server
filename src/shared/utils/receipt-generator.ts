import PDFDocument from 'pdfkit';

interface ReceiptData {
  bookingReference: string;
  clientName: string;
  agentName: string;
  amount: number;
  scheduledDate: Date;
  scheduledTime: string;
  paymentDate: Date;
  propertyTitle?: string;
}

// 1. Mark the main generator function as async
export async function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Buffer[] = [];

  // 2. Set up synchronous stream collectors
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  // 3. Create a clean promise wrapper just for the stream finalization
  const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  // 4. You can now use your `await` calls safely here at the top level of the function
  // (e.g., if you are fetching assets or external resources on lines 107 / 143)

  // --- Header ---
  doc
    .fontSize(24)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('CytyFlix', { align: 'center' });
  doc
    .fontSize(10)
    .font('Helvetica')
    .text('Property Discovery Platform', { align: 'center' });
  doc.moveDown(0.5);

  // --- Line separator ---
  let currentY = doc.y;
  doc.moveTo(50, currentY).lineTo(545, currentY).stroke('#e5e7eb');
  doc.y = currentY + 15;

  // --- Title ---
  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('Payment Receipt', { align: 'center' });
  doc.moveDown(1);

  const labelX = 50;
  const valueX = 250;

  const drawRow = (label: string, value: string) => {
    const y = doc.y;
    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#666666')
      .text(label, labelX, y);
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text(value, valueX, y);
    doc.moveDown(0.5);
  };

  drawRow('Reference:', data.bookingReference);
  drawRow(
    'Payment Date:',
    data.paymentDate.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );
  drawRow('Amount:', `NGN ${data.amount.toLocaleString()}`);

  doc.moveDown(0.5);
  currentY = doc.y;
  doc.moveTo(50, currentY).lineTo(545, currentY).stroke('#e5e7eb');
  doc.y = currentY + 15;

  drawRow('Client:', data.clientName);
  drawRow('Agent:', data.agentName);
  if (data.propertyTitle) {
    drawRow('Property:', data.propertyTitle);
  }

  doc.moveDown(0.5);
  currentY = doc.y;
  doc.moveTo(50, currentY).lineTo(545, currentY).stroke('#e5e7eb');
  doc.y = currentY + 15;

  drawRow(
    'Scheduled Date:',
    data.scheduledDate.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );
  drawRow('Scheduled Time:', data.scheduledTime);

  doc.moveDown(2);

  // --- Footer ---
  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#999999')
    .text(
      'This is an electronically generated receipt and does not require a signature.',
      { align: 'center' }
    );
  doc.moveDown(0.3);
  doc.text(
    `Generated on ${new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    { align: 'center' }
  );

  // 5. Close the write stream layout
  doc.end();

  // 6. Return the finalized promise execution buffer
  return pdfBufferPromise;
}

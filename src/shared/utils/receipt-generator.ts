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

export function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('CytyFlix', { align: 'center' });
    doc
      .fontSize(10)
      .font('Helvetica')
      .text('Property Discovery Platform', { align: 'center' });
    doc.moveDown(0.5);

    // Line separator
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#e5e7eb');
    doc.moveDown(0.5);

    // Title
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Payment Receipt', { align: 'center' });
    doc.moveDown(1);

    // Receipt details
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
      doc.moveDown(0.3);
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
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#e5e7eb');
    doc.moveDown(0.5);

    drawRow('Client:', data.clientName);
    drawRow('Agent:', data.agentName);
    if (data.propertyTitle) {
      drawRow('Property:', data.propertyTitle);
    }

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#e5e7eb');
    doc.moveDown(0.5);

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

    // Footer
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

    doc.end();
  });
}

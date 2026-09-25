import PDFDocument from 'pdfkit';
import https from 'https';
import http from 'http';

interface AgreementPDFData {
  agreementContent: string;
  landlordName: string;
  tenantName: string;
  landlordSignature: string | null;
  tenantSignature: string | null;
  landlordSignedAt: Date | null;
  tenantSignedAt: Date | null;
  createdAt: Date;
}

function fetchImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, res => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

// 1. Mark the main function as async
export async function generateAgreementPDF(
  data: AgreementPDFData
): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Buffer[] = [];

  // 2. Synchronously set up the stream data collectors
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  // 3. Create a clean promise tracking wrapper ONLY for stream resolution
  const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

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

  let currentY = doc.y;
  doc.moveTo(50, currentY).lineTo(545, currentY).stroke('#e5e7eb');
  doc.y = currentY + 15; // Reset y-coordinate context cleanly after geometric strokes

  // --- Agreement content ---
  const lines = data.agreementContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      doc.moveDown(0.5);
      continue;
    }

    // Heading detection
    if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 3 &&
      !trimmed.match(/^\d+\./)
    ) {
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text(trimmed);
    } else if (trimmed.match(/^\d+\.\s/)) {
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text(trimmed);
    } else {
      doc.fontSize(11).font('Helvetica').fillColor('#333333').text(trimmed);
    }
  }

  doc.moveDown(1);
  currentY = doc.y;
  doc.moveTo(50, currentY).lineTo(545, currentY).stroke('#e5e7eb');
  doc.y = currentY + 15;

  // --- Signatures section ---
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('Signatures', { align: 'center' });
  doc.moveDown(1);

  const sigWidth = 200;
  const sigHeight = 80;

  // --- Landlord signature ---
  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('Landlord: ' + data.landlordName);

  if (data.landlordSignature) {
    try {
      // 4. Using await here is now completely valid!
      const imgBuffer = await fetchImage(data.landlordSignature);
      doc.image(imgBuffer, { width: sigWidth, height: sigHeight });
    } catch {
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#666666')
        .text('[Signature on file]');
    }
    if (data.landlordSignedAt) {
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#666666')
        .text(
          `Signed on: ${data.landlordSignedAt.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}`
        );
    }
  } else {
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#999999')
      .text('[Not yet signed]');
  }

  doc.moveDown(1);

  // --- Tenant signature ---
  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('Tenant: ' + data.tenantName);

  if (data.tenantSignature) {
    try {
      // 5. Using await here is now completely valid!
      const imgBuffer = await fetchImage(data.tenantSignature);
      doc.image(imgBuffer, { width: sigWidth, height: sigHeight });
    } catch {
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#666666')
        .text('[Signature on file]');
    }
    if (data.tenantSignedAt) {
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#666666')
        .text(
          `Signed on: ${data.tenantSignedAt.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}`
        );
    }
  } else {
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#999999')
      .text('[Not yet signed]');
  }

  doc.moveDown(2);

  // --- Footer ---
  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#999999')
    .text(
      'This agreement was created and signed digitally through the CytyFlix platform.',
      { align: 'center' }
    );
  doc.moveDown(0.3);
  doc.text(
    `Document generated on ${new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    { align: 'center' }
  );

  // 6. Close the PDF layout engine stream
  doc.end();

  // 7. Await the finalization promise resolution and return
  return pdfBufferPromise;
}

interface AgreementTemplateData {
  landlordName: string;
  tenantName: string;
  propertyAddress: string;
  propertyTitle: string;
  monthlyRent: string;
  startDate?: string;
}

export function getDefaultAgreementTemplate(
  data: AgreementTemplateData
): string {
  const today = new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `TENANCY AGREEMENT

This Tenancy Agreement ("Agreement") is made on ${today}.

BETWEEN:

LANDLORD: ${data.landlordName}
(hereinafter referred to as "the Landlord")

AND

TENANT: ${data.tenantName}
(hereinafter referred to as "the Tenant")

PROPERTY DETAILS:
Property: ${data.propertyTitle}
Address: ${data.propertyAddress}
Monthly Rent: ${data.monthlyRent}
${data.startDate ? `Commencement Date: ${data.startDate}` : ''}

TERMS AND CONDITIONS:

1. GRANT OF TENANCY
The Landlord hereby grants to the Tenant a tenancy of the above-described property for residential purposes.

2. RENT
The Tenant shall pay the agreed rent amount promptly when due. Payment shall be made through the CytyFlix platform.

3. DURATION
This tenancy shall be for a period as agreed between the parties, subject to the terms herein.

4. USE OF PROPERTY
The Tenant shall use the property solely for residential purposes and shall not sublet or assign the property without the Landlord's prior written consent.

5. MAINTENANCE
The Tenant shall keep the property in good and tenantable condition and shall be responsible for minor repairs. The Landlord shall be responsible for major structural repairs.

6. UTILITIES
The Tenant shall be responsible for payment of all utilities including electricity, water, and waste disposal during the tenancy period.

7. INSPECTION
The Landlord or their agent may inspect the property upon giving reasonable notice to the Tenant.

8. TERMINATION
Either party may terminate this agreement by giving adequate notice as required by applicable Nigerian tenancy law.

9. RETURN OF PROPERTY
Upon termination, the Tenant shall return the property in the same condition as received, fair wear and tear excepted.

10. GOVERNING LAW
This Agreement shall be governed by the laws of the Federal Republic of Nigeria and the applicable state tenancy laws.

AGREED AND SIGNED BY BOTH PARTIES THROUGH THE CYTYFLIX PLATFORM.`;
}

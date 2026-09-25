import crypto from 'crypto';
import { TenancyAgreement, AgreementStatus } from '../domain/tenancy-agreement';
import { TenancyAgreementRepository } from '../contracts/tenancy-agreement.interfaces';
import {
  CreateAgreementDTO,
  SignAgreementDTO,
} from '../contracts/tenancy-agreement.schemas';
import { UserRepository } from '@/modules/users/contracts/user.interfaces';
import { PropertyRepository } from '@/modules/properties/contracts/property.interfaces';
import { rabbitMQ } from '@/infrastructure/messaging/rabbitmq';
import { publishEvent } from '@/infrastructure/messaging/event-bus';
import {
  AGREEMENT_CREATED,
  AGREEMENT_SIGNED,
} from '@/infrastructure/messaging/events';
import { notificationService } from '@/modules/notifications/notification.module';
import { sendEmail } from '@/infrastructure/email';
import {
  agreementCreatedEmail,
  agreementSignedEmail,
} from '@/infrastructure/email/templates';
import { generateAgreementPDF } from '@/shared/utils/agreement-pdf-generator';
import CustomError from '@/shared/utils/custom-error';

export class TenancyAgreementService {
  constructor(
    private readonly agreementRepo: TenancyAgreementRepository,
    private readonly userRepo: UserRepository,
    private readonly propertyRepo: PropertyRepository
  ) {}

  private getUserName(user: {
    profile?: { firstName?: string; lastName?: string } | null;
  }): string {
    return user.profile
      ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
      : 'User';
  }

  async create(landlordId: string, dto: CreateAgreementDTO) {
    const property = await this.propertyRepo.findById(dto.propertyId);
    if (!property) throw new CustomError('Property not found', 404);

    if (property.ownerId !== landlordId) {
      throw new CustomError(
        'Only the property owner can create a tenancy agreement',
        403
      );
    }

    if (landlordId === dto.tenantId) {
      throw new CustomError('Cannot create an agreement with yourself', 400);
    }

    const tenant = await this.userRepo.findById(dto.tenantId);
    if (!tenant) throw new CustomError('Tenant not found', 404);

    const landlord = await this.userRepo.findById(landlordId);
    if (!landlord) throw new CustomError('Landlord not found', 404);

    const agreement = new TenancyAgreement(
      crypto.randomUUID(),
      dto.propertyId,
      landlordId,
      dto.tenantId,
      dto.agreementContent,
      null,
      null,
      null,
      null,
      AgreementStatus.PENDING_TENANT
    );

    const saved = await this.agreementRepo.create(agreement);

    const landlordName = this.getUserName(landlord);
    const tenantName = this.getUserName(tenant);

    if (rabbitMQ.isConnected()) {
      publishEvent('agreement.created', {
        type: AGREEMENT_CREATED,
        payload: {
          agreementId: saved.id,
          landlordId,
          landlordName,
          landlordEmail: landlord.email,
          tenantId: dto.tenantId,
          tenantName,
          tenantEmail: tenant.email,
          propertyTitle: property.title,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      await notificationService.createNotification({
        userId: dto.tenantId,
        type: 'system',
        title: 'New Tenancy Agreement',
        message: `${landlordName} has created a tenancy agreement for you to review and sign.`,
        metadata: { agreementId: saved.id },
      });

      try {
        const template = agreementCreatedEmail({
          tenantName,
          landlordName,
          propertyTitle: property.title,
        });
        await sendEmail({ to: tenant.email, ...template });
      } catch (emailError) {
        console.error('Fallback email send failed:', emailError);
      }
    }

    return saved;
  }

  async signAsLandlord(
    agreementId: string,
    userId: string,
    dto: SignAgreementDTO
  ) {
    const agreement = await this.agreementRepo.findById(agreementId);
    if (!agreement) throw new CustomError('Agreement not found', 404);

    if (agreement.landlordId !== userId) {
      throw new CustomError('Only the landlord can sign as landlord', 403);
    }

    if (agreement.landlordSignature) {
      throw new CustomError('Landlord has already signed this agreement', 400);
    }

    agreement.landlordSignature = dto.signatureUrl;
    agreement.landlordSignedAt = new Date();

    if (agreement.tenantSignature) {
      agreement.status = AgreementStatus.SIGNED;
    } else {
      agreement.status = AgreementStatus.PENDING_TENANT;
    }

    const updated = await this.agreementRepo.update(agreement);
    await this.checkAndNotifySigned(updated);
    return updated;
  }

  async signAsTenant(
    agreementId: string,
    userId: string,
    dto: SignAgreementDTO
  ) {
    const agreement = await this.agreementRepo.findById(agreementId);
    if (!agreement) throw new CustomError('Agreement not found', 404);

    if (agreement.tenantId !== userId) {
      throw new CustomError('Only the tenant can sign as tenant', 403);
    }

    if (agreement.tenantSignature) {
      throw new CustomError('Tenant has already signed this agreement', 400);
    }

    agreement.tenantSignature = dto.signatureUrl;
    agreement.tenantSignedAt = new Date();

    if (agreement.landlordSignature) {
      agreement.status = AgreementStatus.SIGNED;
    } else {
      agreement.status = AgreementStatus.PENDING_LANDLORD;
    }

    const updated = await this.agreementRepo.update(agreement);
    await this.checkAndNotifySigned(updated);
    return updated;
  }

  private async checkAndNotifySigned(agreement: TenancyAgreement) {
    if (agreement.status !== AgreementStatus.SIGNED) return;

    const landlord = await this.userRepo.findById(agreement.landlordId);
    const tenant = await this.userRepo.findById(agreement.tenantId);
    if (!landlord || !tenant) return;

    const landlordName = this.getUserName(landlord);
    const tenantName = this.getUserName(tenant);

    if (rabbitMQ.isConnected()) {
      publishEvent('agreement.signed', {
        type: AGREEMENT_SIGNED,
        payload: {
          agreementId: agreement.id,
          landlordId: agreement.landlordId,
          landlordName,
          landlordEmail: landlord.email,
          tenantId: agreement.tenantId,
          tenantName,
          tenantEmail: tenant.email,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      await notificationService.createNotification({
        userId: agreement.landlordId,
        type: 'system',
        title: 'Agreement Fully Signed',
        message: `Your tenancy agreement with ${tenantName} has been signed by both parties.`,
        metadata: { agreementId: agreement.id },
      });
      await notificationService.createNotification({
        userId: agreement.tenantId,
        type: 'system',
        title: 'Agreement Fully Signed',
        message: `Your tenancy agreement with ${landlordName} has been signed by both parties.`,
        metadata: { agreementId: agreement.id },
      });

      try {
        const template = agreementSignedEmail({ landlordName, tenantName });
        await sendEmail({ to: landlord.email, ...template });
        await sendEmail({ to: tenant.email, ...template });
      } catch (emailError) {
        console.error('Fallback email send failed:', emailError);
      }
    }
  }

  async getAgreement(agreementId: string, userId: string) {
    const agreement = await this.agreementRepo.findById(agreementId);
    if (!agreement) throw new CustomError('Agreement not found', 404);

    if (agreement.landlordId !== userId && agreement.tenantId !== userId) {
      throw new CustomError('You are not a participant of this agreement', 403);
    }

    return agreement;
  }

  async getMyAgreements(userId: string, page: number, limit: number) {
    return this.agreementRepo.findByUserId(userId, page, limit);
  }

  async downloadPDF(agreementId: string, userId: string) {
    const agreement = await this.agreementRepo.findById(agreementId);
    if (!agreement) throw new CustomError('Agreement not found', 404);

    if (agreement.landlordId !== userId && agreement.tenantId !== userId) {
      throw new CustomError('You are not a participant of this agreement', 403);
    }

    const landlord = await this.userRepo.findById(agreement.landlordId);
    const tenant = await this.userRepo.findById(agreement.tenantId);

    const landlordName = landlord ? this.getUserName(landlord) : 'Landlord';
    const tenantName = tenant ? this.getUserName(tenant) : 'Tenant';

    return generateAgreementPDF({
      agreementContent: agreement.agreementContent,
      landlordName,
      tenantName,
      landlordSignature: agreement.landlordSignature,
      tenantSignature: agreement.tenantSignature,
      landlordSignedAt: agreement.landlordSignedAt,
      tenantSignedAt: agreement.tenantSignedAt,
      createdAt: agreement.createdAt,
    });
  }
}

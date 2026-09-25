import { TenancyAgreementController } from './presentation/tenancy-agreement.controller';
import { TenancyAgreementService } from './application/tenancy-agreement.service';
import { TenancyAgreementRepositoryImpl } from './infrastructure/persistence/tenancy-agreement.repository.impl';
import { TenancyAgreementOrmEntity } from './infrastructure/persistence/tenancy-agreement.orm-entity';
import { createTenancyAgreementRoutes } from './presentation/tenancy-agreement.routes';
import { AppDataSource } from '@/infrastructure/database/app-data-source';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/persistence/user.repository.impl';
import { UserOrmEntity } from '@/modules/users/infrastructure/persistence/user.orm-entity';
import { PropertyRepositoryImpl } from '@/modules/properties/infrastructure/persistence/property.repository.impl';
import { PropertyOrmEntity } from '@/modules/properties/infrastructure/persistence/property.orm-entity';

const agreementOrmRepo = AppDataSource.getRepository(TenancyAgreementOrmEntity);
const agreementRepository = new TenancyAgreementRepositoryImpl(
  agreementOrmRepo
);

const userOrmRepo = AppDataSource.getRepository(UserOrmEntity);
const userRepository = new UserRepositoryImpl(userOrmRepo);

const propertyOrmRepo = AppDataSource.getRepository(PropertyOrmEntity);
const propertyRepository = new PropertyRepositoryImpl(propertyOrmRepo);

const tenancyAgreementService = new TenancyAgreementService(
  agreementRepository,
  userRepository,
  propertyRepository
);
const tenancyAgreementController = new TenancyAgreementController(
  tenancyAgreementService
);

export const tenancyAgreementRouter = createTenancyAgreementRoutes(
  tenancyAgreementController
);

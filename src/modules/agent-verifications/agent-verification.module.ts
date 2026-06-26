import { AgentVerificationController } from "./presentation/agent-verification.controller";
import { AgentVerificationService } from "./application/agent-verification.service";
import { AgentVerificationRepositoryImpl } from "./infrastructure/persistence/agent-verification.repository.impl";
import { AgentVerificationOrmEntity } from "./infrastructure/persistence/agent-verification.orm-entity";
import { agentVerificationRoutes } from "./presentation/agent-verification.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";
import { UserRepositoryImpl } from "@/modules/users/infrastructure/persistence/user.repository.impl";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";

const ormRepo = AppDataSource.getRepository(AgentVerificationOrmEntity);
const verificationRepository = new AgentVerificationRepositoryImpl(ormRepo);

const userOrmRepo = AppDataSource.getRepository(UserOrmEntity);
const userRepository = new UserRepositoryImpl(userOrmRepo);

const agentVerificationService = new AgentVerificationService(
  verificationRepository,
  userRepository,
);

const agentVerificationController = new AgentVerificationController(agentVerificationService);

export const agentVerificationRouter = agentVerificationRoutes(agentVerificationController);

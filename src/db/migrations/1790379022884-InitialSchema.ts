import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1790379022884 implements MigrationInterface {
  name = 'InitialSchema1790379022884';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "phoneNumber" character varying, "bio" text, "preferredLocation" character varying, "budgetMin" numeric, "budgetMax" numeric, "profileImage" character varying DEFAULT 'https://cytyflix.com/dummy-man.png', "operatingStates" text array NOT NULL DEFAULT '{}', "operatingLgas" text array NOT NULL DEFAULT '{}', "operatingCities" text array NOT NULL DEFAULT '{}', "slug" character varying, "userId" uuid NOT NULL, CONSTRAINT "UQ_31b12d9a4b6720eecad2b01c2e3" UNIQUE ("slug"), CONSTRAINT "REL_8481388d6325e752cd4d7e26c6" UNIQUE ("userId"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'rent_seeker', "isVerified" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "agent_verifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "idDocumentUrl" character varying NOT NULL, "selfieUrl" character varying NOT NULL, "utilityBillUrl" character varying, "ninNumber" text, "ninVerified" boolean NOT NULL DEFAULT false, "ninData" jsonb, "status" character varying NOT NULL DEFAULT 'pending', "rejectionReason" text, "reviewedBy" uuid, "reviewedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4b51f0b11ffeabef0e323a412c6" UNIQUE ("userId"), CONSTRAINT "PK_d1f4cbc7793c2909d9589fb8db0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "analytics_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventType" character varying NOT NULL, "targetId" character varying NOT NULL, "userId" character varying, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d643d67a09b55653e98616f421" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_38c954e266791189dfd7b6ffc4" ON "analytics_events"  ("eventType", "createdAt") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_613d94ae153b8647ea28bd5294" ON "analytics_events"  ("eventType", "targetId", "createdAt") `
    );
    await queryRunner.query(
      `CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "propertyType" character varying NOT NULL, "listingType" character varying NOT NULL, "price" numeric NOT NULL, "pricePeriod" character varying NOT NULL DEFAULT 'month', "negotiable" boolean NOT NULL DEFAULT false, "currency" character varying NOT NULL DEFAULT 'NGN', "address" character varying NOT NULL, "city" character varying NOT NULL, "lga" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'Nigeria', "latitude" numeric(10,7), "longitude" numeric(10,7), "bedrooms" integer NOT NULL DEFAULT '1', "bathrooms" integer NOT NULL DEFAULT '1', "amenities" jsonb NOT NULL DEFAULT '[]', "proofOfOwnership" jsonb NOT NULL DEFAULT '[]', "images" jsonb NOT NULL DEFAULT '[]', "interiorImages" jsonb NOT NULL DEFAULT '[]', "exteriorImages" jsonb NOT NULL DEFAULT '[]', "streetImages" jsonb NOT NULL DEFAULT '[]', "walkthroughVideo" text, "isAvailable" boolean NOT NULL DEFAULT true, "isFeatured" boolean NOT NULL DEFAULT false, "isFrozen" boolean NOT NULL DEFAULT false, "frozenReason" text, "ownerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clientId" uuid NOT NULL, "agentId" uuid NOT NULL, "propertyId" uuid, "amount" numeric NOT NULL, "paymentReference" character varying NOT NULL, "paymentStatus" character varying NOT NULL, "bookingStatus" character varying NOT NULL, "clientConfirmed" boolean NOT NULL DEFAULT false, "agentConfirmed" boolean NOT NULL DEFAULT false, "scheduledDate" TIMESTAMP, "scheduledTime" character varying NOT NULL, "notes" text, "expiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ba8099dc4ee6a4fbbf6be43de1a" UNIQUE ("paymentReference"), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "inquiries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "propertyId" uuid NOT NULL, "recipientId" uuid NOT NULL, "message" text NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ceacaa439988b25eb9459e694d9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "message" text NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "metadata" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "rent_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "propertyId" uuid NOT NULL, "tenantId" uuid NOT NULL, "ownerId" uuid NOT NULL, "amount" numeric NOT NULL, "paymentReference" character varying NOT NULL, "paymentStatus" character varying NOT NULL DEFAULT 'pending', "status" character varying NOT NULL DEFAULT 'pending', "moveInDate" TIMESTAMP NOT NULL, "tenantConfirmed" boolean NOT NULL DEFAULT false, "confirmedAt" TIMESTAMP, "releasedAt" TIMESTAMP, "expiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_238b838f966008e45a6f8f488bf" UNIQUE ("paymentReference"), CONSTRAINT "PK_deca3deaaf83de65c31d5efe8a3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "propertyId" uuid NOT NULL, "reason" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "reviewedBy" uuid, "reviewedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "propertyId" uuid NOT NULL, "rating" integer NOT NULL, "comment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a7d578531d8973863a012af4311" UNIQUE ("userId", "propertyId"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "saved_listings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "propertyId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f1d8f6c0d2b3f1357f56f826de4" UNIQUE ("userId", "propertyId"), CONSTRAINT "PK_76fecd34cd602bd01b86147e025" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tenancy_agreements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "propertyId" uuid NOT NULL, "landlordId" uuid NOT NULL, "tenantId" uuid NOT NULL, "agreementContent" text NOT NULL, "landlordSignature" text, "tenantSignature" text, "landlordSignedAt" TIMESTAMP, "tenantSignedAt" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'pending_tenant', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9e0bf4db1c337154768208b17dc" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "beneficiaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "bankCode" character varying NOT NULL, "bankName" character varying NOT NULL, "accountNumber" character varying NOT NULL, "accountName" character varying NOT NULL, "recipientCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c9356d282dec80f7f12a9eef10a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "balance" numeric NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2ecdb33f23e9a6fc392025c0b97" UNIQUE ("userId"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "wallet_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "walletId" uuid NOT NULL, "type" character varying NOT NULL, "amount" numeric NOT NULL, "balanceAfter" numeric NOT NULL, "status" character varying NOT NULL, "reference" character varying NOT NULL, "description" text NOT NULL, "metadata" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4b3d5cb7b4480ca1c3c367ebb45" UNIQUE ("reference"), CONSTRAINT "PK_5120f131bde2cda940ec1a621db" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "agent_verifications" ADD CONSTRAINT "FK_4b51f0b11ffeabef0e323a412c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "agent_verifications" ADD CONSTRAINT "FK_88ac9d2bc0bb060cc722dea1ae0" FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_ea203405627b9fb15023dd75661" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_25b77f0f6db36460523458aefc4" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_cf064476d403971270369232d80" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "inquiries" ADD CONSTRAINT "FK_f264ffb02124f71a800d251de4f" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "inquiries" ADD CONSTRAINT "FK_2ee5ab31d7bb5e10f949cec1d8f" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "inquiries" ADD CONSTRAINT "FK_3c90e8061b392ff6c388a52fed2" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "rent_payments" ADD CONSTRAINT "FK_7ca3bc6f27c3bc26f6e17a34bc3" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "rent_payments" ADD CONSTRAINT "FK_cad2c54493f3094a17ce18ecda6" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "rent_payments" ADD CONSTRAINT "FK_2a2283155baa9fd8bf537bf57b1" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_bed415cd29716cd707e9cb3c09c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_f211a23429d38a99a4125b67f4a" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_0a05f4c9ed9e5c5396b5275efe6" FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_2c75ccf95bf502363885d076e76" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "saved_listings" ADD CONSTRAINT "FK_d5d342b14ac39f97fe4f4279ee2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "saved_listings" ADD CONSTRAINT "FK_3e646145529d0ea228d7a6bd9a7" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tenancy_agreements" ADD CONSTRAINT "FK_edc115ef489ba1e08dedb550406" FOREIGN KEY ("landlordId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tenancy_agreements" ADD CONSTRAINT "FK_e63921f58f7df840e5747438efb" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tenancy_agreements" ADD CONSTRAINT "FK_3642785aa926bcafcf93d578c38" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "beneficiaries" ADD CONSTRAINT "FK_50064b54d514b72a49e2b7bb574" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_8a94d9d61a2b05123710b325fbf" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_8a94d9d61a2b05123710b325fbf"`
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97"`
    );
    await queryRunner.query(
      `ALTER TABLE "beneficiaries" DROP CONSTRAINT "FK_50064b54d514b72a49e2b7bb574"`
    );
    await queryRunner.query(
      `ALTER TABLE "tenancy_agreements" DROP CONSTRAINT "FK_3642785aa926bcafcf93d578c38"`
    );
    await queryRunner.query(
      `ALTER TABLE "tenancy_agreements" DROP CONSTRAINT "FK_e63921f58f7df840e5747438efb"`
    );
    await queryRunner.query(
      `ALTER TABLE "tenancy_agreements" DROP CONSTRAINT "FK_edc115ef489ba1e08dedb550406"`
    );
    await queryRunner.query(
      `ALTER TABLE "saved_listings" DROP CONSTRAINT "FK_3e646145529d0ea228d7a6bd9a7"`
    );
    await queryRunner.query(
      `ALTER TABLE "saved_listings" DROP CONSTRAINT "FK_d5d342b14ac39f97fe4f4279ee2"`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_2c75ccf95bf502363885d076e76"`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_0a05f4c9ed9e5c5396b5275efe6"`
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_f211a23429d38a99a4125b67f4a"`
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_bed415cd29716cd707e9cb3c09c"`
    );
    await queryRunner.query(
      `ALTER TABLE "rent_payments" DROP CONSTRAINT "FK_2a2283155baa9fd8bf537bf57b1"`
    );
    await queryRunner.query(
      `ALTER TABLE "rent_payments" DROP CONSTRAINT "FK_cad2c54493f3094a17ce18ecda6"`
    );
    await queryRunner.query(
      `ALTER TABLE "rent_payments" DROP CONSTRAINT "FK_7ca3bc6f27c3bc26f6e17a34bc3"`
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`
    );
    await queryRunner.query(
      `ALTER TABLE "inquiries" DROP CONSTRAINT "FK_3c90e8061b392ff6c388a52fed2"`
    );
    await queryRunner.query(
      `ALTER TABLE "inquiries" DROP CONSTRAINT "FK_2ee5ab31d7bb5e10f949cec1d8f"`
    );
    await queryRunner.query(
      `ALTER TABLE "inquiries" DROP CONSTRAINT "FK_f264ffb02124f71a800d251de4f"`
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_cf064476d403971270369232d80"`
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_25b77f0f6db36460523458aefc4"`
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_ea203405627b9fb15023dd75661"`
    );
    await queryRunner.query(
      `ALTER TABLE "properties" DROP CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0"`
    );
    await queryRunner.query(
      `ALTER TABLE "agent_verifications" DROP CONSTRAINT "FK_88ac9d2bc0bb060cc722dea1ae0"`
    );
    await queryRunner.query(
      `ALTER TABLE "agent_verifications" DROP CONSTRAINT "FK_4b51f0b11ffeabef0e323a412c6"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d"`
    );
    await queryRunner.query(`DROP TABLE "wallet_transactions"`);
    await queryRunner.query(`DROP TABLE "wallets"`);
    await queryRunner.query(`DROP TABLE "beneficiaries"`);
    await queryRunner.query(`DROP TABLE "tenancy_agreements"`);
    await queryRunner.query(`DROP TABLE "saved_listings"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP TABLE "rent_payments"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "inquiries"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "properties"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_613d94ae153b8647ea28bd5294"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_38c954e266791189dfd7b6ffc4"`
    );
    await queryRunner.query(`DROP TABLE "analytics_events"`);
    await queryRunner.query(`DROP TABLE "agent_verifications"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
  }
}

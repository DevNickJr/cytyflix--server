import { Request, Response, NextFunction } from "express";
import { WalletService } from "../application/wallet.service";

export class WalletController {
  constructor(private readonly service: WalletService) {}

  getBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallet = await this.service.getBalance(req.user!.id);
      res.json({ success: true, data: wallet });
    } catch (error) {
      next(error);
    }
  };

  withdraw = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, beneficiaryId, bankCode, accountNumber, accountName } = req.body;
      const transaction = await this.service.requestWithdrawal(
        req.user!.id,
        amount,
        beneficiaryId,
        bankCode,
        accountNumber,
        accountName,
      );
      res.json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  };

  addBeneficiary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bankCode, bankName, accountNumber, accountName } = req.body;
      const beneficiary = await this.service.addBeneficiary(
        req.user!.id,
        bankCode,
        bankName,
        accountNumber,
        accountName,
      );
      res.status(201).json({ success: true, data: beneficiary });
    } catch (error) {
      next(error);
    }
  };

  getBeneficiaries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const beneficiaries = await this.service.getBeneficiaries(req.user!.id);
      res.json({ success: true, data: beneficiaries });
    } catch (error) {
      next(error);
    }
  };

  deleteBeneficiary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteBeneficiary(req.user!.id, req.params.id);
      res.json({ success: true, message: "Beneficiary deleted" });
    } catch (error) {
      next(error);
    }
  };

  resolveAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountNumber = req.query.account_number as string;
      const bankCode = req.query.bank_code as string;
      const result = await this.service.resolveAccount(accountNumber, bankCode);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getBanks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const banks = await this.service.getBanks();
      res.json({ success: true, data: banks });
    } catch (error) {
      next(error);
    }
  };

  getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.service.getTransactionHistory(req.user!.id, page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
}

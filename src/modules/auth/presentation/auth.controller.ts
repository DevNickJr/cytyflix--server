import { Request, Response, NextFunction } from "express";
import { AuthService } from "../application/auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.login(req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.refreshToken({
        refreshToken: req.body.refreshToken,
      });
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}

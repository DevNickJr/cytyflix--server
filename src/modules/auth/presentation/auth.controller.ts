import { AuthService } from "../application/auth.service";

export class AuthController {
  constructor(private readonly userService: AuthService) {}

  register = async (req: any, res: any) => {
    const user = await this.userService.register(req.body);
    return res.json(user);
  };

  login = async (req: any, res: any) => {
    const user = await this.userService.login(req.body);
    return res.json(user);
  };
}
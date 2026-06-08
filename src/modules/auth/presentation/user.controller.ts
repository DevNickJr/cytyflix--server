import { UserService } from "../application/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (req: any, res: any) => {
    const user = await this.userService.createUser(req.body);
    return res.json(user);
  };

  get = async (req: any, res: any) => {
    const user = await this.userService.getUser(req.params.id);
    return res.json(user);
  };

//   update = async (req: any, res: any) => {
//     const user = await this.userService.updateUser(
//       req.params.id,
//       req.body
//     );
//     return res.json(user);
//   };
}
import { RolesEnum } from "@/modules/users/contracts/user.interfaces";
import { JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: RolesEnum;
}
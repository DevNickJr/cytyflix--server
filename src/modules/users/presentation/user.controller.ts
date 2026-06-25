import { Request, Response, NextFunction } from "express";
import { UserService } from "../application/user.service";
import CustomError from "@/shared/utils/custom-error";
import { SearchByLocationQuery } from "../contracts/user.interfaces";

export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUser(req.params.id as string);
      if (!user) throw new CustomError("User not found", 404);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  getByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserByEmail(req.params.email as string);
      if (!user) throw new CustomError("User not found", 404);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.userService.getProfile(req.user!.id);
      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new CustomError('User is not authorized', 403);

      const user = await this.userService.updateProfile(userId, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  getAgents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as SearchByLocationQuery;
          console.log({
      queryaa: query
    })
      const result = await this.userService.getAgents(query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getAgent = async (req: Request, res: Response, next: NextFunction) => {
    console.log({
      newagent1: req.params.id
    })
    console.log('Get Aggent  trace', { params: req.params })

    try {
      const agent = await this.userService.getAgent(req.params.id as string);
      console.log({
        agent: agent
      })
      if (!agent) throw new CustomError("Agent not found", 404);
      res.json({ success: true, data: agent });
    } catch (error) {
      next(error);
    }
  };

  getAgentProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as SearchByLocationQuery;
      console.log('Aggent  trace', { params: req.params })

      const result = await this.userService.getAgentProperties(req.params.id as string, query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  makeAdminOrAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new CustomError('User is not authorized', 403);

      const user = await this.userService.updateRole(userId, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };
}

import type { Response } from "express";
import { z } from "zod";
import type { AuthedRequest } from "../types/auth.types";
import { UserService } from "../services/user.service";

const updateRoleSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "ADMIN", "USER"]),
});

export class UserController {
  static async list(req: AuthedRequest, res: Response) {
    const users = await UserService.listUsers();
    res.json(users);
  }

  static async updateRole(req: AuthedRequest, res: Response) {
    const body = updateRoleSchema.parse(req.body);
    const updatedUser = await UserService.updateUserRole(
      req.params.id as string,
      body.role,
      req.user!.id,
    );
    res.json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  }
}

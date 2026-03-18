import type { Response } from "express";
import { z } from "zod";
import type { AuthedRequest } from "../types/auth.types";
import { CafeService } from "../services/cafe.service";

const createCafeSchema = z.object({
  name: z.string().min(2).max(100),
  location: z.string().max(200).optional(),
});

const updateCafeSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  location: z.string().max(200).optional(),
  managedBy: z.string().optional(),
});

const assignManagerSchema = z.object({
  managerId: z.string(),
});

export class CafeController {
  static async create(req: AuthedRequest, res: Response) {
    const body = createCafeSchema.parse(req.body);
    const cafe = await CafeService.createCafe({
      ...body,
      createdBy: req.user!.id,
    });
    res.status(201).json(cafe);
  }

  static async list(req: AuthedRequest, res: Response) {
    const cafes = await CafeService.listCafes(req.user!);
    res.json(cafes);
  }

  static async getById(req: AuthedRequest, res: Response) {
    const cafe = await CafeService.getCafeById(
      req.params.id as string,
      req.user!,
    );
    res.json(cafe);
  }

  static async update(req: AuthedRequest, res: Response) {
    const patch = updateCafeSchema.parse(req.body);
    const cafe = await CafeService.updateCafe(
      req.params.id as string,
      req.user!,
      patch,
    );
    res.json(cafe);
  }

  static async remove(req: AuthedRequest, res: Response) {
    const result = await CafeService.deleteCafe(
      req.params.id as string,
      req.user!,
    );
    res.json(result);
  }

  static async assignManager(req: AuthedRequest, res: Response) {
    const body = assignManagerSchema.parse(req.body);

    const cafe = await CafeService.assignManager(
      req.params.id as string,
      body.managerId,
    );

    res.json({
      message: "Manager assigned successfully",
      cafe,
    });
  }
}

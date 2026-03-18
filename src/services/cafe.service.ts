import { ROLES } from "../constants/roles";
import { Cafe } from "../models/Cafe";
import { User } from "../models/User";
import { CafePolicy } from "../policies/cafe.policy";
import type { CurrentUser } from "../types/auth.types";

export class CafeService {
  static async createCafe(data: {
    name: string;
    location?: string;
    createdBy: string;
  }) {
    return Cafe.create(data);
  }

  static async listCafes(user: CurrentUser) {
    if (user.role === "SUPER_ADMIN") {
      return Cafe.find().sort({ createdAt: -1 });
    }

    if (user.role === "ADMIN") {
      return Cafe.find({ managedBy: user.id }).sort({ createdAt: -1 });
    }

    return Cafe.find().select("_id name location").sort({ createdAt: -1 });
  }

  static async getCafeById(cafeId: string, user: CurrentUser) {
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      throw Object.assign(new Error("Cafe not found"), { status: 404 });
    }
    if (!CafePolicy.canRead(user, cafe)) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }
    return cafe;
  }

  static async updateCafe(
    cafeId: string,
    user: CurrentUser,
    patch: {
      name?: string;
      location?: string;
      managedBy?: string;
    },
  ) {
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      throw Object.assign(new Error("Cafe not found"), { status: 404 });
    }
    if (!CafePolicy.canUpdate(user, cafe)) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }
    if (patch.name !== undefined) cafe.name = patch.name;
    if (patch.location !== undefined) cafe.location = patch.location;
    if (patch.managedBy !== undefined) {
      if (!CafePolicy.canAssignManager(user)) {
        throw Object.assign(new Error("Only SUPERADMIN can assign manager"), {
          status: 403,
        });
      }
      cafe.managedBy = patch.managedBy as any;
    }
    await cafe.save();
    return cafe;
  }

  static async deleteCafe(cafeId: string, user: CurrentUser) {
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      throw Object.assign(new Error("Cafe not found"), { status: 404 });
    }
    if (!CafePolicy.canDelete(user, cafe)) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }
    await cafe.deleteOne();
    return { message: "Cafe deleted successfully" };
  }

  static async assignManager(cafeId: string, managerId: string) {
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      throw Object.assign(new Error("Cafe not found"), { status: 404 });
    }

    const manager = await User.findById(managerId);
    if (!manager) {
      throw Object.assign(new Error("Manager user not found"), { status: 404 });
    }

    if (manager.role !== ROLES.ADMIN) {
      throw Object.assign(new Error("Assigned user must have ADMIN role"), {
        status: 400,
      });
    }

    cafe.managedBy = manager._id;
    await cafe.save();
    return cafe;
  }
}

import { User } from "../models/User";
import { ROLES, type UserRole } from "../constants/roles";

export class UserService {
  static async listUsers() {
    return User.find()
      .select("_id email role emailVerified createdAt")
      .sort({ createdAt: -1 });
  }

  static async updateUserRole(
    targetUserId: string,
    newRole: UserRole,
    currentUserId: string,
  ) {
    const user = await User.findById(targetUserId);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    if (user._id.toString() === currentUserId) {
      throw Object.assign(new Error("Cannot change own role"), { status: 400 });
    }
    if (!Object.values(ROLES).includes(newRole)) {
      throw Object.assign(new Error("Invalid role"), { status: 400 });
    }
    user.role = newRole;
    await user.save();
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  }
}

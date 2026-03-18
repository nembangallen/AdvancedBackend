import type { ICafe } from "../models/Cafe";
import type { CurrentUser } from "../types/auth.types";
import { ROLES } from "../constants/roles";

export class CafePolicy {
  static canRead(user: CurrentUser, cafe: ICafe): boolean {
    if (user.role === ROLES.SUPERADMIN) return true;
    if (user.role === ROLES.ADMIN) {
      return !!cafe.managedBy && cafe.managedBy.toString() === user.id;
    }
    return false;
  }

  static canUpdate(user: CurrentUser, cafe: ICafe): boolean {
    if (user.role === ROLES.SUPERADMIN) return true;
    if (user.role === ROLES.ADMIN) {
      return !!cafe.managedBy && cafe.managedBy.toString() === user.id;
    }
    return false;
  }

  static canDelete(user: CurrentUser, _cafe: ICafe): boolean {
    return user.role === ROLES.SUPERADMIN;
  }

  static canAssignManager(user: CurrentUser): boolean {
    return user.role === ROLES.SUPERADMIN;
  }
}

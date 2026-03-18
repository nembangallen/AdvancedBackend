export const PERMISSIONS = {
  CAFE_CREATE: "cafe:create",
  CAFE_READ: "cafe:read",
  CAFE_UPDATE: "cafe:update",
  CAFE_DELETE: "cafe:delete",
  CAFE_ASSIGN_MANAGER: "cafe:assign_manager",

  USER_READ: "user:read",
  USER_UPDATE_ROLE: "user:update_role",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

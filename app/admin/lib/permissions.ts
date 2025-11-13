// /lib/permissions.ts
export const PERMISSION_MODULES = {
  // Dashboard
  DASHBOARD: "dashboard",

  // Branch-specific modules
  RESERVATIONS: "reservations",
  ROOM_PRICE: "room_price",
  GUEST_EXPERIENCE: "guest_experience",
  INVENTORY: "inventory",

  // Marketing & CMS
  CMS_BRANCH_MANAGER: "cms_branch_manager",
  CMS_REVIEW: "cms_review",
  CMS_CHATBOT: "cms_chatbot",
  CMS_NEWS: "cms_news",
  EMAIL_MARKETING: "email_marketing",

  // HR
  HR: "hr",

  // System Admin
  SYSTEM_PERMISSIONS: "system_permissions",
  SYSTEM_USERS: "system_users",
  SYSTEM_ROLES: "system_roles",
  SYSTEM_API: "system_api",
  SYSTEM_AUDIT: "system_audit",
} as const;

// Simple check - user either has module access or not
export function hasPermission(
  userPermissions: string[],
  module: string
): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(module);
}

// Check if user can access branch data
export function canAccessBranch(
  userBranch: any,
  targetBranchId: number
): boolean {
  if (!userBranch) return true; // Admin/Superadmin
  return userBranch.id === targetBranchId;
}

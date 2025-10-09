// /lib/permissions.ts
export const PERMISSIONS = {
  "reservations.view": "View Reservations",
  "guests.view": "View Guests",
  "staff.view": "View Staff",
  "cms.access": "CMS Access",
  "marketing.email": "Email Marketing",
  "finance.access": "Finance Overview",
  "finance.billing": "Billing & Transactions",
  "finance.services": "Services & Inventory",
  "reports.view": "Reports",
  "settings.access": "System Settings",
  "user.manage": "User & Permission Management",
};

export type PermissionKey = keyof typeof PERMISSIONS;

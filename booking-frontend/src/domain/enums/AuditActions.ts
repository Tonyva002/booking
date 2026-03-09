export const AUDIT_ACTIONS = {
  CREATED: "Created",
  CANCELED: "Canceled",
  RESCHEDULED: "Rescheduled",
} as const;

export type AuditActions =
  (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
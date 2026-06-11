export const payPeriods = [
  {
    id: "june-1-15",
    range: "Jun 1, 2026 - Jun 15, 2026",
    payday: "Friday, Jun 19",
  },
  {
    id: "may-16-31",
    range: "May 16, 2026 - May 31, 2026",
    payday: "Friday, Jun 5",
  },
] as const;

export type PayPeriod = (typeof payPeriods)[number];
export type PayPeriodId = PayPeriod["id"];

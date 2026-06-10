export type WageChange = {
  type: "increase" | "decrease";
  oldWage: string;
  newWage: string;
  delta: string;
  effectiveOn: string;
  changedBy: string;
  changedOn: string;
};

export type MoneyCell = {
  value: string;
  detail?: string;
  wageChange?: WageChange;
};

export type DeductionCell = {
  value: string;
  label: string;
  recurring?: boolean;
};

export type EmploymentStatus = "Full Time" | "Seasonal" | "Part Time" | "H2A Visa";

export type ApprovalStatus = "pending" | "approved";

export const EMPLOYMENT_STATUSES: EmploymentStatus[] = [
  "Full Time",
  "Seasonal",
  "Part Time",
  "H2A Visa",
];

export type EmployeeRow = {
  id: string;
  name: string;
  team: string;
  role: string;
  level: string;
  employmentStatus: EmploymentStatus;
  status: "in" | "out";
  alertCount?: number;
  shift?: MoneyCell;
  reg?: MoneyCell;
  pm?: MoneyCell;
  ot?: MoneyCell;
  pto?: MoneyCell;
  total: string;
  additions?: DeductionCell[];
  payrollDeductions?: DeductionCell[];
  companyDeductions?: DeductionCell[];
  loans?: DeductionCell[];
};

export const employees: EmployeeRow[] = [
  {
    id: "1",
    name: "Beatriz Martinez",
    team: "Parlor Team",
    role: "Milker",
    level: "Level 3",
    employmentStatus: "Full Time",
    status: "out",
    alertCount: 1,
    shift: { value: "$1,300.00", detail: "13 X $100" },
    total: "$1,300.00",
  },
  {
    id: "2",
    name: "Juan Aguiar",
    team: "Herd Team",
    role: "Herdsman",
    level: "Level 3",
    employmentStatus: "Seasonal",
    status: "in",
    reg: {
      value: "$918.75",
      detail: "87.5h X $10.50",
      wageChange: {
        type: "increase",
        oldWage: "$10.00/hr",
        newWage: "$10.50/hr",
        delta: "+$0.50",
        effectiveOn: "Jan 31, 2026",
        changedBy: "Jimmy Johnson",
        changedOn: "Jan 1, 2026",
      },
    },
    total: "$918.75",
    additions: [{ value: "$75.00", label: "Anniversary Bonus" }],
  },
  {
    id: "3",
    name: "Ker Thao",
    team: "Splits Team",
    role: "Splits Milker",
    level: "Level 5",
    employmentStatus: "Part Time",
    status: "out",
    shift: { value: "$1,100.00", detail: "11 X $100" },
    total: "$1,100.00",
    payrollDeductions: [{ value: "$9.25", label: "Dental Insurance" }],
    companyDeductions: [{ value: "$300.00", label: "Rent" }],
  },
  {
    id: "4",
    name: "Miguel Rojas",
    team: "Herd Team",
    role: "Herdsman",
    level: "Level 3",
    employmentStatus: "H2A Visa",
    status: "in",
    shift: { value: "$750.00", detail: "15 X $50" },
    pto: { value: "$80.00", detail: "8h X $10" },
    total: "$750.00",
    loans: [{ value: "$155.00", label: "Meal Advance" }],
  },
  {
    id: "5",
    name: "Teresa Branham",
    team: "Parlor Team",
    role: "Milker",
    level: "Level 2",
    employmentStatus: "Full Time",
    status: "out",
    alertCount: 5,
    reg: {
      value: "$620.00",
      detail: "62h X $10",
      wageChange: {
        type: "decrease",
        oldWage: "$10.00/hr",
        newWage: "$9.00/hr",
        delta: "-$1.00",
        effectiveOn: "Jan 31, 2026",
        changedBy: "Jimmy Johnson",
        changedOn: "Jan 1, 2026",
      },
    },
    total: "$620.00",
  },
  {
    id: "6",
    name: "Elena Vasquez",
    team: "Parlor Team",
    role: "Milker",
    level: "Level 4",
    employmentStatus: "Seasonal",
    status: "in",
    reg: { value: "$840.00", detail: "80h X $10.50" },
    total: "$840.00",
  },
  {
    id: "7",
    name: "Carlos Mendoza",
    team: "Herd Team",
    role: "Herdsman",
    level: "Level 2",
    employmentStatus: "Part Time",
    status: "out",
    shift: { value: "$600.00", detail: "12 X $50" },
    total: "$600.00",
    payrollDeductions: [{ value: "$12.50", label: "Health Insurance" }],
  },
  {
    id: "8",
    name: "Roberto Salinas",
    team: "Splits Team",
    role: "Splits Milker",
    level: "Level 3",
    employmentStatus: "H2A Visa",
    status: "in",
    reg: {
      value: "$945.00",
      detail: "90h X $10.50",
      wageChange: {
        type: "increase",
        oldWage: "$10.00/hr",
        newWage: "$10.50/hr",
        delta: "+$0.50",
        effectiveOn: "Feb 1, 2026",
        changedBy: "Maria Lopez",
        changedOn: "Jan 15, 2026",
      },
    },
    total: "$945.00",
    additions: [{ value: "$50.00", label: "Safety Bonus" }],
  },
  {
    id: "9",
    name: "Ana Morales",
    team: "Parlor Team",
    role: "Milker",
    level: "Level 1",
    employmentStatus: "Full Time",
    status: "out",
    reg: { value: "$525.00", detail: "50h X $10.50" },
    total: "$525.00",
  },
  {
    id: "10",
    name: "Diego Herrera",
    team: "Herd Team",
    role: "Herdsman",
    level: "Level 4",
    employmentStatus: "Seasonal",
    status: "in",
    shift: { value: "$950.00", detail: "19 X $50" },
    ot: { value: "$126.00", detail: "12h X $10.50" },
    total: "$1,076.00",
    companyDeductions: [{ value: "$125.00", label: "Housing" }],
  },
];

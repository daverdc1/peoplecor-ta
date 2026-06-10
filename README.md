# PeopleCor Time & Attendance

React + Tailwind + shadcn/ui implementation of the **P002-TA-Payroll-Toggle** Figma frame.

## Setup

```bash
cd ~/Projects/peoplecor-ta
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Structure

- `src/index.css` — design tokens from Figma (brand cyan, stats slate, success green)
- `src/components/layout/` — app header, stats bar, section header
- `src/components/time-attendance/` — pay period toolbar, filters, employee table
- `src/components/ui/` — shadcn-style primitives (Button, Badge, Switch, etc.)
- `src/data/employees.ts` — mock payroll row data

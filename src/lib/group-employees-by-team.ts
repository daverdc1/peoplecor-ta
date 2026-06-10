import type { EmployeeRow } from "@/data/employees";

export type EmployeeTeamGroup = {
  team: string;
  employees: EmployeeRow[];
};

export function groupEmployeesByTeam(employees: EmployeeRow[]): EmployeeTeamGroup[] {
  const groups = new Map<string, EmployeeRow[]>();

  for (const employee of employees) {
    const existing = groups.get(employee.team);
    if (existing) {
      existing.push(employee);
    } else {
      groups.set(employee.team, [employee]);
    }
  }

  return [...groups.entries()]
    .sort(([teamA], [teamB]) => teamA.localeCompare(teamB))
    .map(([team, teamEmployees]) => ({ team, employees: teamEmployees }));
}

import type { EmployeeRow, EmploymentStatus } from "@/data/employees";

export function matchesEmployeeSearch(employee: EmployeeRow, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return employee.name.toLowerCase().includes(normalizedQuery);
}

export function filterEmployees(
  employees: EmployeeRow[],
  employmentStatusFilter: EmploymentStatus[],
  searchQuery: string,
) {
  return employees.filter((employee) => {
    const matchesEmploymentStatus =
      employmentStatusFilter.length === 0 ||
      employmentStatusFilter.includes(employee.employmentStatus);

    return (
      matchesEmploymentStatus && matchesEmployeeSearch(employee, searchQuery)
    );
  });
}

import { EmployeeData } from './dataType.js';
import { Roles } from './handleRoles.js';
import { Role } from './dataType.js';

export class Storage {
    constructor() { };
    saveToSessionStorage(employee: EmployeeData) {
        let savedEmployees: EmployeeData[] = JSON.parse(sessionStorage.getItem("employeesTableDetail") || 'null')
        if (savedEmployees == null) {
            savedEmployees = [];
            savedEmployees.push(employee);
        }
        else {
            savedEmployees.push(employee);
        }
        sessionStorage.setItem("employeesTableDetail", JSON.stringify(savedEmployees));
    }
    employeesDetails(key: string): EmployeeData[] | null {
        const employees: EmployeeData[] | null = JSON.parse(sessionStorage.getItem(key) || '{}');
        return employees;
    }

    getFilteredEmployees() {
        const employees: EmployeeData[] | null = JSON.parse(sessionStorage.getItem('FilteredEmployeesDetail') || '{}');
        return employees;
    }

    resetFilterStorage() {
        let employee: EmployeeData[] = this.employeesDetails('employeesTableDetail')!;
        sessionStorage.setItem('FilteredEmployeesDetail', JSON.stringify(employee));
    }

    deleteFromSessionStorage(employee: HTMLElement) {
        let savedEmployees: EmployeeData[] = JSON.parse(sessionStorage.getItem("employeesTableDetail") || '{}')!;
        let selectedEmployee: string | null;
        if (employee.querySelector('.col-emp-no') != null) {
            selectedEmployee = employee.querySelector('.col-emp-no')!.textContent;
        }
        savedEmployees = savedEmployees.filter((savedEmployee) => savedEmployee.empNo != selectedEmployee);
        sessionStorage.setItem("employeesTableDetail", JSON.stringify(savedEmployees));
    }
    populateFilteredRoles(filteredRoles: Role[]) {
        let roles = new Roles();
        sessionStorage.setItem('FilteredRolesDetail', JSON.stringify(filteredRoles));
        const allRoles = JSON.parse(sessionStorage.getItem('FilteredRolesDetail') || '{}');
        allRoles.forEach((role: Role) => {
            roles.createRoleBlock(role)

        })
    }
}
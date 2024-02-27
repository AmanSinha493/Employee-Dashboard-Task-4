import { EmployeeData } from './employee.js';


export class Storage {
    constructor() { };
    saveToSessionStorage(employee: EmployeeData) {
        let savedEmployees: EmployeeData[] = JSON.parse(sessionStorage.getItem("employeesTableDetail") || 'null')
        console.log(savedEmployees);
        if (savedEmployees == null) {
            savedEmployees = [];
            savedEmployees.push(employee);
        }
        else {
            savedEmployees.push(employee);
        }
        sessionStorage.setItem("employeesTableDetail", JSON.stringify(savedEmployees));
    }
    employeesDetails(key: string): EmployeeData[] | null  {
        const employees: EmployeeData[] | null = JSON.parse(sessionStorage.getItem(key) || 'null');
        return employees;
    }

    getFilteredEmployees() {
        const employees: EmployeeData[] | null = JSON.parse(sessionStorage.getItem('FilteredEmployeesDetail') || 'null');
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

    
}
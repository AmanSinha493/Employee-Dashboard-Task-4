import { Roles } from './handleRoles.js';
export class Storage {
    constructor() { }
    ;
    saveToSessionStorage(employee) {
        let savedEmployees = JSON.parse(sessionStorage.getItem("employeesTableDetail") || 'null');
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
    employeesDetails(key) {
        const employees = JSON.parse(sessionStorage.getItem(key) || 'null');
        return employees;
    }
    getFilteredEmployees() {
        const employees = JSON.parse(sessionStorage.getItem('FilteredEmployeesDetail') || 'null');
        return employees;
    }
    resetFilterStorage() {
        let employee = this.employeesDetails('employeesTableDetail');
        sessionStorage.setItem('FilteredEmployeesDetail', JSON.stringify(employee));
    }
    deleteFromSessionStorage(employee) {
        let savedEmployees = JSON.parse(sessionStorage.getItem("employeesTableDetail") || '{}');
        let selectedEmployee;
        if (employee.querySelector('.col-emp-no') != null) {
            selectedEmployee = employee.querySelector('.col-emp-no').textContent;
        }
        savedEmployees = savedEmployees.filter((savedEmployee) => savedEmployee.empNo != selectedEmployee);
        sessionStorage.setItem("employeesTableDetail", JSON.stringify(savedEmployees));
    }
    populateFilteredRoles(filteredRoles) {
        let roles = new Roles();
        sessionStorage.setItem('FilteredRolesDetail', JSON.stringify(filteredRoles));
        const allRoles = JSON.parse(sessionStorage.getItem('FilteredRolesDetail') || 'null');
        if (allRoles && allRoles.length > 0) {
            allRoles.forEach((role) => {
                roles.createRoleBlock(role);
            });
        }
        else {
            console.log('No employee data available.');
        }
    }
}

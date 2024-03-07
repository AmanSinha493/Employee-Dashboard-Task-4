
import { AddRoles } from "./handleRoles.js";
import { Collapse } from "./employeeTable.js";
let addRole = new AddRoles();
let collapse = new Collapse();
document.addEventListener("DOMContentLoaded", function () {
    let employeeSelect = document.getElementsByClassName('select-selected')[0];
    employeeSelect.addEventListener('click', addRole.showEmployeeDropdown);
    employeeSelect.addEventListener('input', addRole.searchEmployee);
    addRole.loadEmployees();
    document.querySelector('.collapse-button')?.addEventListener('click', collapse.sideBar);
    const addRoleForm = document.getElementById('roleForm') as HTMLFormElement;
    addRoleForm.addEventListener("submit", addRole.handleRoleSubmit);
    (document.querySelector('.form-buttons>:first-child')! as HTMLButtonElement).onclick = () => window.location.href = './Roles.html';
});
import { Roles } from "./handleRoles.js";
import { Filter } from "./filter.js";
import { EmployeeTable } from './common.js';
import { Collapse } from "./common.js";
import { RoleFilter } from "./filter.js";
let roleFilter=new RoleFilter();
let collapse=new Collapse();
let employeeTable =new EmployeeTable();
let filter=new Filter();
let roles=new Roles();
document.addEventListener("DOMContentLoaded", function () {
    roles.populateRoles();
    roles.checkRoles();
    filter.displayFilterDropdown();
    employeeTable.disableFilterButton();
    document.querySelector('.collapse-button')?.addEventListener( 'click',collapse.sideBar);
    document.querySelector('.reset-btn')?.addEventListener('click',roleFilter.applyRoleReset);
    document.querySelector('.apply-btn')?.addEventListener('click',roleFilter.applyRoleFilter);
    let input = document.querySelectorAll('.filter-options-container input') as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < input.length; i++) {
       let select=input[i].parentNode! as HTMLElement;
       select.addEventListener('click',employeeTable.selectFilter) 
    }
});
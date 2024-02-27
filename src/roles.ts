import { Roles } from "./handleRoles.js";
import { Filter } from "./filter.js";
import { EmployeeTable } from './script.js';
import { Collapse } from "./script.js";
let collapse=new Collapse();
let employeeTable =new EmployeeTable();
let filter=new Filter();
let roles=new Roles();
document.addEventListener("DOMContentLoaded", function () {
    roles.populateRoles();
    roles.checkRoles();
    employeeTable.disableFilterButton();
    document.querySelector('.collapse-button')?.addEventListener( 'click',collapse.sideBar);
    document.querySelector("#location-filter>:first-child")?.addEventListener( 'click',filter.displayLocationFilter);
    document.querySelector("#department-filter>:first-child")?.addEventListener( 'click',filter.displayDepartmentFilter);
    document.querySelector('.reset-btn')?.addEventListener('click',filter.resetFilter);
    let input = document.querySelectorAll('.filter-options-container input') as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < input.length; i++) {
       let select=input[i].parentNode! as HTMLElement;
       select.addEventListener('click',employeeTable.selectFilter) 
    }
});
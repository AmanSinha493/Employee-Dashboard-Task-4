import { Storage } from "./handleStorage.js";
import { Populate } from "./populate.js";
import { Filter } from "./filter.js";
import { AddEmployee } from "./handleForms.js";
import { EmployeeModal } from "./handleForms.js";
import { EmployeeTable } from './script.js';
import { Collapse } from "./script.js";
import { SortTable } from "./script.js";
import { ExportCsv } from "./script.js";
import { Roles } from "./handleRoles.js";
let roles = new Roles();
let collapse = new Collapse();
let employeeTable = new EmployeeTable();
let storage = new Storage();
let filter = new Filter();
let populate = new Populate();
let addEmp = new AddEmployee();
let modal = new EmployeeModal();
let sortTable = new SortTable();
let exportCsv = new ExportCsv();
document.addEventListener("DOMContentLoaded", async function () {
    console.log("ts called");
    async function employeeRowsJson() {
        try {
            if (!sessionStorage.getItem('employeesTableDetail')) {
                const response = await fetch("../json/employeesDetails.json");
                var employeeList = await response.json();
                for (let i = 0; i < employeeList.length; i++) {
                    console.log(employeeList[i]);
                    storage.saveToSessionStorage(employeeList[i]);
                }
                window.location.reload();
                storage.resetFilterStorage();
            }
        }
        catch (error) {
            console.error("Error fetching JSON:", error);
        }
    }
    employeeRowsJson();
    populate.populateTable();
    filter.setAlphabeticFilter();
    sortTable.sortEmployeeTable();
    employeeTable.disableFilterButton();
    roles.checkRoles();
    document.querySelector('.collapse-button')?.addEventListener('click', collapse.sideBar);
    document.querySelector('.add-employee-button')?.addEventListener('click', modal.openAddEmployeeModal);
    document.querySelector('#cancel')?.addEventListener('click', modal.closeAddEmployeeModal);
    let uploadProfilePic = document.getElementById('profileImageInput');
    uploadProfilePic.addEventListener('change', addEmp.displayImagePreview);
    document.querySelector('.delete-yes')?.addEventListener('click', populate.deleteRow);
    document.querySelector('.delete-no')?.addEventListener('click', populate.closeDeleteConfirmation);
    document.querySelector('th input')?.addEventListener('change', populate.selectAllRow);
    document.querySelector(".export-button")?.addEventListener('click', exportCsv.tableToCSV);
    document.querySelector('.delete-btn')?.addEventListener('click', populate.openDeleteConfirmation);
    document.querySelector("#status-filter>:first-child")?.addEventListener('click', filter.displayStatusFilter);
    document.querySelector("#location-filter>:first-child")?.addEventListener('click', filter.displayLocationFilter);
    document.querySelector("#department-filter>:first-child")?.addEventListener('click', filter.displayDepartmentFilter);
    document.querySelector('.apply-btn')?.addEventListener('click', filter.applyFilter);
    document.querySelector('.reset-btn')?.addEventListener('click', filter.resetFilter);
    const addEmployeeForm = document.getElementsByClassName('add-employee-form')[0];
    addEmployeeForm.addEventListener("submit", addEmp.checkValidation);
    let searchInput = document.querySelector(".search-input input");
    searchInput.addEventListener('input', employeeTable.searchBar);
    let input = document.querySelectorAll('.filter-options-container input');
    for (let i = 0; i < input.length; i++) {
        let select = input[i].parentNode;
        select.addEventListener('click', employeeTable.selectFilter);
    }
});

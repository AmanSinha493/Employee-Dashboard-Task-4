import { Storage } from "./handleStorage.js";
import { Populate } from "./populate.js";
import { Filter } from "./filter.js";
import { AddEmployee } from "./handleForms.js";
import { EmployeeModal } from "./handleForms.js";
import { EmployeeTable } from './employeeTable.js';
import { Collapse } from "./employeeTable.js";
import { SortTable } from "./employeeTable.js";
import { ExportCsv } from "./employeeTable.js";
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
    async function employeeRowsJson() {
        try {
            if (!sessionStorage.getItem('employeesTableDetail')) {
                const response = await fetch("./public/json/employeesDetails.json");
                var employeeList = await response.json();
                for (let i = 0; i < employeeList.length; i++) {
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
    filter.displayFilterDropdown();
    filter.applyEmployeesFilter();
    sortTable.sortEmployeeTable();
    employeeTable.disableFilterButton();
    roles.checkRoles();
    addEmp.populateRoleOptions();
    document.querySelector('.collapse-button')?.addEventListener('click', collapse.sideBar);
    document.querySelector('.add-employee-button')?.addEventListener('click', modal.openAddEmployeeModal);
    document.querySelector('#cancel')?.addEventListener('click', employeeTable.checkForEditChanges);
    let uploadProfilePic = document.getElementById('profileImageInput');
    uploadProfilePic.addEventListener('change', addEmp.displayImagePreview);
    document.querySelector('.delete-yes')?.addEventListener('click', populate.deleteRow);
    document.querySelector('.delete-no')?.addEventListener('click', populate.closeDeleteConfirmation);
    document.querySelector('.edit-cancel-yes')?.addEventListener('click', () => {
        modal.closeAddEmployeeModal();
        addEmp.closeEditConfirmation();
    });
    document.querySelector('.edit-cancel-no')?.addEventListener('click', addEmp.closeEditConfirmation);
    document.querySelector('th input')?.addEventListener('change', populate.selectAllRow);
    document.querySelector(".export-button")?.addEventListener('click', exportCsv.tableToCSV);
    document.querySelector('.delete-btn')?.addEventListener('click', populate.openDeleteConfirmation);
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

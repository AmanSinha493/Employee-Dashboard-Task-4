import { Populate } from './populate.js';
import { Storage } from './handleStorage.js';
import { EmployeeTable } from './employeeTable.js';
import { Roles } from './handleRoles.js';
let employeeTable = new EmployeeTable();
let populate = new Populate();
let storage = new Storage();
let role = new Roles();
let locationInputs = document.getElementById(`location-filter`).querySelectorAll("input");
let statusInputs = document.getElementById(`status-filter`)?.querySelectorAll("input");
let departmentInputs = document.getElementById(`department-filter`).querySelectorAll("input");
let filterIcon = document.getElementById('filter-icon');
let allAlphabets = document.querySelector('.a-to-z-filter')?.querySelectorAll('div:not(:first-child)');
let rows = storage.employeesDetails('employeesTableDetail');
class checkFilters {
    applyFilter(event) {
        let selectedFilters, filterParameters = [];
        selectedFilters = Array.from(locationInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join(''));
        selectedFilters.length == 0 ? filterParameters.push('location') : filterParameters.push(...selectedFilters);
        selectedFilters = Array.from(statusInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join(''));
        selectedFilters.length == 0 ? filterParameters.push('status') : filterParameters.push(...selectedFilters);
        selectedFilters = Array.from(departmentInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join(''));
        selectedFilters.length == 0 ? filterParameters.push('department') : filterParameters.push(...selectedFilters);
        if (event.classList.contains('selected') && !event.classList.contains('apply-btn')) {
            allAlphabets.forEach(x => x.classList.remove('selected'));
            filterIcon.classList.remove('selected');
        }
        else if (!event.classList.contains('apply-btn')) {
            allAlphabets.forEach(x => x.classList.remove('selected'));
            event.classList.add('selected');
            filterIcon.classList.add('selected');
        }
        const selectedAlphabet = Array.from(allAlphabets).filter(elem => elem.classList.contains('selected'));
        let letter = (selectedAlphabet.length != 0) ? selectedAlphabet[0].textContent : '';
        let filteredEmployees = [];
        let status, location, department, alphabet;
        for (var i = 0; i < rows.length; i++) {
            alphabet = letter == '' ? true : rows[i].name.trim().toUpperCase()[0] === letter;
            status = filterParameters.includes(rows[i].status.trim().toLowerCase()) || filterParameters.includes('status');
            department = filterParameters.includes(rows[i].dept.trim().toLowerCase().split(' ').join('')) || filterParameters.includes('department');
            location = filterParameters.includes(rows[i].location.trim().toLowerCase()) || filterParameters.includes('location');
            if (status && location && department && alphabet) {
                filteredEmployees.push(rows[i]);
            }
        }
        populate.populateFilteredTable(filteredEmployees);
    }
}
let checkFilter = new checkFilters();
export class Filter {
    resetFilter() {
        document.querySelector("#status-filter .status-dropdown").classList.add('hide');
        document.querySelector("#department-filter .department-dropdown").classList.add('hide');
        document.querySelector("#location-filter .location-dropdown").classList.add('hide');
        let allAlphabets = document.querySelector('.a-to-z-filter').querySelectorAll('div:not(:first-child)');
        let filterIcon = document.getElementById('filter-icon');
        let input = document.querySelectorAll('.filter-options-container input');
        input.forEach((element) => { element.checked = false; });
        populate.unpopulateTable();
        populate.populateTable();
        storage.resetFilterStorage();
        allAlphabets.forEach(x => x.classList.remove('selected'));
        filterIcon.classList.remove('selected');
        employeeTable.checkdisableFilterButton();
    }
    selectFilter(event) {
        let currentElement = this;
        let checkbox = currentElement.querySelector('input');
        const element = event.target;
        if (element == checkbox)
            return;
        checkbox.checked = !checkbox.checked;
    }
    displayFilterDropdown() {
        let filters = [...document.querySelectorAll('.filter>:first-child')];
        filters.forEach((child) => {
            child.addEventListener('click', function () {
                document.querySelector(`#${this.parentElement.id.split('-')[0]}-filter .${this.parentElement.id.split('-')[0]}-dropdown`).classList.toggle('hide');
            });
        });
    }
    applyEmployeesFilter() {
        const alphabets = document.querySelector('.a-to-z-filter').querySelectorAll('div:not(:first-child)');
        let nodes = [...alphabets];
        nodes.push(document.querySelector('.apply-btn'));
        nodes.forEach((child) => {
            child.addEventListener('click', function () {
                checkFilter.applyFilter(this);
            });
        });
    }
}
export class RoleFilter {
    applyRoleFilter() {
        let selectedFilters, filterParameters = [];
        selectedFilters = Array.from(locationInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join(''));
        selectedFilters.length == 0 ? filterParameters.push('location') : filterParameters.push(...selectedFilters);
        selectedFilters = Array.from(departmentInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join(''));
        selectedFilters.length == 0 ? filterParameters.push('department') : filterParameters.push(...selectedFilters);
        const roles = JSON.parse(sessionStorage.getItem('rolesDetail'));
        let location, department;
        let filteredRoles = [];
        roles.forEach((role) => {
            department = filterParameters.includes(role.dept.trim().toLowerCase().split(' ').join('')) || filterParameters.includes('department');
            location = filterParameters.includes(role.location.trim().toLowerCase()) || filterParameters.includes('location');
            if (location && department) {
                filteredRoles.push(role);
            }
        });
        role.unpoplateRoles();
        storage.populateFilteredRoles(filteredRoles);
    }
    applyRoleReset() {
        let input = document.querySelectorAll('.filter-options-container input');
        input.forEach((element) => { element.checked = false; });
        document.querySelector("#department-filter .department-dropdown").classList.add('hide');
        document.querySelector("#location-filter .location-dropdown").classList.add('hide');
        role.unpoplateRoles();
        role.populateRoles();
        employeeTable.checkdisableFilterButton();
    }
}

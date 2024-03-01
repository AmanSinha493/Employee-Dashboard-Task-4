import { Populate } from './populate.js';
import { Storage } from './handleStorage.js';
import { EmployeeTable } from './common.js';
import { Roles } from './handleRoles.js';
import { filterParameters } from './common.js';
let employeeTable = new EmployeeTable();
let populate = new Populate();
let storage = new Storage();
let role = new Roles();
class checkFilters {
    constructor() {
        this.checkFilter = this.checkFilter.bind(this);
    }
    checkFilter(employee, filterType) {
        const filterInputs = document.getElementById(`${filterType}-filter`).querySelectorAll("input");
        const selectedFilters = [];
        filterInputs.forEach(input => {
            if (input.checked) {
                const filterText = input.parentElement?.textContent?.toLowerCase().split(' ').join('');
                selectedFilters.push(filterText);
            }
        });
        if (selectedFilters.length === 0) {
            return true;
        }
        const employeeFilter = employee.toLowerCase().split(' ').join('');
        return selectedFilters.includes(employeeFilter);
    }
    applyFilter(event) {
        ;
        let filterParam = filterParameters(); // filter parameters
        if (event.classList.contains('selected') && !event.classList.contains('apply-btn')) {
            filterParam.allAlphabets.forEach(x => x.classList.remove('selected'));
            filterParam.filterIcon.classList.remove('selected');
        }
        else if (!event.classList.contains('apply-btn')) {
            filterParam.allAlphabets.forEach(x => x.classList.remove('selected'));
            event.classList.add('selected');
            filterParam.filterIcon.classList.add('selected');
        }
        const selectedAlphabet = Array.from(filterParam.allAlphabets).filter(elem => elem.classList.contains('selected'));
        let letter = (selectedAlphabet.length != 0) ? selectedAlphabet[0].textContent : '';
        let filteredEmployees = [];
        let status, location, department, alphabet;
        let rows = storage.employeesDetails('employeesTableDetail');
        for (var i = 0; i < rows.length; i++) {
            alphabet = letter == '' ? true : rows[i].name.trim().toUpperCase()[0] === letter;
            status = filterParam.allfilters.includes(rows[i].status.trim().toLowerCase()) || filterParam.allfilters.includes('status');
            department = filterParam.allfilters.includes(rows[i].dept.trim().toLowerCase().split(' ').join('')) || filterParam.allfilters.includes('department');
            location = filterParam.allfilters.includes(rows[i].location.trim().toLowerCase()) || filterParam.allfilters.includes('location');
            if (status && location && department && alphabet) {
                filteredEmployees.push(rows[i]);
            }
        }
        populate.populateFilteredTable(filteredEmployees);
    }
}
let checkFilter = new checkFilters();
export class Filter {
    constructor() {
    }
    ;
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
    applyAllFilter() {
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
        let roles = JSON.parse(sessionStorage.getItem('rolesDetail') || 'null');
        let location, department;
        let filteredRoles = [];
        for (let i = 0; i < roles.length; i++) {
            location = checkFilter.checkFilter(roles[i][1].employees[0].location, 'location');
            department = checkFilter.checkFilter(roles[i][1].employees[0].dept, 'department');
            if (location && department) {
                filteredRoles.push(roles[i]);
            }
        }
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

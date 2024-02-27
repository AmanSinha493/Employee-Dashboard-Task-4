import { Populate } from './populate.js';
import { Storage } from './handleStorage.js';
import { EmployeeTable } from './script.js';
let employeeTable = new EmployeeTable();
let populate = new Populate();
let storage = new Storage();
class seperateFilters {
    applyAlphabeticFilter(event) {
        let alphabetFilterParent = document.querySelector('.a-to-z-filter');
        let allAlphabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)');
        let filterIcon = document.getElementById('filter-icon');
        let filteredEmployees = [];
        if (event.classList.contains('selected')) {
            allAlphabets.forEach(x => x.classList.remove('selected'));
            filterIcon.classList.remove('selected');
            storage.resetFilterStorage();
            populate.populateTable();
            return;
        }
        let input = event.textContent;
        let rows = storage.employeesDetails('employeesTableDetail');
        let profileName;
        for (let i = 0; i < rows.length; i++) {
            profileName = rows[i].name.trim().toUpperCase();
            if (profileName[0].toUpperCase() == input) {
                filteredEmployees.push(rows[i]);
            }
        }
        allAlphabets.forEach(x => x.classList.remove('selected'));
        event.classList.add('selected');
        filterIcon.classList.add('selected');
        populate.populateFilteredTable(filteredEmployees);
    }
    toggleFilter(filterId) {
        const filter = document.querySelector(`#${filterId}-filter .${filterId}-dropdown`);
        filter.classList.toggle('hide');
    }
}
let seperateFiltersObj = new seperateFilters();
export class Filter {
    constructor() { }
    ;
    setAlphabeticFilter() {
        const alphabetFilterParent = document.querySelector('.a-to-z-filter');
        const alphabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)');
        alphabets.forEach((child) => {
            child.addEventListener('click', function () {
                seperateFiltersObj.applyAlphabeticFilter(this);
            });
        });
    }
    displayStatusFilter() {
        seperateFiltersObj.toggleFilter('status');
    }
    displayLocationFilter() {
        seperateFiltersObj.toggleFilter('location');
    }
    displayDepartmentFilter() {
        seperateFiltersObj.toggleFilter('department');
    }
    applyFilter() {
        let filteredEmployees = [];
        let status, location, department;
        let rows = storage.employeesDetails('employeesTableDetail');
        for (var i = 1; i < rows.length; i++) {
            status = checkStatusFilter(rows[i].status);
            location = checkLocationFilter(rows[i].location);
            department = checkDepartmentFilter(rows[i].dept);
            if (status && location && department) {
                filteredEmployees.push(rows[i]);
            }
        }
        populate.populateFilteredTable(filteredEmployees);
    }
    resetFilter() {
        var status = document.querySelector("#status-filter .status-dropdown");
        var department = document.querySelector("#department-filter .department-dropdown");
        var location = document.querySelector("#location-filter .location-dropdown");
        let alphabetFilterParent = document.querySelector('.a-to-z-filter');
        let allAlphabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)');
        let filterIcon = document.getElementById('filter-icon');
        if (!status.classList.contains('hide'))
            status.classList.add('hide');
        if (!department.classList.contains('hide'))
            department.classList.add('hide');
        if (!location.classList.contains('hide'))
            location.classList.add('hide');
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
        if (checkbox.checked)
            checkbox.checked = false;
        else
            checkbox.checked = true;
    }
}
function checkFilter(employee, filterType) {
    const filterElement = document.getElementById(`${filterType}-filter`);
    const filterInputs = filterElement.querySelectorAll("input");
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
function checkStatusFilter(employee) {
    return checkFilter(employee, 'status');
}
function checkLocationFilter(employee) {
    return checkFilter(employee, 'location');
}
function checkDepartmentFilter(employee) {
    return checkFilter(employee, 'department');
}

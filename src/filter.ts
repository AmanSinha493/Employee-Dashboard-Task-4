
import { Populate } from './populate.js';
import { Storage } from './handleStorage.js';
import { EmployeeTable } from './employeeTable.js';
import { Roles } from './handleRoles.js';
import { Role } from './dataType.js';
let employeeTable = new EmployeeTable();
let populate = new Populate();
let storage = new Storage()
let role = new Roles();
let locationInputs = document.getElementById(`location-filter`)!.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
let statusInputs = document.getElementById(`status-filter`)?.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
let departmentInputs = document.getElementById(`department-filter`)!.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
let filterIcon = document.getElementById('filter-icon') as HTMLImageElement;
let allAlphabets = (document.querySelector('.a-to-z-filter') as HTMLElement)?.querySelectorAll('div:not(:first-child)') as NodeListOf<HTMLElement>;
let rows = storage.employeesDetails('employeesTableDetail')!;

class checkFilters {

    applyFilter(event: HTMLElement) {
        let selectedFilters: string[], filterParameters: string[] = [];
        selectedFilters = Array.from(locationInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join('')!);
        selectedFilters.length == 0 ? filterParameters.push('location') : filterParameters.push(...selectedFilters);
        selectedFilters = Array.from(statusInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join('')!);
        selectedFilters.length == 0 ? filterParameters.push('status') : filterParameters.push(...selectedFilters);
        selectedFilters = Array.from(departmentInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join('')!);
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
        let letter = (selectedAlphabet.length != 0) ? selectedAlphabet[0].textContent! : '';
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
    resetFilter(): void {
        (document.querySelector("#status-filter .status-dropdown")! as HTMLElement).classList.add('hide');
        (document.querySelector("#department-filter .department-dropdown")! as HTMLElement).classList.add('hide');
        (document.querySelector("#location-filter .location-dropdown")! as HTMLElement).classList.add('hide');
        let allAlphabets = (document.querySelector('.a-to-z-filter') as HTMLElement).querySelectorAll('div:not(:first-child)') as NodeListOf<HTMLElement>;
        let filterIcon = document.getElementById('filter-icon') as HTMLImageElement;
        let input = document.querySelectorAll('.filter-options-container input') as NodeListOf<HTMLInputElement>;
        input.forEach((element) => { element.checked = false });
        populate.unpopulateTable()
        populate.populateTable();
        storage.resetFilterStorage();
        allAlphabets.forEach(x => x.classList.remove('selected'));
        filterIcon.classList.remove('selected');
        employeeTable.checkdisableFilterButton();
    }
    selectFilter(this: any, event: any): void {
        let currentElement: HTMLElement = this;
        let checkbox = currentElement.querySelector('input') as HTMLInputElement;
        const element = event.target;
        if (element == checkbox) return;
        checkbox.checked = !checkbox.checked;
    }
    displayFilterDropdown() {
        let filters = [...document.querySelectorAll('.filter>:first-child') as NodeListOf<HTMLElement>];
        filters.forEach((child: HTMLElement): void => {
            child.addEventListener('click', function (this: HTMLElement): void {
                document.querySelector(`#${this.parentElement!.id.split('-')[0]}-filter .${this.parentElement!.id.split('-')[0]}-dropdown`)!.classList.toggle('hide');
            });
        });
    }
    applyEmployeesFilter() {
        const alphabets = (document.querySelector('.a-to-z-filter') as HTMLElement).querySelectorAll('div:not(:first-child)') as NodeListOf<HTMLElement>;
        let nodes: HTMLElement[] = [...alphabets]
        nodes.push(document.querySelector('.apply-btn')!)
        nodes.forEach((child: HTMLElement): void => {
            child.addEventListener('click', function (this: HTMLElement): void {
                checkFilter.applyFilter(this);
            });
        });
    }
}

export class RoleFilter {
    applyRoleFilter(): void {
        let selectedFilters: string[], filterParameters: string[] = [];
        selectedFilters = Array.from(locationInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join('')!);
        selectedFilters.length == 0 ? filterParameters.push('location') : filterParameters.push(...selectedFilters);
        selectedFilters = Array.from(departmentInputs).filter(input => input.checked).map(input => input.parentElement?.textContent?.toLowerCase().split(' ').join('')!);
        selectedFilters.length == 0 ? filterParameters.push('department') : filterParameters.push(...selectedFilters);
        const roles: Role[] = JSON.parse(sessionStorage.getItem('rolesDetail')!);
        let location, department;
        let filteredRoles: Role[] = [];
        roles.forEach((role)=>{
                department = filterParameters.includes(role.dept.trim().toLowerCase().split(' ').join('')) || filterParameters.includes('department');
                location = filterParameters.includes(role.location.trim().toLowerCase()) || filterParameters.includes('location');
                if (location && department) {
                    filteredRoles.push(role);
                }
        }) 
        role.unpoplateRoles();
        storage.populateFilteredRoles(filteredRoles);
    }
    applyRoleReset(): void {
        let input = document.querySelectorAll('.filter-options-container input') as NodeListOf<HTMLInputElement>;
        input.forEach((element) => { element.checked = false });
        (document.querySelector("#department-filter .department-dropdown")! as HTMLElement).classList.add('hide');
        (document.querySelector("#location-filter .location-dropdown")! as HTMLElement).classList.add('hide');
        role.unpoplateRoles();
        role.populateRoles();
        employeeTable.checkdisableFilterButton();
    }
}

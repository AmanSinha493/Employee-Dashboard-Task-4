
import { Populate } from './populate.js';
import { Storage } from './handleStorage.js';
import { EmployeeTable } from './common.js';
import { Roles } from './handleRoles.js';
import { roleData } from './dataType.js';
import { filterParameters } from './common.js';

let employeeTable = new EmployeeTable();
let populate = new Populate();
let storage = new Storage()
let role = new Roles();

class checkFilters {
    constructor() {
        this.checkFilter = this.checkFilter.bind(this);
    }
    checkFilter(employee: string, filterType: string): boolean {
        const filterInputs = document.getElementById(`${filterType}-filter`)!.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
        const selectedFilters: string[] = [];
        filterInputs.forEach(input => {
            if (input.checked) {
                const filterText = input.parentElement?.textContent?.toLowerCase().split(' ').join('')!;
                selectedFilters.push(filterText);
            }
        });
        if (selectedFilters.length === 0) {
            return true;
        }
        const employeeFilter = employee.toLowerCase().split(' ').join('');
        return selectedFilters.includes(employeeFilter);
    }
    applyFilter(event: HTMLElement) {;
        let filterParam = filterParameters();       // filter parameters
        if (event.classList.contains('selected') && !event.classList.contains('apply-btn')) {
            filterParam. allAlphabets.forEach(x => x.classList.remove('selected'));
            filterParam.filterIcon.classList.remove('selected');
        }
        else if (!event.classList.contains('apply-btn')) {
            filterParam. allAlphabets.forEach(x => x.classList.remove('selected'));
            event.classList.add('selected');
            filterParam.filterIcon.classList.add('selected');
        }
        const selectedAlphabet = Array.from(filterParam.allAlphabets).filter(elem => elem.classList.contains('selected'));
        let letter = (selectedAlphabet.length != 0) ? selectedAlphabet[0].textContent! : '';
        let filteredEmployees = [];
        let status, location, department, alphabet;
        let rows = storage.employeesDetails('employeesTableDetail')!;
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
    };
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
    applyAllFilter() {
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
        let roles: roleData[] = JSON.parse(sessionStorage.getItem('rolesDetail') || 'null')
        let location, department;
        let filteredRoles: roleData[] = [];
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


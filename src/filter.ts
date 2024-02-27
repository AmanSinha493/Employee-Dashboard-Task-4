
import { EmployeeData } from './employee.js';
import { Populate } from './populate.js';
import { Storage } from './handleStorage.js';
import { EmployeeTable } from './script.js';
let employeeTable =new EmployeeTable();
let populate = new Populate();
let storage = new Storage()

class seperateFilters{
    applyAlphabeticFilter(event: HTMLElement): void {
        let alphabetFilterParent = document.querySelector('.a-to-z-filter') as HTMLElement;
        let allAlphabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)') as NodeListOf<HTMLElement>;
        let filterIcon = document.getElementById('filter-icon') as HTMLImageElement;
        let filteredEmployees = [];
        if (event.classList.contains('selected')) {
            allAlphabets.forEach(x => x.classList.remove('selected'));
            filterIcon.classList.remove('selected');
            storage.resetFilterStorage();
            populate.populateTable();
            return;
        }
        let input = event.textContent;
        let rows: EmployeeData[] = storage.employeesDetails('employeesTableDetail')!;
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
    
    toggleFilter(filterId: string): void {
        const filter = document.querySelector(`#${filterId}-filter .${filterId}-dropdown`) as HTMLElement;
        filter.classList.toggle('hide');
    }
    
}

let  seperateFiltersObj=new seperateFilters();


export class Filter {
    constructor() { };

    setAlphabeticFilter(): void {
        const alphabetFilterParent = document.querySelector('.a-to-z-filter') as HTMLElement;
        const alphabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)') as NodeListOf<HTMLElement>;
        alphabets.forEach((child: HTMLElement): void => {
            child.addEventListener('click', function(this: HTMLElement): void {
                seperateFiltersObj.applyAlphabeticFilter(this);
            });
        });
    }
    
    displayStatusFilter(): void {
        seperateFiltersObj.toggleFilter('status');
    }

    displayLocationFilter(): void {
        seperateFiltersObj.toggleFilter('location');
    }

    displayDepartmentFilter(): void {
        seperateFiltersObj.toggleFilter('department');
    }

    applyFilter():void {
        let filteredEmployees = [];
        let status, location, department;
        let rows = storage.employeesDetails('employeesTableDetail')!;
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
    resetFilter():void {
        var status = document.querySelector("#status-filter .status-dropdown")! as HTMLElement;
        var department = document.querySelector("#department-filter .department-dropdown")! as HTMLElement;
        var location = document.querySelector("#location-filter .location-dropdown")! as HTMLElement;
        let alphabetFilterParent = document.querySelector('.a-to-z-filter') as HTMLElement;
        let allAlphabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)') as NodeListOf<HTMLElement>;
        let filterIcon = document.getElementById('filter-icon') as HTMLImageElement;
        if (!status.classList.contains('hide'))
            status.classList.add('hide');
        if (!department.classList.contains('hide'))
            department.classList.add('hide');
        if (!location.classList.contains('hide'))
            location.classList.add('hide');
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
        if (element == checkbox)
            return;
        if (checkbox.checked)
            checkbox.checked = false;
        else
            checkbox.checked = true;
    }
}

function checkFilter(employee: string, filterType: string):boolean {
    const filterElement = document.getElementById(`${filterType}-filter`)!;
    const filterInputs = filterElement.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
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

function checkStatusFilter(employee: string) {
    return checkFilter(employee, 'status');
}

function checkLocationFilter(employee: string) {
    return checkFilter(employee, 'location');
}

function checkDepartmentFilter(employee: string) {
    return checkFilter(employee, 'department');
}

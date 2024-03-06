import { EmployeeData } from './dataType.js';
import { Populate } from './populate.js';
import { Storage } from './handleStorage.js';
import { AddEmployee } from "./handleForms.js";
import { EmployeeModal } from "./handleForms.js";
// import { Role } from './dataType.js';



export class Collapse {
    public isCollapsed: boolean = true;
    sideBar() {
        const icon = document.querySelector(".collapse-btn")! as HTMLButtonElement;
        const mainBody = document.getElementById("main-body")! as HTMLElement;
        const sideBar = document.querySelector('.side-bar')! as HTMLElement;
        const collapsedSideBar = document.querySelector('.side-bar-collapsed')! as HTMLElement;
        if (!this.isCollapsed) {
            collapsedSideBar.classList.remove('hide');
            sideBar.classList.add('hide');
            mainBody.style.gridTemplateColumns = "1fr 15fr";
            icon.classList.add('collapsed');

        }
        else {
            mainBody.style.gridTemplateColumns = "1fr 5fr";
            collapsedSideBar.classList.add('hide');
            sideBar.classList.remove('hide');
            icon.classList.remove('collapsed');

        }
        this.isCollapsed = !this.isCollapsed;
    }
}

export class EmployeeTable {
    constructor() {
        this.showToaster = this.showToaster.bind(this);
        this.checkForEditChanges = this.checkForEditChanges.bind(this);
    };
    toggleEditOption(event: any) {
        let threeDots = event.target;
        let allEllipsisMenu = threeDots.parentElement.querySelector(`.ellipsis-menu`);
        if (!allEllipsisMenu) return;
        allEllipsisMenu.classList.toggle('hide-ellipsis-menu');
        document.addEventListener('click', (event) => {
            if (!allEllipsisMenu.contains(event.target) && event.target !== threeDots) {
                allEllipsisMenu.style.display = 'none';
            } else {
                allEllipsisMenu.style.display = '';
            }
        });
    }

    searchBar(): void {
        let searchInput = (document.querySelector(".search-input input") as HTMLInputElement).value;
        searchInput = searchInput.split(' ').join('').toLowerCase();
        let table = document.querySelector(".employee-table tbody")! as HTMLTableElement;
        for (let i = 0; i < table.rows.length; i++) {
            let row = table.rows[i]! as HTMLTableRowElement;
            let name = row.cells[1].textContent!.toLowerCase();
            let location = row.cells[2].textContent!.toLowerCase();
            let dept = row.cells[3].textContent!.toLowerCase();
            let role = row.cells[4].textContent!.toLowerCase();
            if (name.includes(searchInput) || location.includes(searchInput) || dept.includes(searchInput) || role.includes(searchInput)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }

    activateDeleteButton() {
        let deleteBtn = document.querySelector(".delete-btn") as HTMLButtonElement;
        let checkBoxes = document.querySelectorAll('.check-box-col input') as NodeListOf<HTMLInputElement>;
        let isAnyChecked = (checkBoxes: any[]) => checkBoxes.some(checkbox => checkbox.checked);
        let result = isAnyChecked(Array.from(checkBoxes));
        deleteBtn.disabled = !result;
    }

    toggleStatus(this: HTMLButtonElement): void {
        if (this.textContent?.toUpperCase() != "ACTIVE") {
            this.classList.add('btn-active');
            this.textContent = 'Active';
            this.classList.remove('btn-inactive');
        }
        else {
            this.classList.remove('btn-active');
            this.textContent = "Inactive";
            this.classList.add('btn-inactive');
        }
    }

    selectFilter(this: any, event: Event) {
        let checkbox = this.querySelector('input');
        const element = event.target;
        if (element == checkbox)
            return;
        if (checkbox.checked)
            checkbox.checked = false;
        else
            checkbox.checked = true;
    }

    disableFilterButton() {
        let input = document.querySelectorAll('.filter-options-container')! as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < input.length; i++) {
            input[i].addEventListener('click', this.checkdisableFilterButton);
        }
    }

    checkdisableFilterButton() {
        let input = document.querySelectorAll('.filter-options-container input') as NodeListOf<HTMLInputElement>;
        let count = Array.from(input).filter(input => input.checked).length;
        document.querySelector('.apply-btn')!.classList.toggle('active', count > 0);;
        document.querySelector('.reset-btn')!.classList.toggle('active', count > 0);;
    }
    hidePopUp() {
        let popup = document.querySelector('.toast');
        if (popup)
            popup.remove();
    }

    showToaster(message: string, isSuccessful: boolean = true) {
        let staus = isSuccessful ? "tick" : "cross";
        let statusClass = isSuccessful ? "success" : "fail";
        let toastDiv = `<div class="toast flex-container ${statusClass}">
            <div class="toast-tick-container flex-container ${statusClass}"><img src="../../assets/${staus}.svg" alt="tick"></div>
            <span>${message}</span>
         </div>`;
        const range = document.createRange();
        const fragment = range.createContextualFragment(toastDiv);
        // document.addEventListener('click', hidePopUp);
        setTimeout(() => {
            this.hidePopUp();
        }, 3000);
        let body = document.querySelector(".employees-detail");
        if (body) {
            body.appendChild(fragment);
        }
    }
    checkForEditChanges(event: Event) {
        let addEmp = new AddEmployee();
        let modal = new EmployeeModal();
        let x = this.checkForChanges(event);
        if (!x)
            modal.closeAddEmployeeModal();
        else
            addEmp.openEditConfirmation();
    }

    checkForChanges(event: Event): boolean {
        let storage = new Storage();
        console.log(this);
        console.log(event.currentTarget);
        event.preventDefault();
        const employees: EmployeeData[] = storage.employeesDetails('employeesTableDetail')!;
        const form = document.getElementById("employeeForm") as HTMLFormElement;
        const formData = new FormData(form);
        const { empNo, firstName, lastName, email, joiningDate, location, jobTitle, department, mobileNumber } = Object.fromEntries(formData);
        console.log({ empNo, firstName, lastName, email, joiningDate, location, jobTitle, department, mobileNumber });
        const employee: EmployeeData | undefined = employees.find(emp => emp.empNo === empNo)!;
        let changesDetected: boolean = false

        if (((event.currentTarget as HTMLElement).classList.contains('edit') && !employee) || ((event.currentTarget as HTMLElement).classList.contains('view')))
            return false;
        else if ((event.currentTarget as HTMLElement).classList.contains('edit')) {
            changesDetected = (
                firstName !== employee.name.split(' ')[0] ||
                lastName !== employee.name.split(' ').slice(1).join(' ') ||
                email !== employee.email ||
                (joiningDate as string).split('-').reverse().join('/') !== employee.joinDate ||
                location !== employee.location ||
                jobTitle !== employee.role ||
                department !== employee.dept ||
                mobileNumber !== employee.mobile
            );
        }
        else {
            changesDetected = (
                firstName !== "" ||
                lastName !== "" ||
                email !== "" ||
                (joiningDate as string).split('-').reverse().join('/') !== "" ||
                location !== "" ||
                jobTitle !== "" ||
                department !== "" ||
                mobileNumber !== ""
            );
        }
        return changesDetected;
    }
}

export class ExportCsv {
    constructor() {
        this.tableToCSV = this.tableToCSV.bind(this);
    };
    tableToCSV(): void {
        let storage = new Storage();

        let employees: EmployeeData[] = storage.employeesDetails('FilteredEmployeesDetail')!;
        let csvContent = this.arrayToCSV(employees);
        this.downloadCSVFile(csvContent);
    }
    arrayToCSV(objArray: EmployeeData[]): string {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let headers: string[] = Object.keys(array[0]).filter(header => (header !== "img" && header !== "mobile"))!;
        let str = '"NAME","EMAIL","LOCATION","DEPARTMENT","ROLE","EMPLOYEE NO","STATUS","JOIN-DATE"\r\n';
        return array.reduce((str: string, next: EmployeeData) => {
            str += `${headers.map(header => `"${next[header as keyof EmployeeData]}"`).join(",")}\r\n`;
            return str;
        }, str);
    }

    downloadCSVFile(csv_data: string): void {
        let CSVFile = new Blob([csv_data], { type: "text/csv" });
        let temp_link = document.createElement('a');
        temp_link.download = "employeeTable.csv";
        let url = window.URL.createObjectURL(CSVFile);
        temp_link.href = url;
        temp_link.style.display = "none";
        document.body.appendChild(temp_link);
        temp_link.click();
        document.body.removeChild(temp_link);
    }
}

export class SortTable {
    private asc: boolean = false;
    constructor() { };
    sortEmployeeTable(this: any) {
        let tableHeaders = document.querySelectorAll('#employee-table th') as NodeListOf<HTMLTableColElement>;
        for (let i = 1; i < tableHeaders.length - 1; i++) {
            tableHeaders[i].addEventListener("click", this.sortColumn.bind(this, tableHeaders[i]));
        }
    }
    sortColumn(this: any, column: HTMLTableColElement) {
        let storage = new Storage();
        let populate = new Populate();
        let employees: EmployeeData[] = storage.employeesDetails('employeesTableDetail')!;
        let value = column.textContent?.trim().split(" ").join("").toLowerCase();
        let columnName = ""
        switch (value) {
            case "user": columnName = "name";
                break;
            case "location": columnName = "location";
                break;
            case "department": columnName = "dept";
                break;
            case "role": columnName = "role";
                break;
            case "empno": columnName = "empNo";
                break;
            case "joindt": columnName = "joinDate";
                break;
            case "status": columnName = "status";
        }
        this.sortArrayByKey(employees, columnName);
        sessionStorage.setItem("employeesTableDetail", JSON.stringify(employees));
        populate.unpopulateTable();
        populate.populateTable();
        this.asc = !this.asc;
    }

    sortArrayByKey(arr: EmployeeData[], key: string) {
        return arr.sort((a, b) => {
            const x = a[key as keyof EmployeeData]!;
            const y = b[key as keyof EmployeeData]!;
            if (!this.asc) {
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
            }
            else {
                if (x > y) {
                    return -1;
                }
                if (x < y) {
                    return 1;
                }
            }
            return 0;
        });
    }
}





import { Populate } from './populate.js';
import { Storage } from './handleStorage.js';
// let populate = new Populate();
let storage = new Storage();
export class Collapse {
    constructor() {
        this.isCollapsed = true;
    }
    sideBar() {
        const icon = document.querySelector(".collapse-btn");
        const mainBody = document.getElementById("main-body");
        const sideBar = document.querySelector('.side-bar');
        const collapsedSideBar = document.querySelector('.side-bar-collapsed');
        if (!this.isCollapsed) {
            collapsedSideBar.classList.remove('hide');
            sideBar.classList.add('hide');
            mainBody.style.gridTemplateColumns = "1fr 15fr";
            icon.style.transform = "rotate(180deg)";
            icon.style.marginLeft = "1%";
        }
        else {
            mainBody.style.gridTemplateColumns = "1fr 5fr";
            icon.style.transform = "rotate(0deg)";
            collapsedSideBar.classList.add('hide');
            sideBar.classList.remove('hide');
            icon.style.marginLeft = "0%";
        }
        this.isCollapsed = !this.isCollapsed;
    }
}
export class EmployeeTable {
    constructor() { }
    ;
    toggleEditOption(event) {
        let threeDots = event.target;
        let allEllipsisMenu = threeDots.parentElement.querySelector(`.ellipsis-menu`);
        if (!allEllipsisMenu)
            return;
        allEllipsisMenu.classList.toggle('hide-ellipsis-menu');
        document.addEventListener('click', (event) => {
            if (!allEllipsisMenu.contains(event.target) && event.target !== threeDots) {
                allEllipsisMenu.style.display = 'none';
            }
            else {
                allEllipsisMenu.style.display = '';
            }
        });
    }
    ellipsisDelete() {
        this.parentNode.parentNode.parentNode.querySelector('.check-box-col input').checked = true;
        this.openDeleteConfirmation();
    }
    searchBar() {
        let searchInput = document.querySelector(".search-input input").value;
        searchInput = searchInput.split(' ').join('').toLowerCase();
        let table = document.querySelector(".employee-table tbody");
        for (let i = 0; i < table.rows.length; i++) {
            let row = table.rows[i];
            let name = row.cells[1].textContent;
            if (name != null) {
                name = name.split(" ").join("").toLowerCase().trim();
                if (!name.startsWith(searchInput)) {
                    row.style.display = "none";
                }
                else {
                    row.style.display = "";
                }
            }
        }
    }
    activateDeleteButton() {
        let deleteBtn = document.querySelector(".delete-btn");
        let checkBoxes = document.querySelectorAll('.check-box-col input');
        let isAnyChecked = (checkBoxes) => checkBoxes.some(checkbox => checkbox.checked);
        let result = isAnyChecked(Array.from(checkBoxes));
        deleteBtn.disabled = !result;
    }
    toggleStatus() {
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
    selectFilter(event) {
        console.log(event);
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
        let input = document.querySelectorAll('.filter-options-container');
        for (let i = 0; i < input.length; i++) {
            input[i].addEventListener('click', this.checkdisableFilterButton);
        }
    }
    checkdisableFilterButton() {
        let input = document.querySelectorAll('.filter-options-container input');
        let applyButton = document.querySelector('.apply-btn');
        let resetButton = document.querySelector('.reset-btn');
        let count = Array.from(input).filter(input => input.checked).length;
        applyButton.classList.toggle('active', count > 0);
        resetButton.classList.toggle('active', count > 0);
    }
}
export class ExportCsv {
    constructor() { }
    ;
    tableToCSV() {
        let employees = storage.employeesDetails('FilteredEmployeesDetail');
        let csvContent = arrayToCSV(employees);
        downloadCSVFile(csvContent);
    }
}
function arrayToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let headers = Object.keys(array[0]).filter(header => (header !== "img" && header !== "mobile"));
    let str = '"NAME","EMAIL","LOCATION","DEPARTMENT","ROLE","EMPLOYEE NO","STATUS","JOIN-DATE"\r\n';
    return array.reduce((str, next) => {
        str += `${headers.map(header => `"${next[header]}"`).join(",")}\r\n`;
        return str;
    }, str);
}
function downloadCSVFile(csv_data) {
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
export class SortTable {
    constructor() { }
    ;
    sortEmployeeTable() {
        let tableHeaders = document.querySelectorAll('#employee-table th');
        for (let i = 1; i < tableHeaders.length - 1; i++) {
            tableHeaders[i].addEventListener("click", sortColumn.bind(this, tableHeaders[i]));
        }
    }
}
let asc = false;
function sortColumn(column) {
    let populate = new Populate();
    let employees = storage.employeesDetails('employeesTableDetail');
    let value = column.textContent?.trim().split(" ").join("").toLowerCase();
    let columnName = "";
    switch (value) {
        case "user":
            columnName = "name";
            break;
        case "location":
            columnName = "location";
            break;
        case "department":
            columnName = "dept";
            break;
        case "role":
            columnName = "role";
            break;
        case "empno":
            columnName = "empNo";
            break;
        case "joindt":
            columnName = "joinDate";
            break;
        case "status": columnName = "status";
    }
    sortArrayByKey(employees, columnName);
    sessionStorage.setItem("employeesTableDetail", JSON.stringify(employees));
    populate.unpopulateTable();
    populate.populateTable();
    asc = !asc;
}
function sortArrayByKey(arr, key) {
    return arr.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        if (!asc) {
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

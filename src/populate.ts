import { EmployeeData } from './dataType.js';
import { Storage } from './handleStorage.js';
import { AddEmployee } from './handleForms.js';
import { EmployeeTable } from './employeeTable.js';


export class Populate {
    private addEmployee = new AddEmployee();
    private employeeTable = new EmployeeTable();
    constructor() {
        this.deleteRow = this.deleteRow.bind(this);
        this.selectAllRow = this.selectAllRow.bind(this);
    };
    populateTable(): void {
        const employees: EmployeeData[] | null = JSON.parse(sessionStorage.getItem('employeesTableDetail') || 'null');
        if (employees && employees.length > 0) {
            employees.forEach(employee => {
                this.addRow(employee);
            });
        } else {
            console.log('No employee data available.');
        }
        this.addEventsOnRows();
    }

    unpopulateTable(): void {
        document.querySelector('tbody')!.innerHTML = '';
    }

    openDeleteConfirmation(): void {
        var deleteConfirmation = document.getElementsByClassName('delete-confirmation')[0];
        deleteConfirmation.classList.add('show-delete-confirmation');
    }
    closeDeleteConfirmation(): void {
        var deleteConfirmation = document.getElementsByClassName('delete-confirmation')[0];
        deleteConfirmation.classList.remove('show-delete-confirmation');
    }
    ellipsisDelete(this: any) {
        this.parentNode.parentNode.parentNode.querySelector('.check-box-col input').checked = true;
        document.querySelector('.delete-confirmation')?.classList.add('show-delete-confirmation');
    }
    addRow(employee: EmployeeData) {
        const employeeTableBody = document.querySelector('tbody')!;
        let tr = `
            <tr>
                <td class="check-box-col"><input type="checkbox" class="select"></td>
                <td class="list-profile flex edit-col">
                    <img src="${employee.img}" alt="profile">
                    <div>
                        <div class="list-profile-name">${employee.name}</div>
                        <div class="list-profile-mail grey-color">${employee.email}</div>
                    </div>
                </td>
                <td class="col col-location edit-col">${employee.location}</td>
                <td class="col col-department edit-col">${employee.dept}</td>
                <td class="col-role col edit-col">${employee.role}</td>
                <td class="col-emp-no col edit-col">${employee.empNo}</td>
                <td class="col-status col">
                    <div class="">${employee.status}</div>
                </td>
                <td class="col-join-dt col edit-col">${employee.joinDate}</td>
                <td class="three-dots col">
                    <i class="fa-solid fa-ellipsis"></i>
                    <div class="ellipsis-menu hide-ellipsis-menu flex-column">
                        <div class="child details">More Details</div>
                        <div class="child edit">Edit</div>
                        <div class="child delete">Delete</div>
                    </div>
                </td>
            </tr>`;
        employeeTableBody.innerHTML += tr;
    }

    addEventsOnRows() {
        const checkboxes = document.querySelectorAll('.select');
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('click', this.employeeTable.activateDeleteButton);
        });
        const more = document.querySelectorAll(".three-dots .fa-ellipsis");
        more.forEach((ellipsis) => {
            ellipsis.addEventListener('click', this.employeeTable.toggleEditOption);
        });
        const edit = document.querySelectorAll(".child.edit, .child.details,.edit-col");
        edit.forEach((row) => {
            row.addEventListener('click', this.addEmployee.editEmployeeForm);
        });
        const deleteButtons = document.querySelectorAll('.child.delete');
        deleteButtons.forEach((button) => {
            button.addEventListener('click', this.ellipsisDelete);
        });
        const status = document.querySelectorAll(".col-status div") as NodeListOf<HTMLElement>;
        status.forEach((elem) => {
            elem.addEventListener('click', this.employeeTable.toggleStatus);
            if (elem.textContent!.toUpperCase() != 'ACTIVE') {
                elem.className = 'btn-inactive';
            }
            else {
                elem.className = 'btn-active';
            }
        });
    }
    selectAllRow(): void {
        var checkbox = document.querySelectorAll('.check-box-col input') as NodeListOf<HTMLInputElement>;
        var isChecked = checkbox[0].checked;
        for (var i = 1; i < checkbox.length; i++) {
            checkbox[i].checked = isChecked;
        }
        this.employeeTable.activateDeleteButton();
    }
    populateFilteredTable(filteredEmployees: EmployeeData[]) {
        this.unpopulateTable();
        sessionStorage.setItem('FilteredEmployeesDetail', JSON.stringify(filteredEmployees));
        const employees: EmployeeData[] | null = JSON.parse(sessionStorage.getItem('FilteredEmployeesDetail') || "null");
        if (employees && employees.length > 0) {
            employees.forEach(employee => {
                this.addRow(employee);
            });
        } else {
            console.log('No employee data available.');
        }
        this.addEventsOnRows();
    }

    deleteRow() {
        let storage = new Storage()

        const table = document.querySelector("#employee-table")!;
        var rows = table.getElementsByTagName('tr');
        var checkbox = document.querySelectorAll('.check-box-col input') as NodeListOf<HTMLInputElement>;
        for (var i = 1; i < rows.length; i++) {
            if (checkbox[i].checked) {
                storage.deleteFromSessionStorage(rows[i]);
            }
        }
        document.querySelector('.delete-confirmation')?.classList.remove('show-delete-confirmation');
        document.querySelector('tbody')!.innerHTML = '';
        this.populateTable();
        this.employeeTable.activateDeleteButton();
    }
}
import { Storage } from './handleStorage.js';
import { AddEmployee } from './handleForms.js';
import { EmployeeTable } from './script.js';
let storage = new Storage();
let addEmployee = new AddEmployee();
export class Populate {
    constructor() {
        this.employeeTable = new EmployeeTable();
        this.deleteRow = this.deleteRow.bind(this);
    }
    ;
    populateTable() {
        const employees = JSON.parse(sessionStorage.getItem('employeesTableDetail') || 'null');
        if (employees && employees.length > 0) {
            employees.forEach(employee => {
                this.addRow(employee);
            });
        }
        else {
            console.log('No employee data available.');
        }
    }
    unpopulateTable() {
        document.querySelector('tbody').innerHTML = '';
    }
    openDeleteConfirmation() {
        var deleteConfirmation = document.getElementsByClassName('delete-confirmation')[0];
        deleteConfirmation.classList.add('show-delete-confirmation');
    }
    closeDeleteConfirmation() {
        var deleteConfirmation = document.getElementsByClassName('delete-confirmation')[0];
        deleteConfirmation.classList.remove('show-delete-confirmation');
    }
    ellipsisDelete() {
        this.parentNode.parentNode.parentNode.querySelector('.check-box-col input').checked = true;
        document.querySelector('.delete-confirmation')?.classList.add('show-delete-confirmation');
    }
    addRow(employee) {
        const employeeTableBody = document.getElementsByTagName('tbody')[0];
        let tr = document.createElement('tr');
        let checkbox = document.createElement('td');
        checkbox.className = 'check-box-col';
        let inputCheckbox = document.createElement('input');
        inputCheckbox.type = 'checkbox';
        inputCheckbox.classList.add('select');
        inputCheckbox.addEventListener("click", this.employeeTable.activateDeleteButton);
        checkbox.appendChild(inputCheckbox);
        tr.appendChild(checkbox);
        let listProfileName = document.createElement('div');
        let listProfileMail = document.createElement('div');
        listProfileName.className = 'list-profile-name';
        listProfileMail.classList.add('list-profile-mail', 'grey-color');
        listProfileName.textContent = employee.name;
        listProfileMail.textContent = employee.email;
        let listProfileDiv = document.createElement('div');
        listProfileDiv.appendChild(listProfileName);
        listProfileDiv.appendChild(listProfileMail);
        let profileImage = document.createElement('img');
        profileImage.src = employee.img;
        profileImage.alt = "profile";
        let listProfile = document.createElement('td');
        listProfile.classList.add('list-profile', 'flex');
        listProfile.appendChild(profileImage);
        listProfile.appendChild(listProfileDiv);
        listProfile.addEventListener("click", addEmployee.editEmployeeForm);
        tr.appendChild(listProfile);
        let location = document.createElement('td');
        location.classList.add('col', 'col-location');
        location.textContent = employee.location;
        location.addEventListener("click", addEmployee.editEmployeeForm);
        tr.appendChild(location);
        let department = document.createElement('td');
        department.classList.add('col', 'col-department');
        department.textContent = employee.dept;
        department.addEventListener("click", addEmployee.editEmployeeForm);
        tr.appendChild(department);
        let role = document.createElement('td');
        role.classList.add('col-role', 'col');
        role.textContent = employee.role;
        role.addEventListener("click", addEmployee.editEmployeeForm);
        tr.appendChild(role);
        let empNum = document.createElement('td');
        empNum.classList.add('col-emp-no', 'col');
        empNum.textContent = employee.empNo;
        empNum.addEventListener("click", addEmployee.editEmployeeForm);
        tr.appendChild(empNum);
        let activeBtn = document.createElement('div');
        activeBtn.textContent = employee.status;
        if (employee.status.toUpperCase() != 'ACTIVE') {
            activeBtn.className = 'btn-inactive';
        }
        else {
            activeBtn.className = 'btn-active';
        }
        activeBtn.addEventListener('click', this.employeeTable.toggleStatus);
        let activeStatus = document.createElement('td');
        activeStatus.classList.add('col-status', 'col');
        activeStatus.appendChild(activeBtn);
        tr.appendChild(activeStatus);
        let joinDate = document.createElement('td');
        joinDate.classList.add('col-join-dt', 'col');
        joinDate.textContent = employee.joinDate;
        joinDate.addEventListener("click", addEmployee.editEmployeeForm);
        tr.appendChild(joinDate);
        let dot = document.createElement('i');
        dot.classList.add('fa-solid', 'fa-ellipsis');
        let more = document.createElement('td');
        more.classList.add('three-dots', 'col');
        more.appendChild(dot);
        var ellipsisParent = document.createElement('div');
        ellipsisParent.classList.add('ellipsis-menu', 'hide-ellipsis-menu', 'flex-column');
        var moreDetails = document.createElement('div');
        var edit = document.createElement('div');
        var dlt = document.createElement('div');
        moreDetails.classList.add('child');
        moreDetails.textContent = "More Details";
        moreDetails.addEventListener('click', addEmployee.editEmployeeForm);
        edit.classList.add('child');
        edit.textContent = 'Edit';
        edit.addEventListener('click', addEmployee.editEmployeeForm);
        dlt.classList.add('child');
        dlt.textContent = "delete";
        dlt.addEventListener('click', this.ellipsisDelete);
        ellipsisParent.appendChild(moreDetails);
        ellipsisParent.appendChild(edit);
        ellipsisParent.appendChild(dlt);
        more.appendChild(ellipsisParent);
        tr.appendChild(more);
        more.addEventListener('click', this.employeeTable.toggleEditOption);
        employeeTableBody.appendChild(tr);
    }
    selectAllRow() {
        var checkbox = document.querySelectorAll('.check-box-col input');
        var isChecked = checkbox[0].checked;
        for (var i = 1; i < checkbox.length; i++) {
            checkbox[i].checked = isChecked;
        }
        this.employeeTable.activateDeleteButton();
    }
    populateFilteredTable(filteredEmployees) {
        this.unpopulateTable();
        sessionStorage.setItem('FilteredEmployeesDetail', JSON.stringify(filteredEmployees));
        const employees = JSON.parse(sessionStorage.getItem('FilteredEmployeesDetail') || "null");
        if (employees && employees.length > 0) {
            employees.forEach(employee => {
                this.addRow(employee);
            });
        }
        else {
            console.log('No employee data available.');
        }
    }
    deleteRow() {
        const table = document.querySelector("#employee-table");
        var rows = table.getElementsByTagName('tr');
        var checkbox = document.querySelectorAll('.check-box-col input');
        for (var i = 1; i < rows.length; i++) {
            if (checkbox[i].checked) {
                storage.deleteFromSessionStorage(rows[i]);
            }
        }
        document.querySelector('.delete-confirmation')?.classList.remove('show-delete-confirmation');
        document.querySelector('tbody').innerHTML = '';
        this.populateTable();
        this.employeeTable.activateDeleteButton();
    }
}

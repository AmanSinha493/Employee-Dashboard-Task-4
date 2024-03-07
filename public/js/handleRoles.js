import { Storage } from "./handleStorage.js";
import { AddEmployee } from "./handleForms.js";
export class Roles {
    constructor() { }
    ;
    handleViewEmployee(roleId) {
        let url = "role-detail.html?roleId-" + roleId;
        window.open(url, "_self");
    }
    createRoleBlock(role) {
        let roleBlockContainer = document.querySelector('.role-block-container');
        let roleBlock = document.createElement('div');
        roleBlock.classList.add("role-block", "flex-column");
        const allEmployees = JSON.parse(sessionStorage.getItem('employeesTableDetail'));
        let employeesData = allEmployees.filter((value) => value.roleId == (role.roleId));
        roleBlock.innerHTML = `
        <div class="role-heading flex">
            <div class="role-name">${role.role}</div>
            <div class="edit-icon"><img src="../../assets/edit.svg" alt=""></div>
        </div>
        <div class="role-info-container flex-column">
            <div class="role-info flex">
                <div><img src="../../assets/team_svgrepo.com.svg" alt=""></div>
                <div> Department</div>
                <div class="role-info-name">${role.dept}</div>
            </div>
            <div class="role-info flex">
                <div><img src="../../assets/location-pin-alt-1_svgrepo.com.svg" alt=""></div>
                <div>Location</div>
                <div class="role-info-name">${role.location}</div>
            </div>
            <div class="role-info flex">
                <p> Total Employees</p>
                <div class="employee-cnt-img flex">
                    <img src="../../assets/admin-search.png" alt="">
                    <img src="../../assets/admin-search.png" alt="">
                    <img src="../../assets/admin-search.png" alt="">
                    <img src="../../assets/admin-search.png" alt="">
                    <p>${employeesData.length}</p>
                </div>
            </div>
        </div>`;
        let view = document.createElement('div');
        view.classList.add('view-btn', 'flex');
        let viewBtn = document.createElement('button');
        viewBtn.textContent = "View all Employees";
        viewBtn.addEventListener('click', () => {
            this.handleViewEmployee(role.roleId.split(' ').join('').toLowerCase());
        });
        view.appendChild(viewBtn);
        const arrowIcon = document.createElement('i');
        arrowIcon.classList.add('fa-solid', 'fa-arrow-right-long');
        view.appendChild(arrowIcon);
        roleBlock.appendChild(view);
        roleBlockContainer.appendChild(roleBlock);
    }
    populateRoles() {
        const roles = JSON.parse(sessionStorage.getItem('rolesDetail'));
        roles.forEach(role => {
            this.createRoleBlock(role);
        });
    }
    unpoplateRoles() {
        document.querySelector('.role-block-container').innerHTML = '';
    }
    checkRoles() {
        let storage = new Storage();
        let employees = storage.employeesDetails('employeesTableDetail');
        let roles = [];
        let roleMap = new Map();
        for (let i = 0; i < employees.length; i++) {
            let element = employees[i].roleId;
            if (!roleMap.has(element)) {
                let roleDetail = {
                    roleId: employees[i].roleId,
                    role: employees[i].role,
                    location: employees[i].location,
                    dept: employees[i].dept
                };
                roleMap.set(element, '');
                roles.push(roleDetail);
            }
        }
        sessionStorage.setItem('rolesDetail', JSON.stringify(roles));
    }
}
export class AddRoles {
    constructor() {
        this.handleRoleSubmit = this.handleRoleSubmit.bind(this);
    }
    ;
    searchEmployee() {
        let input = document.querySelector(".select-selected").value;
        input = input.split(' ').join('').toLowerCase();
        let employeeList = document.querySelectorAll('.select-items>li');
        for (let i = 0; i < employeeList.length; i++) {
            let name = employeeList[i].textContent.split(" ").join("").toLowerCase().trim();
            if (!name.startsWith(input)) {
                employeeList[i].style.display = "none";
            }
            else {
                employeeList[i].style.display = "";
            }
        }
    }
    loadEmployees() {
        let storage = new Storage();
        let employees = storage.employeesDetails('employeesTableDetail');
        let employeeSelect = document.getElementsByClassName('select-items')[0];
        for (let i = 0; i < employees.length; i++) {
            let list = `<li class="flex">
                <div class="assign-employee-profile-option"><img src="${employees[i].img}">
                <p>${employees[i].name}</p>
                </div><input type="checkbox" id="${employees[i].empNo}" value="${employees[i].name}">
            </li>`;
            employeeSelect.innerHTML += list;
        }
    }
    showEmployeeDropdown() {
        let employeeList = document.getElementsByClassName('select-items')[0];
        if (!employeeList.classList.contains("hide"))
            employeeList.classList.add('hide');
        else
            employeeList.classList.remove('hide');
    }
    handleRoleSubmit(event) {
        let employee = new AddEmployee();
        let storage = new Storage();
        let role = new Roles();
        event.preventDefault();
        const form = document.getElementById("roleForm");
        const formData = new FormData(form);
        let allEmployees = storage.employeesDetails('employeesTableDetail');
        const { roleName, department, location } = Object.fromEntries(formData);
        let employeesChecked = document.querySelectorAll(".select-items input");
        for (let i = 0; i < employeesChecked.length; i++) {
            if (employeesChecked[i].checked == true) {
                let currentEmployee;
                console.log(department);
                let id = employeesChecked[i].getAttribute('id');
                for (let j = 0; j < allEmployees.length; j++) {
                    if (id == allEmployees[j].empNo) {
                        allEmployees[j].role = roleName;
                        allEmployees[j].dept = department;
                        allEmployees[j].location = location;
                        allEmployees[j].roleId = employee.assignRoleId(roleName);
                        currentEmployee = allEmployees[j];
                    }
                }
            }
        }
        sessionStorage.setItem("employeesTableDetail", JSON.stringify(allEmployees));
        role.checkRoles();
        window.location.href = "./Roles.html";
    }
}

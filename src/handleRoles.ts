import { EmployeeData } from "./dataType.js";
import { Storage } from "./handleStorage.js";
import { RoleDetail } from "./dataType.js";
import { Role } from "./dataType.js";
import { AddEmployee } from "./handleForms.js";
export class Roles {
    constructor() { };
    handleViewEmployee(roleId: string) {
        let url = "role-detail.html?roleId-" + roleId;
        window.open(url, "_self");
    }

    createRoleBlock(role: RoleDetail,roleId:keyof Role) {
        let roleBlockContainer = document.querySelector('.role-block-container')! as HTMLDivElement;
        let roleBlock = document.createElement('div');
        roleBlock.classList.add("role-block", "flex-column");
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
                    <p>${"4"}</p>
                </div>
            </div>
        </div>`;
        let view = document.createElement('div');
        view.classList.add('view-btn', 'flex');
        let viewBtn = document.createElement('button');
        viewBtn.textContent = "View all Employees";
        viewBtn.addEventListener('click', () => {
            this.handleViewEmployee((roleId as string).split(' ').join('').toLowerCase());
        })
        view.appendChild(viewBtn);
        const arrowIcon = document.createElement('i');
        arrowIcon.classList.add('fa-solid', 'fa-arrow-right-long')
        view.appendChild(arrowIcon);
        roleBlock.appendChild(view);
        roleBlockContainer.appendChild(roleBlock);
    }
    populateRoles() {
        const roles:Role = JSON.parse(sessionStorage.getItem('rolesDetail')!);
        Object.keys(roles).forEach(key=>{
            this.createRoleBlock(roles[key],key)
        })
    }

    unpoplateRoles() {
        document.querySelector('.role-block-container')!.innerHTML = '';
    }

    checkRoles() {
        let storage = new Storage();
        let employees: EmployeeData[] = storage.employeesDetails('employeesTableDetail')!;
        let roleMap :Role={};
        for (let i = 0; i < employees.length; i++) {
            let element = employees[i].roleId;
            if (! (element! in roleMap)) {
                let roleDetail: RoleDetail = {
                    role: employees[i].role,
                    location: employees[i].location,
                    dept: employees[i].dept
                };
                roleMap[element!]=roleDetail;
            }
        }
        sessionStorage.setItem('rolesDetail', JSON.stringify(roleMap));
    }
}

export class AddRoles {
    constructor() {
        this.handleRoleSubmit = this.handleRoleSubmit.bind(this);
    };
    searchEmployee() {
        let input = (document.querySelector(".select-selected") as HTMLInputElement).value;
        input = input.split(' ').join('').toLowerCase();
        let employeeList = document.querySelectorAll('.select-items>li')! as NodeListOf<any>;
        for (let i = 0; i < employeeList.length; i++) {
            let name = (employeeList[i]! as any).textContent.split(" ").join("").toLowerCase().trim();
            if (!name.startsWith(input)) {
                employeeList[i].style.display = "none";
            } else {
                employeeList[i].style.display = "";
            }
        }
    }

    loadEmployees() {
        let storage = new Storage();
        let employees: EmployeeData[] = storage.employeesDetails('employeesTableDetail')!;
        let employeeSelect = document.getElementsByClassName('select-items')[0];
        for (let i = 0; i < employees.length; i++) {
            let list =
            `<li class="flex">
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
    
    handleRoleSubmit(event: Event) {
        let employee=new AddEmployee();
        let storage = new Storage();
        let role = new Roles();
        event.preventDefault();
        const form = document.getElementById("roleForm") as HTMLFormElement;
        const formData = new FormData(form);
        let allEmployees: EmployeeData[] = storage.employeesDetails('employeesTableDetail')!;
        const{roleName,department,location} = Object.fromEntries(formData);
        let employeesChecked = document.querySelectorAll(".select-items input") as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < employeesChecked.length; i++) {
            if (employeesChecked[i].checked == true) {
                let currentEmployee;
                console.log(department);
                let id = employeesChecked[i].getAttribute('id');
                for (let j = 0; j < allEmployees.length; j++) {
                    if (id == allEmployees[j].empNo) {
                        allEmployees[j].role = <string>roleName;
                        allEmployees[j].dept = <string>department;
                        allEmployees[j].location = <string>location;
                        allEmployees[j].roleId = employee.assignRoleId(<string>roleName);

                        currentEmployee = allEmployees[j]
                    }
                }
            }
        }
        sessionStorage.setItem("employeesTableDetail", JSON.stringify(allEmployees));
        role.checkRoles();
        window.location.href = "./Roles.html";
    }
}
import { AddEmployee } from "./handleForms.js";
import { Collapse } from "./common.js";
import { EmployeeModal } from "./handleForms.js";
let addEmp = new AddEmployee();
let collapse = new Collapse();
let modal = new EmployeeModal();
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.collapse-button')?.addEventListener('click', collapse.sideBar);
    let url = document.URL;
    let roleName = url.split('?')[1];
    const allRoles = JSON.parse(sessionStorage.getItem('rolesDetail') || 'null');
    let employeesData = [];
    for (let i = 0; i < allRoles.length; i++) {
        if (allRoles[i][0].split(' ').join('').toLowerCase() == roleName) {
            employeesData = allRoles[i][1].employees;
            break;
        }
    }
    populateEmployeesBlock(employeesData);
    let view = document.getElementsByClassName('view-btn');
    for (let i = 0; i < view.length; i++) {
        view[i].addEventListener('click', addEmp.editEmployeeForm);
    }
    let uploadProfilePic = document.getElementById('profileImageInput');
    uploadProfilePic.addEventListener('change', addEmp.displayImagePreview);
    const addEmployeeForm = document.getElementsByClassName('add-employee-form')[0];
    addEmployeeForm.addEventListener("submit", addEmp.checkValidation);
    document.querySelector('.add-employee-button')?.addEventListener('click', modal.openAddEmployeeModal);
    document.querySelector('#cancel')?.addEventListener('click', modal.closeAddEmployeeModal);
});
function populateEmployeesBlock(employeesData) {
    for (let i = 0; i < employeesData.length; i++) {
        createEmployeeBlock(employeesData[i]);
    }
}
function createEmployeeBlock(employee) {
    let employeeBlockContainer = document.getElementsByClassName('employee-block-container')[0];
    let employeeBlock = document.createElement('div');
    employeeBlock.classList.add("employee-block", "flex-column");
    employeeBlock.innerHTML = `
                    <div class="employee-profile flex">
                        <div class="employee-img"><img src="${employee.img}"></div>
                        <div>
                            <div class="employee-name">${employee.name}</div>
                            <div class="employee-department grey-color">Head of Product Design</div>
                        </div>

                    </div>
                    <div class="employee-info-container flex-column">
                        <div class="employee-info flex">
                            <div><img src="../../../assets/id.svg" alt=""></div>
                            <div> ${employee.empNo}</div>
                        </div>
                        <div class="employee-info flex">
                            <div><img src="../../../assets/email-1_svgrepo.com.svg" alt=""></div>
                            <div>${employee.email}</div>
                        </div>
                        <div class="employee-info flex">
                            <div><img src="../../../assets/team_svgrepo.com.svg" alt=""></div>
                            <div>${employee.dept}</div>
                        </div>
                        <div class="employee-info flex">
                            <div><img src="../../../assets/location-pin-alt-1_svgrepo.com.svg" alt=""></div>
                            <div>${employee.location}</div>
                        </div>
                    </div>
                    <div class="view-btn flex">View<i class="fa-solid fa-arrow-right-long"></i></div>`;
    // console.log(document.getElementsByClassName('view-btn')[0]);
    employeeBlockContainer.appendChild(employeeBlock);
}

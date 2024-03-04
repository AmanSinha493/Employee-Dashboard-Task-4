import { Storage } from './handleStorage.js';
import { EmployeeTable } from './employeeTable.js';
let empTable = new EmployeeTable();
let storage = new Storage();
let populate;
async function initiaize() {
    let p = await import("./populate.js");
    populate = new p.Populate();
}
initiaize();
export class EmployeeModal {
    constructor() {
        this.closeAddEmployeeModal = this.closeAddEmployeeModal.bind(this);
    }
    ;
    openAddEmployeeModal() {
        var AddEmployeeModal = document.getElementsByClassName('add-employee-form')[0];
        AddEmployeeModal.classList.add('show-addEmployee-form');
    }
    closeAddEmployeeModal() {
        const form = document.getElementById("employeeForm");
        form.reset();
        [...form.querySelectorAll('input'), ...form.querySelectorAll('select')].forEach(element => {
            this.showValidInput(element, "");
            element.disabled = false;
        });
        document.getElementById('profileImagePreview').src = "../../assets/add-employee-default-user.svg";
        let submitBtn = document.querySelector('#submitButton');
        submitBtn.style.display = "";
        submitBtn.textContent = "Add Employee";
        document.querySelector('#cancel').textContent = "Cancel";
        document.getElementsByClassName('upload-profile-pic-btn')[0].style.display = '';
        document.getElementsByClassName('upload-profile-pic-btn')[0].disabled = false;
        document.getElementsByClassName('add-employee-form')[0].classList.remove('show-addEmployee-form');
        if (location.href.includes("index.html")) {
            populate.unpopulateTable();
            populate.populateTable();
        }
    }
    showValidInput(element, message) {
        element.style.outlineColor = "red";
        let parentDiv = element.parentElement;
        let span = parentDiv?.querySelector('span');
        if (span) {
            span.innerHTML = message;
            span.style.color = "red";
        }
    }
}
export class AddEmployee {
    constructor() {
        this.modal = new EmployeeModal();
        this.checkValidation = this.checkValidation.bind(this);
    }
    ;
    displayImagePreview(event) {
        const inputElement = document.getElementById("profileImageInput");
        const image = inputElement.files ? inputElement.files[0] : undefined;
        if (image) {
            const url = URL.createObjectURL(image);
            document.querySelector('#profileImagePreview').src = url;
        }
    }
    checkValidation(event) {
        event.preventDefault();
        const editflag = document.querySelector('#submitButton').textContent.toLowerCase().split(' ').join('') !== "addemployee";
        const employees = storage.employeesDetails('employeesTableDetail'); // replace any with the actual type
        const form = document.getElementById("employeeForm");
        const formInput = form.querySelectorAll('input:not([name="dob"])');
        const formSelect = form.querySelectorAll('select');
        let flag = true;
        for (const element of formInput) {
            switch (element.name) {
                case 'empNo':
                    if (!editflag) {
                        if (element.value === "") {
                            this.modal.showValidInput(element, `&#9888; This is a required field`);
                            flag = false;
                        }
                        else if (employees.some(emp => emp.empNo === element.value)) {
                            this.modal.showValidInput(element, `&#9888; Employee ID already exists!`);
                            flag = false;
                        }
                        else {
                            this.modal.showValidInput(element, ``);
                        }
                    }
                    break;
                case 'mobileNumber':
                    if (element.value === "") {
                        this.modal.showValidInput(element, `&#9888; This is a required field`);
                        flag = false;
                    }
                    else if (!/^[1-9][0-9]{9}$/.test(element.value)) {
                        this.modal.showValidInput(element, `&#9888; Enter a valid number`);
                        flag = false;
                    }
                    else {
                        this.modal.showValidInput(element, ``);
                    }
                    break;
                case 'firstName':
                case 'lastName':
                    if (element.value === "") {
                        this.modal.showValidInput(element, `&#9888; This is a required field`);
                        flag = false;
                    }
                    else if (!/^[A-Za-z]+$/.test(element.value)) {
                        this.modal.showValidInput(element, `&#9888; Only alphabets are allowed`);
                        flag = false;
                    }
                    else {
                        this.modal.showValidInput(element, ``);
                    }
                    break;
                case 'email':
                    if (element.value === "") {
                        this.modal.showValidInput(element, `&#9888; This is a required field`);
                        flag = false;
                    }
                    else if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(element.value)) {
                        this.modal.showValidInput(element, `&#9888; Invalid Email Address`);
                        flag = false;
                    }
                    else {
                        this.modal.showValidInput(element, ``);
                    }
                    break;
                case 'joiningDate':
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                    const currentDay = currentDate.getDate().toString().padStart(2, '0');
                    const currentDateFormatted = parseInt(`${currentYear}${currentMonth}${currentDay}`);
                    const inputDateParts = element.value.split('-');
                    if (element.value === "") {
                        this.modal.showValidInput(element, `&#9888; This is a required field`);
                        flag = false;
                    }
                    else {
                        const inputYear = parseInt(inputDateParts[0]);
                        const inputMonth = parseInt(inputDateParts[1]);
                        const inputDay = parseInt(inputDateParts[2]);
                        if (inputYear > currentYear || (inputYear === currentYear && inputMonth > currentDate.getMonth() + 1) || (inputYear === currentYear && inputMonth === currentDate.getMonth() + 1 && inputDay > currentDay)) {
                            this.modal.showValidInput(element, `&#9888; Invalid date`);
                            flag = false;
                        }
                        else {
                            this.modal.showValidInput(element, ``);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        for (const element of formSelect) {
            if (element.value === '') {
                this.modal.showValidInput(element, `&#9888; This is a required field`);
                flag = false;
            }
            else {
                this.modal.showValidInput(element, ``);
            }
        }
        if (!flag)
            return;
        if (editflag) {
            this.updateEmployee(document.getElementById('empNo').value);
        }
        else {
            this.handleFormSubmit();
        }
        if (location.href.includes("index.html")) {
            populate.unpopulateTable();
            populate.populateTable();
        }
    }
    editEmployeeForm() {
        document.querySelector('.add-employee-form').classList.add('show-addEmployee-form');
        const employees = storage.employeesDetails('employeesTableDetail');
        let employee;
        if (this.textContent.toLowerCase() == 'view') {
            let currentRow = this.parentNode.querySelector('.employee-info-container>:first-child').textContent.trim();
            employee = employees.filter((employee) => employee.empNo == currentRow)[0];
        }
        else {
            const currentRow = this.closest('tr');
            const empNo = currentRow.querySelector('.col-emp-no').textContent.trim();
            employee = employees.find(emp => emp.empNo == empNo);
        }
        if (!employee)
            return;
        const nameParts = employee.name.split(' ');
        const selectedEmpJoinDate = employee.joinDate.split('/').reverse().join('-');
        document.getElementById('empNo').value = employee.empNo;
        document.getElementById('empNo').readOnly = true;
        document.getElementById('firstName').value = nameParts[0];
        document.getElementById('lastName').value = nameParts.slice(1).join(' ');
        document.getElementById('email').value = employee.email;
        document.getElementById('joiningDate').value = selectedEmpJoinDate;
        document.getElementById('mobileNumber').value = employee.mobile;
        document.getElementById('location').value = employee.location;
        document.getElementById('jobTitle').value = employee.role;
        document.getElementById('department').value = employee.dept;
        document.getElementById('profileImagePreview').src = employee.img;
        const submitButton = document.querySelector('#submitButton');
        if (this.textContent.toLowerCase() != "edit") {
            submitButton.style.display = "none";
            document.querySelector('#cancel').textContent = "Close";
            const inputs = document.querySelectorAll('#employeeForm input, #employeeForm select');
            inputs.forEach(input => input.disabled = true);
            document.querySelector('.upload-profile-pic-btn').style.display = 'none';
        }
        else {
            document.querySelector('#cancel').classList.add('edit');
            submitButton.textContent = "Apply Changes";
        }
    }
    handleFormSubmit() {
        const form = document.querySelector("#employeeForm");
        const formData = new FormData(form);
        const { empNo, firstName, lastName, email, joiningDate, location, jobTitle, department, mobileNumber } = Object.fromEntries(formData);
        const profileImageFile = (formData.get("profileImage") || undefined);
        const name = `${firstName} ${lastName}`;
        let newEmployeeDetails = {
            "dept": department,
            "email": email,
            "empNo": empNo,
            "img": "",
            "joinDate": joiningDate.split('-').reverse().join('/'),
            "location": location,
            "mobile": mobileNumber,
            "name": name,
            "role": jobTitle,
            "status": "Active"
        };
        if (profileImageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(profileImageFile);
            reader.onload = function () {
                newEmployeeDetails.img = reader.result;
                storage.saveToSessionStorage(newEmployeeDetails);
            };
        }
        else {
            storage.saveToSessionStorage(newEmployeeDetails);
        }
        form.reset();
        alert("Employee data has been stored !");
        this.modal.closeAddEmployeeModal();
        empTable.showToaster("Employee Added");
    }
    updateEmployee(id) {
        const employees = storage.employeesDetails('employeesTableDetail');
        const employee = employees.find(emp => emp.empNo == id);
        if (!employee)
            return;
        const form = document.getElementById("employeeForm");
        const formData = new FormData(form);
        const { firstName, lastName, email, joiningDate, location, jobTitle, department, mobileNumber } = Object.fromEntries(formData);
        employee.email = email;
        employee.location = location;
        employee.role = jobTitle;
        employee.dept = department;
        employee.name = `${firstName} ${lastName}`;
        employee.mobile = mobileNumber;
        employee.joinDate = joiningDate.split('-').reverse().join('/');
        const profileImageFile = formData.get("profileImage");
        if (profileImageFile.name !== '') {
            const reader = new FileReader();
            reader.readAsDataURL(profileImageFile);
            reader.onload = function () {
                employee.img = reader.result;
                sessionStorage.setItem('employeesTableDetail', JSON.stringify(employees));
            };
        }
        sessionStorage.setItem('employeesTableDetail', JSON.stringify(employees));
        // let checkChanges=empTable.checkForChanges()
        // if(checkChanges)
        this.modal.closeAddEmployeeModal();
        empTable.showToaster("Employee Updated");
    }
    openEditConfirmation() {
        document.getElementsByClassName('edit-cancel-popup')[0].classList.add('show-delete-confirmation');
    }
    closeEditConfirmation() {
        document.getElementsByClassName('edit-cancel-popup')[0].classList.remove('show-delete-confirmation');
    }
}

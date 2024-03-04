import { EmployeeData } from './dataType.js';
import { Populate } from "./populate.js";
import { Storage } from './handleStorage.js';
import { EmployeeTable } from './employeeTable.js';

let empTable=new EmployeeTable();
let storage = new Storage();
let populate: Populate;
async function initiaize() {
    let p = await import("./populate.js");
    populate = new p.Populate();
}
initiaize();

export class EmployeeModal {
    constructor() { 
        this.closeAddEmployeeModal=this.closeAddEmployeeModal.bind(this);
    };
    openAddEmployeeModal(): void {
        var AddEmployeeModal = document.getElementsByClassName('add-employee-form')[0];
        AddEmployeeModal.classList.add('show-addEmployee-form');
    }
    closeAddEmployeeModal(): void {
        const form = document.getElementById("employeeForm") as HTMLFormElement;
        form.reset();
        [...form.querySelectorAll('input'), ...form.querySelectorAll('select')].forEach(element => {
            this.showValidInput(element, "");
            element.disabled = false;
        });
        (document.getElementById('profileImagePreview')! as HTMLImageElement).src = "../../assets/add-employee-default-user.svg";
        let submitBtn = (document.querySelector('#submitButton')! as HTMLButtonElement);
        submitBtn.style.display = "";
        submitBtn.textContent = "Add Employee";
        (document.querySelector('#cancel')! as HTMLButtonElement).textContent = "Cancel";
        (document.getElementsByClassName('upload-profile-pic-btn')[0]! as HTMLButtonElement).style.display = '';
        (document.getElementsByClassName('upload-profile-pic-btn')[0]! as HTMLButtonElement).disabled = false;
        document.getElementsByClassName('add-employee-form')[0].classList.remove('show-addEmployee-form');
        if (location.href.includes("index.html")) {
            populate.unpopulateTable();
            populate.populateTable();
        }
    }
    showValidInput(element: HTMLElement, message: string): void {
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
        this.checkValidation = this.checkValidation.bind(this)
    };
    public modal = new EmployeeModal();
    displayImagePreview(event: Event): void {
        const inputElement = document.getElementById("profileImageInput") as HTMLInputElement;
        const image: File | undefined = inputElement.files ? inputElement.files[0] : undefined;
        if (image) {
            const url: string = URL.createObjectURL(image);
            (document.querySelector('#profileImagePreview') as HTMLImageElement).src = url;
        }
    }

    checkValidation(event: Event) {
        event.preventDefault();
        const editflag: boolean = (document.querySelector('#submitButton') as HTMLElement).textContent!.toLowerCase().split(' ').join('') !== "addemployee";
        const employees: EmployeeData[] | null = storage.employeesDetails('employeesTableDetail'); // replace any with the actual type
        const form: HTMLFormElement = document.getElementById("employeeForm") as HTMLFormElement;
        const formInput: NodeListOf<HTMLInputElement> = form.querySelectorAll('input:not([name="dob"])');
        const formSelect: NodeListOf<HTMLSelectElement> = form.querySelectorAll('select');
        let flag = true;
        for (const element of formInput) {
            switch (element.name) {
                case 'empNo':
                    if (!editflag) {
                        if (element.value === "") {
                            this.modal.showValidInput(element, `&#9888; This is a required field`);
                            flag = false;
                        } else if (employees!.some(emp => emp.empNo === element.value)) {
                            this.modal.showValidInput(element, `&#9888; Employee ID already exists!`);
                            flag = false;
                        } else {
                            this.modal.showValidInput(element, ``);
                        }
                    }
                    break;
                case 'mobileNumber':
                    if (element.value === "") {
                        this.modal.showValidInput(element, `&#9888; This is a required field`);
                        flag = false;
                    } else if (!/^[1-9][0-9]{9}$/.test(element.value)) {
                        this.modal.showValidInput(element, `&#9888; Enter a valid number`);
                        flag = false;
                    } else {
                        this.modal.showValidInput(element, ``);
                    }
                    break;
                case 'firstName':
                case 'lastName':
                    if (element.value === "") {
                        this.modal.showValidInput(element, `&#9888; This is a required field`);
                        flag = false;
                    } else if (!/^[A-Za-z]+$/.test(element.value)) {
                        this.modal.showValidInput(element, `&#9888; Only alphabets are allowed`);
                        flag = false;
                    } else {
                        this.modal.showValidInput(element, ``);
                    }
                    break;
                case 'email':
                    if (element.value === "") {
                        this.modal.showValidInput(element, `&#9888; This is a required field`);
                        flag = false;
                    } else if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(element.value)) {
                        this.modal.showValidInput(element, `&#9888; Invalid Email Address`);
                        flag = false;
                    } else {
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
                        } else {
                            const inputYear = parseInt(inputDateParts[0]);
                            const inputMonth = parseInt(inputDateParts[1]);
                            const inputDay = parseInt(inputDateParts[2]);
                            
                            if (inputYear > currentYear || (inputYear === currentYear && inputMonth > currentDate.getMonth() + 1) || (inputYear === currentYear && inputMonth === currentDate.getMonth() + 1 && (<string><unknown>inputDay)  > (currentDay as string))) {
                                this.modal.showValidInput(element, `&#9888; Invalid date`);
                                flag = false;
                            } else {
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
            } else {
                this.modal.showValidInput(element, ``);
            }
        }
        if (!flag) return;
        if (editflag) {
            this.updateEmployee((document.getElementById('empNo') as HTMLInputElement).value);
        } else {
            this.handleFormSubmit();
        }
        if (location.href.includes("index.html")) {
            populate.unpopulateTable();
            populate.populateTable();
        }
    }

    editEmployeeForm(this: any) {
        document.querySelector('.add-employee-form')!.classList.add('show-addEmployee-form');
        const employees = storage.employeesDetails('employeesTableDetail')!;
        let employee: EmployeeData;
        if (this.textContent.toLowerCase() == 'view') {
            let currentRow = this.parentNode.querySelector('.employee-info-container>:first-child').textContent.trim();
            employee = employees.filter((employee) => employee.empNo == currentRow)[0];
        }
        else {
            const currentRow = this.closest('tr');
            const empNo = currentRow.querySelector('.col-emp-no').textContent.trim();
            employee = employees.find(emp => emp.empNo == empNo)!;
        }
        if (!employee) return;
        const nameParts = employee.name.split(' ');
        const selectedEmpJoinDate = employee.joinDate.split('/').reverse().join('-');
        (document.getElementById('empNo')! as HTMLInputElement).value = employee.empNo;
        (document.getElementById('empNo')! as HTMLInputElement).readOnly = true;
        (document.getElementById('firstName')! as HTMLInputElement).value = nameParts[0];
        (document.getElementById('lastName')! as HTMLInputElement).value = nameParts.slice(1).join(' ');
        (document.getElementById('email')! as HTMLInputElement).value = employee.email;
        (document.getElementById('joiningDate')! as HTMLInputElement).value = selectedEmpJoinDate;
        (document.getElementById('mobileNumber')! as HTMLInputElement).value = employee.mobile;
        (document.getElementById('location')! as HTMLSelectElement).value = employee.location;
        (document.getElementById('jobTitle')! as HTMLSelectElement).value = employee.role;
        (document.getElementById('department')! as HTMLSelectElement).value = employee.dept;
        (document.getElementById('profileImagePreview') as HTMLImageElement).src = employee.img;
        const submitButton = document.querySelector('#submitButton') as HTMLButtonElement;
        if (this.textContent.toLowerCase() != "edit") {
            submitButton.style.display = "none";
            (document.querySelector('#cancel')! as HTMLButtonElement).textContent = "Close";
            const inputs = document.querySelectorAll('#employeeForm input, #employeeForm select') as NodeListOf<HTMLInputElement>;
            inputs.forEach(input => input.disabled = true);
            (document.querySelector('.upload-profile-pic-btn') as HTMLButtonElement).style.display = 'none';
        } else {
            (document.querySelector('#cancel')! as HTMLButtonElement).classList.add('edit');
            submitButton.textContent = "Apply Changes";
        }
    }

    handleFormSubmit(): void {
        const form = document.querySelector("#employeeForm") as HTMLFormElement;
        const formData = new FormData(form);
        const {empNo, firstName, lastName, email, joiningDate, location, jobTitle, department,mobileNumber } = Object.fromEntries(formData);
        const profileImageFile = (formData.get("profileImage") as File || undefined);
        const name = `${firstName} ${lastName}`;
        let newEmployeeDetails: EmployeeData = {
            "dept": <string>department,
            "email": <string>email,
            "empNo": <string>empNo,
            "img": "",
            "joinDate": (joiningDate as string).split('-').reverse().join('/'),
            "location": <string>location,
            "mobile": <string>mobileNumber,
            "name": <string>name,
            "role": <string>jobTitle,
            "status": "Active"
        };
        if (profileImageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(profileImageFile);
            reader.onload = function () {
                newEmployeeDetails.img = (reader.result as string);
                storage.saveToSessionStorage(newEmployeeDetails);
            };
        } else {
            storage.saveToSessionStorage(newEmployeeDetails);
        }
        form.reset();
        alert("Employee data has been stored !");
        this.modal.closeAddEmployeeModal();
        empTable.showToaster("Employee Added");
    }

    updateEmployee(id: string | number): void {
        const employees: EmployeeData[] = storage.employeesDetails('employeesTableDetail')!;
        const employee: EmployeeData | undefined = employees.find(emp => emp.empNo == id);
        if (!employee) return;
        const form = document.getElementById("employeeForm") as HTMLFormElement;
        const formData = new FormData(form);
        const { firstName, lastName, email, joiningDate, location, jobTitle, department,mobileNumber } = Object.fromEntries(formData);
        employee.email = <string>email;
        employee.location = <string>location;
        employee.role = <string>jobTitle;
        employee.dept = <string>department;
        employee.name = `${firstName} ${lastName}`;
        employee.mobile=<string>mobileNumber;
        employee.joinDate = (joiningDate as string).split('-').reverse().join('/');
        const profileImageFile = formData.get("profileImage") as File;
        if (profileImageFile.name !== '') {
            const reader = new FileReader();
            reader.readAsDataURL(profileImageFile);
            reader.onload = function () {
                employee.img = reader.result as string;
                sessionStorage.setItem('employeesTableDetail', JSON.stringify(employees));
            }
        }
        sessionStorage.setItem('employeesTableDetail', JSON.stringify(employees));
        // let checkChanges=empTable.checkForChanges()
        // if(checkChanges)
        this.modal.closeAddEmployeeModal();
        empTable.showToaster("Employee Updated");
    }
    openEditConfirmation(): void {
        document.getElementsByClassName('edit-cancel-popup')[0].classList.add('show-delete-confirmation');
    }
    closeEditConfirmation(): void {
        document.getElementsByClassName('edit-cancel-popup')[0].classList.remove('show-delete-confirmation');
    }
}
"use strict";
document.addEventListener("DOMContentLoaded", function () {
});
;
function saveToSessionStorage(employee) {
    let savedEmployees = JSON.parse(sessionStorage.getItem("employeesTableDetail") || 'null');
    console.log(savedEmployees);
    if (savedEmployees == null) {
        savedEmployees = [];
        savedEmployees.push(employee);
    }
    else {
        savedEmployees.push(employee);
    }
    sessionStorage.setItem("employeesTableDetail", JSON.stringify(savedEmployees));
}
function employeesDetails(key) {
    const employees = JSON.parse(sessionStorage.getItem(key) || 'null');
    return employees;
}
function getFilteredEmployees() {
    const employees = JSON.parse(sessionStorage.getItem('FilteredEmployeesDetail') || 'null');
    return employees;
}
function populateTable() {
    const employees = JSON.parse(sessionStorage.getItem('employeesTableDetail') || 'null');
    if (employees && employees.length > 0) {
        employees.forEach(employee => {
            addRow(employee);
        });
    }
    else {
        console.log('No employee data available.');
    }
}
function unpoplateTable() {
    let tbody = document.getElementsByTagName('tbody')[0];
    while (tbody.hasChildNodes()) {
        if (tbody.lastChild != null) {
            tbody.removeChild(tbody.lastChild);
        }
    }
}
function populateFilteredTable(filteredEmployees) {
    unpoplateTable();
    sessionStorage.setItem('FilteredEmployeesDetail', JSON.stringify(filteredEmployees));
    const employees = JSON.parse(sessionStorage.getItem('FilteredEmployeesDetail') || "null");
    if (employees && employees.length > 0) {
        employees.forEach(employee => {
            addRow(employee);
        });
    }
    else {
        console.log('No employee data available.');
    }
}
function resetFilterStorage() {
    let employee = employeesDetails('employeesTableDetail');
    sessionStorage.setItem('FilteredEmployeesDetail', JSON.stringify(employee));
}
let isCollapsed = true;
function collapseSection() {
    const icon = document.querySelector(".collapse-btn");
    const mainBody = document.getElementById("main-body");
    const updateBlock = document.querySelector('.install-update');
    const sideBarOptionsName = document.querySelectorAll('.text');
    const sideBarOptions = document.querySelectorAll('.side-bar-options');
    const functioName = document.querySelectorAll('.function-name');
    const downArrow = document.querySelectorAll('.side-bar-options .arrow');
    const iconImage = document.querySelectorAll('.lock-icon img');
    const fullLogo = document.querySelector('.tezo-logo img');
    const logo = document.querySelector(".logo-icon img");
    const employeeBody = document.querySelector(".employees-detail");
    const searchBar = document.querySelector(".search-bar");
    const displayStyle = isCollapsed ? "none" : "block";
    const logoDisplayStyle = isCollapsed ? "block" : "none";
    const gridTemplateColumns = isCollapsed ? '1fr' : '1fr 3fr 1fr';
    const iconImageStyle = isCollapsed ? "1.5rem" : "50%";
    const marginBottom = isCollapsed ? ".5rem" : "0rem";
    const marginTop = isCollapsed ? ".5rem" : "0rem";
    const mainBodyStyle = isCollapsed ? "1fr 15fr" : "1fr 5fr";
    const transformStyle = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
    const leftStyle = isCollapsed ? "-1%" : "-2%";
    fullLogo.style.display = displayStyle;
    icon.style.left = leftStyle;
    logo.style.display = logoDisplayStyle;
    updateBlock.style.display = displayStyle;
    mainBody.style.gridTemplateColumns = mainBodyStyle;
    icon.style.transform = transformStyle;
    employeeBody.style.paddingLeft = "2%";
    searchBar.style.marginLeft = "0rem";
    iconImage.forEach(img => {
        img.style.height = iconImageStyle;
        img.style.marginBottom = marginBottom;
        img.style.marginTop = marginTop;
    });
    downArrow.forEach(arrow => arrow.style.display = displayStyle);
    sideBarOptions.forEach(option => option.style.gridTemplateColumns = gridTemplateColumns);
    functioName.forEach(name => name.style.display = displayStyle);
    sideBarOptionsName.forEach(name => name.style.display = displayStyle);
    isCollapsed = !isCollapsed;
}
function addRow(employee) {
    const employeeTableBody = document.getElementsByTagName('tbody')[0];
    let tr = document.createElement('tr');
    let checkbox = document.createElement('td');
    checkbox.className = 'check-box-col';
    let inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.classList.add('select');
    inputCheckbox.addEventListener("click", activateDeleteButton);
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
    // listProfile.addEventListener("click", editEmployeeForm);
    tr.appendChild(listProfile);
    let location = document.createElement('td');
    location.classList.add('col', 'col-location');
    location.textContent = employee.location;
    // location.addEventListener("click", editEmployeeForm);
    tr.appendChild(location);
    let department = document.createElement('td');
    department.classList.add('col', 'col-department');
    department.textContent = employee.dept;
    // department.addEventListener("click", editEmployeeForm);
    tr.appendChild(department);
    let role = document.createElement('td');
    role.classList.add('col-role', 'col');
    role.textContent = employee.role;
    // role.addEventListener("click", editEmployeeForm);
    tr.appendChild(role);
    let empNum = document.createElement('td');
    empNum.classList.add('col-emp-no', 'col');
    empNum.textContent = employee.empNo;
    // empNum.addEventListener("click", editEmployeeForm);
    tr.appendChild(empNum);
    let activeBtn = document.createElement('div');
    activeBtn.textContent = employee.status;
    if (employee.status.toUpperCase() != 'ACTIVE') {
        activeBtn.className = 'btn-inactive';
    }
    else {
        activeBtn.className = 'btn-active';
    }
    activeBtn.addEventListener('click', toggleStatus);
    let activeStatus = document.createElement('td');
    activeStatus.classList.add('col-status', 'col');
    activeStatus.appendChild(activeBtn);
    tr.appendChild(activeStatus);
    let joinDate = document.createElement('td');
    joinDate.classList.add('col-join-dt', 'col');
    joinDate.textContent = employee.joinDate;
    // joinDate.addEventListener("click", editEmployeeForm);
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
    // moreDetails.addEventListener('click', editEmployeeForm);
    edit.classList.add('child');
    edit.textContent = 'Edit';
    // edit.addEventListener('click', editEmployeeForm);
    dlt.classList.add('child');
    dlt.textContent = "delete";
    // dlt.addEventListener('click', ellipsisDelete);
    ellipsisParent.appendChild(moreDetails);
    ellipsisParent.appendChild(edit);
    ellipsisParent.appendChild(dlt);
    more.appendChild(ellipsisParent);
    tr.appendChild(more);
    // more.addEventListener('click', toggleEditOption);
    employeeTableBody.appendChild(tr);
}
function searchBar() {
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
function activateDeleteButton() {
    let employeeTable = document.getElementById("employee-table");
    let tr = employeeTable.querySelectorAll('tr');
    let deleteBtn = document.getElementsByClassName("delete-btn")[0];
    for (let i = 1; i < tr.length; i++) {
        let currentCheckbox = tr[i].getElementsByClassName('check-box-col')[0];
        let select = currentCheckbox.getElementsByTagName('input')[0];
        if (select.checked == true) {
            deleteBtn.style.backgroundColor = "#f44848";
            deleteBtn.disabled = false;
            return;
        }
    }
    deleteBtn.style.backgroundColor = "#f89191";
    deleteBtn.disabled = true;
}
function selectAllRow() {
    var checkbox = document.querySelectorAll('.check-box-col input');
    var isChecked = checkbox[0].checked;
    for (var i = 1; i < checkbox.length; i++) {
        checkbox[i].checked = isChecked;
    }
    activateDeleteButton();
}
function toggleStatus() {
    var _a;
    if (((_a = this.textContent) === null || _a === void 0 ? void 0 : _a.toUpperCase()) != "ACTIVE") {
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
function setAlphabeticFilter() {
    var alphabetFilterParent = document.querySelector('.a-to-z-filter');
    var aplhabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)');
    aplhabets.forEach(function (child) {
        child.onclick = function () {
            console.log(this);
            applyAlphabeticFilter(this);
        };
    });
}
function applyAlphabeticFilter(event) {
    let alphabetFilterParent = document.querySelector('.a-to-z-filter');
    let allAlphabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)');
    let filterIcon = document.getElementById('filter-icon');
    let filteredEmployees = [];
    if (event.classList.contains('selected')) {
        allAlphabets.forEach(x => x.classList.remove('selected'));
        filterIcon.classList.remove('selected');
        resetFilterStorage();
        populateTable();
        return;
    }
    let input = event.textContent;
    let rows = employeesDetails('employeesTableDetail');
    let profileName;
    for (let i = 0; i < rows.length; i++) {
        profileName = rows[i].name.trim().toUpperCase();
        if (profileName[0].toUpperCase() == input) {
            filteredEmployees.push(rows[i]);
        }
    }
    console.log(filterIcon);
    allAlphabets.forEach(x => x.classList.remove('selected'));
    event.classList.add('selected');
    filterIcon.classList.add('selected');
    populateFilteredTable(filteredEmployees);
}
function toggleFilter(filterId) {
    const filter = document.querySelector(`#${filterId}-filter .${filterId}-dropdown`);
    filter.classList.toggle('hide');
}
function displayStatusFilter() {
    toggleFilter('status');
}
function displayLocationFilter() {
    toggleFilter('location');
}
function displayDepartmentFilter() {
    toggleFilter('department');
}
function checkFilter(employee, filterType) {
    const filterElement = document.getElementById(`${filterType}-filter`);
    const filterInputs = filterElement.querySelectorAll("input");
    const selectedFilters = [];
    filterInputs.forEach(input => {
        var _a, _b;
        if (input.checked) {
            const filterText = (_b = (_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase().split(' ').join('');
            console.log(filterText);
            selectedFilters.push(filterText);
        }
    });
    if (selectedFilters.length === 0) {
        return true;
    }
    const employeeFilter = employee.toLowerCase().split(' ').join('');
    return selectedFilters.includes(employeeFilter);
}
function checkStatusFilter(employee) {
    return checkFilter(employee, 'status');
}
function checkLocationFilter(employee) {
    return checkFilter(employee, 'location');
}
function checkDepartmentFilter(employee) {
    return checkFilter(employee, 'department');
}
function applyFilter() {
    let filteredEmployees = [];
    let status, location, department;
    let rows = employeesDetails('employeesTableDetail');
    for (var i = 1; i < rows.length; i++) {
        status = checkStatusFilter(rows[i].status);
        location = checkLocationFilter(rows[i].location);
        department = checkDepartmentFilter(rows[i].dept);
        if (status && location && department) {
            filteredEmployees.push(rows[i]);
        }
    }
    // checkAlphabeticFilter();
    populateFilteredTable(filteredEmployees);
}
function resetFilter() {
    var status = document.querySelector("#status-filter .status-dropdown");
    var department = document.querySelector("#department-filter .department-dropdown");
    var location = document.querySelector("#location-filter .location-dropdown");
    if (!status.classList.contains('hide'))
        status.classList.add('hide');
    if (!department.classList.contains('hide'))
        department.classList.add('hide');
    if (!location.classList.contains('hide'))
        location.classList.add('hide');
    let input = document.querySelectorAll('.filter-options-container input');
    input.forEach((element) => { element.checked = false; });
    unpoplateTable();
    populateTable();
    resetFilterStorage();
    // checkAlphabeticFilter();
    // disableFilterBtn();
}
function selectFilter(event) {
    let currentElement = this;
    let checkbox = currentElement.querySelector('input');
    const element = event.target;
    if (element == checkbox)
        return;
    if (checkbox.checked)
        checkbox.checked = false;
    else
        checkbox.checked = true;
}
function deleteFromSessionStorage(employee) {
    let savedEmployees = JSON.parse(sessionStorage.getItem("employeesTableDetail") || '{}');
    let selectedEmployee;
    if (employee.querySelector('.col-emp-no') != null) {
        selectedEmployee = employee.querySelector('.col-emp-no').textContent;
    }
    savedEmployees = savedEmployees.filter((savedEmployee) => savedEmployee.empNo != selectedEmployee);
    sessionStorage.setItem("employeesTableDetail", JSON.stringify(savedEmployees));
}
function openDeleteConfirmation() {
    var deleteConfirmation = document.getElementsByClassName('delete-confirmation')[0];
    deleteConfirmation.classList.add('show-delete-confirmation');
}
function closeDeleteConfirmation() {
    var deleteConfirmation = document.getElementsByClassName('delete-confirmation')[0];
    deleteConfirmation.classList.remove('show-delete-confirmation');
}
function deleteRow() {
    const employeeTable = document.getElementById("employee-table");
    var rows = employeeTable.getElementsByTagName('tr');
    var checkbox = document.querySelectorAll('.check-box-col input');
    for (var i = 1; i < rows.length; i++) {
        if (checkbox[i].checked) {
            deleteFromSessionStorage(rows[i]);
        }
    }
    closeDeleteConfirmation();
    unpoplateTable();
    populateTable();
}
function openAddEmployeeModal() {
    var AddEmployeeModal = document.getElementsByClassName('add-employee-form')[0];
    AddEmployeeModal.classList.add('show-addEmployee-form');
}
function closeAddEmployeeModal() {
    const form = document.getElementById("employeeForm");
    form.reset();
    [...form.querySelectorAll('input'), ...form.querySelectorAll('select')].forEach(element => {
        // showValidInput(element, "");
        element.disabled = false;
    });
    document.getElementById('profileImagePreview').src = "/images/add-employee-default-user.svg";
    let submitBtn = document.querySelector('#submitButton');
    submitBtn.style.display = "";
    submitBtn.textContent = "Add Employee";
    document.querySelector('#cancel').textContent = "Cancel";
    document.getElementsByClassName('upload-profile-pic-btn')[0].style.display = '';
    document.getElementsByClassName('upload-profile-pic-btn')[0].disabled = false;
    document.getElementsByClassName('add-employee-form')[0].classList.remove('show-addEmployee-form');
    unpoplateTable();
    populateTable();
}
function displayImagePreview(event) {
    const inputElement = document.getElementById("profileImageInput");
    const image = inputElement.files ? inputElement.files[0] : undefined;
    if (image) {
        const url = URL.createObjectURL(image);
        document.querySelector('#profileImagePreview').src = url;
    }
}
function showValidInput(element, message) {
    element.style.outlineColor = "red";
    let parentDiv = element.parentElement;
    let span = parentDiv === null || parentDiv === void 0 ? void 0 : parentDiv.querySelector('span');
    if (span) {
        span.innerHTML = message;
        span.style.color = "red";
    }
}
function checkValidation(event) {
    event.preventDefault();
    const editflag = document.querySelector('#submitButton').textContent.toLowerCase().split(' ').join('') !== "addemployee";
    const employees = employeesDetails('employeesTableDetail'); // replace any with the actual type
    const form = document.getElementById("employeeForm");
    const formInput = form.querySelectorAll('input:not([name="dob"])');
    const formSelect = form.querySelectorAll('select');
    let flag = true;
    for (const element of formInput) {
        switch (element.name) {
            case 'empNo':
                if (!editflag) {
                    if (element.value === "") {
                        showValidInput(element, `&#9888; This is a required field`);
                        flag = false;
                    }
                    else if (employees.some(emp => emp.empNo === element.value)) {
                        showValidInput(element, `&#9888; Employee ID already exists!`);
                        flag = false;
                    }
                    else {
                        showValidInput(element, ``);
                    }
                }
                break;
            case 'mobileNumber':
                if (element.value === "") {
                    showValidInput(element, `&#9888; This is a required field`);
                    flag = false;
                }
                else if (element.value.toString().length !== 10) {
                    showValidInput(element, `&#9888; Enter a valid number`);
                    flag = false;
                }
                else {
                    showValidInput(element, ``);
                }
                break;
            case 'firstName':
            case 'lastName':
                if (element.value === "") {
                    showValidInput(element, `&#9888; This is a required field`);
                    flag = false;
                }
                else if (!/^[A-Za-z]+$/.test(element.value)) {
                    showValidInput(element, `&#9888; Only alphabets are allowed`);
                    flag = false;
                }
                else {
                    showValidInput(element, ``);
                }
                break;
            case 'email':
                if (element.value === "") {
                    showValidInput(element, `&#9888; This is a required field`);
                    flag = false;
                }
                else if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(element.value)) {
                    showValidInput(element, `&#9888; Invalid Email Address`);
                    flag = false;
                }
                else {
                    showValidInput(element, ``);
                }
                break;
            case 'joiningDate':
                const currentDate = new Date();
                const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                const currentDateFormatted = `${currentDate.getFullYear()}${currentMonth}${currentDate.getDate()}`;
                const inputDate = element.value.split('-').join('');
                if (element.value === "") {
                    showValidInput(element, `&#9888; This is a required field`);
                    flag = false;
                }
                else if (parseInt(inputDate) > parseInt(currentDateFormatted)) {
                    showValidInput(element, `&#9888; Invalid date`);
                    flag = false;
                }
                else {
                    showValidInput(element, ``);
                }
                break;
            default:
                break;
        }
    }
    for (const element of formSelect) {
        if (element.value === '') {
            showValidInput(element, `&#9888; This is a required field`);
            flag = false;
        }
        else {
            showValidInput(element, ``);
        }
    }
    if (!flag)
        return;
    if (editflag) {
        // updateEmployee(document.getElementById('empNo').value);
    }
    else {
        handleFormSubmit(event);
    }
    unpoplateTable();
    populateTable();
}
function handleFormSubmit(event) {
    const form = document.getElementById("employeeForm");
    const formData = new FormData(form);
    const empNo = formData.get("empNo");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const joiningDate = formData.get("joiningDate").split('-').reverse().join('/');
    const location = formData.get("location");
    const jobTitle = formData.get("jobTitle");
    const department = formData.get("department");
    const profileImageFile = (formData.get("profileImage") || undefined);
    const name = `${firstName} ${lastName}`;
    let newEmployeeDetails = {
        "dept": department,
        "email": email,
        "empNo": empNo,
        "img": "",
        "joinDate": joiningDate,
        "location": location,
        "name": name,
        "role": jobTitle,
        "status": "Active"
    };
    if (profileImageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profileImageFile);
        reader.onload = function () {
            newEmployeeDetails.img = reader.result;
            saveToSessionStorage(newEmployeeDetails);
        };
    }
    else {
        saveToSessionStorage(newEmployeeDetails);
    }
    form.reset();
    alert("Employee data has been stored !");
    closeAddEmployeeModal();
}

document.addEventListener("DOMContentLoaded", function () {
});
interface employeeData {
    img: string,
    name: string,
    email: string,
    location: string,
    dept: string,
    role: string,
    empNo: string,
    status: string,
    mobile?: string,
    joinDate: string
};
function saveToSessionStorage(employee: employeeData) {
    let savedEmployees:employeeData[]= JSON.parse(sessionStorage.getItem("employeesTableDetail") || 'null')
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
function employeesDetails(key: string): employeeData[] | null {
    const employees: employeeData[] | null = JSON.parse(sessionStorage.getItem(key) || 'null');
    return employees;
}
function getFilteredEmployees() {
    const employees: employeeData[] | null = JSON.parse(sessionStorage.getItem('FilteredEmployeesDetail') || 'null');
    return employees;
}
function populateTable(): void {
    const employees: employeeData[] | null = JSON.parse(sessionStorage.getItem('employeesTableDetail') || 'null');
    if (employees && employees.length > 0) {
        employees.forEach(employee => {
            addRow(employee);
        });
    } else {
        console.log('No employee data available.');
    }
}

function unpoplateTable() {
    let tbody = document.getElementsByTagName('tbody')[0]!;
    while (tbody.hasChildNodes()) {
        if (tbody.lastChild != null) {

            tbody.removeChild(tbody.lastChild);
        }
    }
}

function populateFilteredTable(filteredEmployees: employeeData[]) {
    unpoplateTable();
    sessionStorage.setItem('FilteredEmployeesDetail', JSON.stringify(filteredEmployees));
    const employees: employeeData[] | null = JSON.parse(sessionStorage.getItem('FilteredEmployeesDetail') || "null");
    if (employees && employees.length > 0) {
        employees.forEach(employee => {
            addRow(employee);
        });
    } else {
        console.log('No employee data available.');
    }
}
function resetFilterStorage() {
    let employee: employeeData[] = employeesDetails('employeesTableDetail')!;
    sessionStorage.setItem('FilteredEmployeesDetail', JSON.stringify(employee));
}
let isCollapsed: boolean = true;
function collapseSection(): void {
    const icon = document.querySelector(".collapse-btn") as HTMLImageElement;
    const mainBody = document.getElementById("main-body") as HTMLElement;
    const updateBlock = document.querySelector('.install-update') as HTMLElement;
    const sideBarOptionsName = document.querySelectorAll('.text') as NodeListOf<HTMLElement>;
    const sideBarOptions = document.querySelectorAll('.side-bar-options') as NodeListOf<HTMLElement>;
    const functioName = document.querySelectorAll('.function-name') as NodeListOf<HTMLElement>;
    const downArrow = document.querySelectorAll('.side-bar-options .arrow') as NodeListOf<HTMLImageElement>;
    const iconImage = document.querySelectorAll('.lock-icon img') as NodeListOf<HTMLImageElement>;
    const fullLogo = document.querySelector('.tezo-logo img') as HTMLImageElement;
    const logo = document.querySelector(".logo-icon img") as HTMLImageElement;
    const employeeBody = document.querySelector(".employees-detail") as HTMLElement;
    const searchBar = document.querySelector(".search-bar") as HTMLElement;

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

function addRow(employee:employeeData) {
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
    moreDetails.textContent = "More Details"
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
function searchBar(): void {
    let searchInput = (document.querySelector(".search-input input") as HTMLInputElement).value;
    searchInput = searchInput.split(' ').join('').toLowerCase();
    let table = document.querySelector(".employee-table tbody")! as HTMLTableElement;
    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i]! as HTMLTableRowElement;
        let name = row.cells[1].textContent;
        if (name != null) {
            name = name.split(" ").join("").toLowerCase().trim();
            if (!name.startsWith(searchInput)) {
                row.style.display = "none";
            } else {
                row.style.display = "";
            }
        }
    }
}

function activateDeleteButton(): void {
    let employeeTable = document.getElementById("employee-table") as HTMLTableElement;
    let tr = employeeTable.querySelectorAll('tr');
    let deleteBtn = document.getElementsByClassName("delete-btn")[0] as HTMLButtonElement;
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

function selectAllRow():void {
    var checkbox = document.querySelectorAll('.check-box-col input') as NodeListOf<HTMLInputElement>;
    var isChecked = checkbox[0].checked;
    for (var i = 1; i < checkbox.length; i++) {
        checkbox[i].checked = isChecked;
    }
    activateDeleteButton();
}

function toggleStatus(this: HTMLButtonElement): void {
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

function setAlphabeticFilter() {
    var alphabetFilterParent = document.querySelector('.a-to-z-filter') as HTMLElement;
    var aplhabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)') as NodeListOf<HTMLElement>;
    aplhabets.forEach(function (child: HTMLElement): void {
        child.onclick = function () {
            console.log(this);
            applyAlphabeticFilter(this);
        };
    });
}

function applyAlphabeticFilter(event: any) {
    let alphabetFilterParent = document.querySelector('.a-to-z-filter') as HTMLElement;
    let allAlphabets = alphabetFilterParent.querySelectorAll('div:not(:first-child)') as NodeListOf<HTMLElement>;
    let filterIcon = document.getElementById('filter-icon') as HTMLImageElement;
    let filteredEmployees = [];
    if (event.classList.contains('selected')) {
        allAlphabets.forEach(x => x.classList.remove('selected'));
        filterIcon.classList.remove('selected');
        resetFilterStorage();
        populateTable();
        return;
    }
    let input = event.textContent;
    let rows: employeeData[] = employeesDetails('employeesTableDetail')!;
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

function toggleFilter(filterId: string): void {
    const filter = document.querySelector(`#${filterId}-filter .${filterId}-dropdown`) as HTMLElement;
    filter.classList.toggle('hide');
}

function displayStatusFilter(): void {
    toggleFilter('status');
}

function displayLocationFilter(): void {
    toggleFilter('location');
}

function displayDepartmentFilter(): void {
    toggleFilter('department');
}
function checkFilter(employee:string, filterType:string) {
    const filterElement = document.getElementById(`${filterType}-filter`)!;
    const filterInputs = filterElement.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
    const selectedFilters:string[] = [];

    filterInputs.forEach(input => {
        if (input.checked) {
            const filterText = input.parentElement?.textContent?.toLowerCase().split(' ').join('')!;
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

function checkStatusFilter(employee:string) {
    return checkFilter(employee, 'status');
}

function checkLocationFilter(employee:string) {
    return checkFilter(employee, 'location');
}

function checkDepartmentFilter(employee:string) {
    return checkFilter(employee, 'department');
}
function applyFilter() {
    let filteredEmployees = [];
    let status, location, department;
    let rows = employeesDetails('employeesTableDetail')!;
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
    var status = document.querySelector("#status-filter .status-dropdown")!  as HTMLElement;
    var department = document.querySelector("#department-filter .department-dropdown")!  as HTMLElement;
    var location = document.querySelector("#location-filter .location-dropdown")! as HTMLElement;
    if (!status.classList.contains('hide'))
        status.classList.add('hide');
    if (!department.classList.contains('hide'))
        department.classList.add('hide');
    if (!location.classList.contains('hide'))
        location.classList.add('hide');
    let input = document.querySelectorAll('.filter-options-container input') as NodeListOf<HTMLInputElement>;
    input.forEach((element) => {element.checked = false});
    unpoplateTable()
    populateTable();
    resetFilterStorage();
    // checkAlphabeticFilter();
    // disableFilterBtn();
}
function selectFilter(this: any, event:any):void {
    let currentElement:HTMLElement= this;
    let checkbox = currentElement.querySelector('input') as HTMLInputElement;
    const element = event.target;
    if (element == checkbox)
        return;
    if (checkbox.checked)
        checkbox.checked = false;
    else
        checkbox.checked = true;
}

function deleteFromSessionStorage(employee:HTMLElement) {
    let savedEmployees:employeeData[]= JSON.parse(sessionStorage.getItem("employeesTableDetail")|| '{}')!;
    let selectedEmployee:string|null;
    if(employee.querySelector('.col-emp-no')!=null){
        selectedEmployee = employee.querySelector('.col-emp-no')!.textContent;
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
    const employeeTable = document.getElementById("employee-table")!;
    var rows = employeeTable.getElementsByTagName('tr');
    var checkbox = document.querySelectorAll('.check-box-col input') as NodeListOf<HTMLInputElement>;
    for (var i = 1; i < rows.length; i++) {
        if (checkbox[i].checked) {
            deleteFromSessionStorage(rows[i]);
        }
    }
    closeDeleteConfirmation();
    unpoplateTable();
    populateTable();
}
function openAddEmployeeModal():void {
    var AddEmployeeModal = document.getElementsByClassName('add-employee-form')[0];
    AddEmployeeModal.classList.add('show-addEmployee-form');
}

function closeAddEmployeeModal():void {
    const form = document.getElementById("employeeForm") as HTMLFormElement;
    form.reset();
    [...form.querySelectorAll('input'), ...form.querySelectorAll('select')].forEach(element => {
        // showValidInput(element, "");
        element.disabled = false;
    });
    (document.getElementById('profileImagePreview')! as HTMLImageElement).src = "/images/add-employee-default-user.svg";
    let submitBtn=(document.querySelector('#submitButton')! as HTMLButtonElement)
    submitBtn.style.display = "";
    submitBtn.textContent = "Add Employee";
    (document.querySelector('#cancel')! as HTMLButtonElement).textContent = "Cancel";
    (document.getElementsByClassName('upload-profile-pic-btn')[0]! as HTMLButtonElement).style.display = '';
    (document.getElementsByClassName('upload-profile-pic-btn')[0]! as HTMLButtonElement).disabled = false;
    document.getElementsByClassName('add-employee-form')[0].classList.remove('show-addEmployee-form');
    unpoplateTable();
    populateTable();
}

function displayImagePreview(event: Event): void {
    const inputElement = document.getElementById("profileImageInput") as HTMLInputElement;
    const image: File | undefined = inputElement.files ? inputElement.files[0] : undefined;
    if (image) {
        const url: string = URL.createObjectURL(image);
        (document.querySelector('#profileImagePreview') as HTMLImageElement).src = url;
    }
}


function showValidInput(element:HTMLElement, message:string):void {
    element.style.outlineColor = "red";
    let parentDiv = element.parentElement;
    let span = parentDiv?.querySelector('span');
    if (span) {
        span.innerHTML = message;
        span.style.color = "red";
    }
}

function checkValidation(event:Event) {
    event.preventDefault();
    const editflag: boolean = (document.querySelector('#submitButton') as HTMLElement).textContent!.toLowerCase().split(' ').join('') !== "addemployee";
    const employees: employeeData[] | null = employeesDetails('employeesTableDetail'); // replace any with the actual type
    const form: HTMLFormElement = document.getElementById("employeeForm") as HTMLFormElement;
    const formInput: NodeListOf<HTMLInputElement> = form.querySelectorAll('input:not([name="dob"])');
    const formSelect: NodeListOf<HTMLSelectElement> = form.querySelectorAll('select');
    let flag = true;
    for (const element of formInput) {
        switch (element.name) {
            case 'empNo':
                if (!editflag) {
                    if (element.value === "") {
                        showValidInput(element, `&#9888; This is a required field`);
                        flag = false;
                    } else if (employees!.some(emp => emp.empNo === element.value)) {
                        showValidInput(element, `&#9888; Employee ID already exists!`);
                        flag = false;
                    } else {
                        showValidInput(element, ``);
                    }
                }
                break;
            case 'mobileNumber':
                if (element.value === "") {
                    showValidInput(element, `&#9888; This is a required field`);
                    flag = false;
                } else if (element.value.toString().length !== 10) {
                    showValidInput(element, `&#9888; Enter a valid number`);
                    flag = false;
                } else {
                    showValidInput(element, ``);
                }
                break;
            case 'firstName':
            case 'lastName':
                if (element.value === "") {
                    showValidInput(element, `&#9888; This is a required field`);
                    flag = false;
                } else if (!/^[A-Za-z]+$/.test(element.value)) {
                    showValidInput(element, `&#9888; Only alphabets are allowed`);
                    flag = false;
                } else {
                    showValidInput(element, ``);
                }
                break;
            case 'email':
                if (element.value === "") {
                    showValidInput(element, `&#9888; This is a required field`);
                    flag = false;
                } else if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(element.value)) {
                    showValidInput(element, `&#9888; Invalid Email Address`);
                    flag = false;
                } else {
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
                } else if (parseInt(inputDate) > parseInt(currentDateFormatted)) {
                    showValidInput(element, `&#9888; Invalid date`);
                    flag = false;
                } else {
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
        } else {
            showValidInput(element, ``);
        }
    }
    if (!flag) return;
    if (editflag) {
        // updateEmployee(document.getElementById('empNo').value);
    } else {
        handleFormSubmit(event);
    }
    unpoplateTable();
    populateTable();
}

function handleFormSubmit(event:Event) {
    const form = document.getElementById("employeeForm") as HTMLFormElement;
    const formData = new FormData(form);
    const empNo = formData.get("empNo");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const joiningDate =(formData.get("joiningDate")! as string).split('-').reverse().join('/');
    const location = formData.get("location");
    const jobTitle = formData.get("jobTitle");
    const department = formData.get("department");
    const profileImageFile = (formData.get("profileImage") as File || undefined);
    const name = `${firstName} ${lastName}`;

    let newEmployeeDetails:employeeData= {
        "dept": <string>department ,
        "email": <string>email,
        "empNo": <string>empNo,
        "img": "",
        "joinDate": <string>joiningDate,
        "location": <string>location,
        "name": <string>name,
        "role": <string>jobTitle,
        "status": "Active"
    };
    if (profileImageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profileImageFile);
        reader.onload = function () {
            newEmployeeDetails.img =(reader.result as string);
            saveToSessionStorage(newEmployeeDetails);
        };
    } else {
        saveToSessionStorage(newEmployeeDetails);
    }
    form.reset();
    alert("Employee data has been stored !");
    closeAddEmployeeModal();
}

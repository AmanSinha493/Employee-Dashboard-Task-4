document.addEventListener("DOMContentLoaded",async function () {
    console.log("ts called");
    async function employeeRowsJson() {
        try {
            if (!sessionStorage.getItem('employeesTableDetail')) {
                const response = await fetch("../employeesDetails.json");
                var employeeList = await response.json();
                for (let i = 0; i < employeeList.length; i++) {
                    console.log(employeeList[i])
                    saveToSessionStorage(employeeList[i]);
                }
                window.location.reload();
                // resetFilterStorage();
            }
        } catch (error) {
            console.error("Error fetching JSON:", error);
        }
    }
    employeeRowsJson();
    populateTable();
    setAlphabeticFilter();
    let uploadProfilePic = document.getElementById('profileImageInput')!;
    uploadProfilePic.addEventListener('change', displayImagePreview);
    const addEmployeeForm = document.getElementsByClassName('add-employee-form')[0];
    addEmployeeForm.addEventListener("submit", checkValidation);
    let searchInput=document.querySelector(".search-input input") as HTMLInputElement;
    searchInput.addEventListener('input',searchBar);
    let input = document.querySelectorAll('.filter-options-container input') as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < input.length; i++) {
       let select=input[i].parentNode! as HTMLElement;
    //    select.addEventListener('click',selectFilter) 
       select.addEventListener('click',selectFilter); 
    }
});


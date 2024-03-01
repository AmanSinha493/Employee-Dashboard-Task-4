export type EmployeeData ={
    img: string,
    name: string,
    email: string,
    location: string,
    dept: string,
    role: string,
    empNo: string,
    status: string,
    roleId?:string,
    mobile: string,
    joinDate: string
};

export type roleData = [string,
    {
        employees: EmployeeData[],
        roleId: string
    }
];

// let allAlphabets = (document.querySelector('.a-to-z-filter') as HTMLElement)?.querySelectorAll('div:not(:first-child)') as NodeListOf<HTMLElement>;
//     let filterIcon = document.getElementById('filter-icon') as HTMLImageElement;


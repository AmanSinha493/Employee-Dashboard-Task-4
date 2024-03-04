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



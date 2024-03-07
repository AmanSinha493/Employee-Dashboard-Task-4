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

export interface RoleDetail 
{
    role: string,
    location:string,
    dept:string
};

export interface Role {
[key: string]: RoleDetail
}


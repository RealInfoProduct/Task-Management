export interface AuthResponse {
    idToken:string,
    email:string,
    refreshToken:string,
    expiresIn:string,
    localId:string
    registerd?:boolean
}

export interface companyList { 
    id: string,
    companyName: string,
    companyLogo: any,
    email:string,
    password:string,
    mobileNumber : number,
    status: string,
    endDate: string,
    userRole: string,
}

export interface UserList { 
    id: string,
    email:string,
    password:string,
    mobileNumber: number,
    companyName: string,
    companyLogo: string,
    status: string,
    endDate: string,
    userRole: string,
}

export interface TechnologyList { 
    id:string,
    technologyName:string
}

export interface ProjectRoleList { 
    id:string,
    ProjectRoleName:string
}

export interface ProjectList { 
    id:string,
    projectName:string
    pointOfContact:string
    selectedTechnology:string
}

export interface EmaployeeList{
    id:string
    emaployeeName:any
    emaployeeMobile:any
    emaployeeEmail:any
    emaployeeUserName:any
    emaployeePassword:any
    selectEmployeeRole:any
    selectEmployeeTechnology:any
    selectEmployeeStatus:any
    selectProject:any
    selectProjectRole:any
}
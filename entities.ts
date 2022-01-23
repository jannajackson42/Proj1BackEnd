export interface Employee{
    id: string;
    fname: string;
    lname: string;
    manager:boolean;
    username:string;
    password:string;
    reimbursements: Reimbursement[];
}

export interface Reimbursement{
    id: string;
    name:string;
    date:string;
    amount: number;
    status: string;
    notes?: string;
}

export interface Login{
    employeeid:string;
    id:string;
    username:string;
    password:string;
}
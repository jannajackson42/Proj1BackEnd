import { v4 } from "uuid";
import { EmployeeDAO } from "../daos/employee-dao";
import { Reimbursement, Employee } from "../entities";
import { LoginDAO, logindao } from "../daos/login-dao";



export default interface EmployeeReimbs{
    addReimbursement(id:string,reimbursement:Reimbursement): Promise<Reimbursement>;
    getAllEmployees(): Promise<Employee[]>;
    getEmployee(employeeID:string): Promise<Employee>;
    updateEmployee(employee:Employee):Promise<Employee>;
    getAllReimbs():Promise<Reimbursement[]>;
    getReimbsByEmpID(employeeID:string):Promise<Reimbursement[]>;
    approveReimbsByID(employeeID:string,reimbID:string,newmessage:string):Promise<Boolean>;
    denyReimbsByID(employeeID:string, reimbID:string,newmessage:string):Promise<Boolean>;
    getReimbByID(employeeID:string,reimbID:string):Promise<Reimbursement>;
}

export class EmployeeActions implements EmployeeReimbs{
    constructor(private employeeDAO: EmployeeDAO){}

    async getEmployee(employeeID:string): Promise<Employee> {
      return this.employeeDAO.getEmployeeByID(employeeID);
    }

    async getAllEmployees(): Promise<Employee[]> {
        return this.employeeDAO.getAllEmployees();
        
    }

    async updateEmployee(employee:Employee):Promise<Employee>{
        return this.employeeDAO.updateEmployee(employee);
    }

    async addReimbursement(id:string,reimbursement:Reimbursement): Promise<Reimbursement> {
        let employee:Employee=await this.employeeDAO.getEmployeeByID(id)
        reimbursement.id = v4();
        reimbursement.status = "Pending";
        employee.reimbursements.push(reimbursement)
        await this.employeeDAO.updateEmployee(employee)
        return (reimbursement);
    }

    async getAllReimbs(): Promise<Reimbursement[]> {
        let employees:Employee[] = await this.getAllEmployees();
        const allreimbs:Reimbursement[]=employees.map(employee => employee.reimbursements).flat();
        return allreimbs;
     }
     
    async getReimbsByEmpID(employeeID:string): Promise<Reimbursement[]> {
        const employee = await this.employeeDAO.getEmployeeByID(employeeID);
        return employee.reimbursements;
    }
    
    async getReimbByID(employeeID: string, reimbID: string): Promise<Reimbursement> {
        const employee = await this.employeeDAO.getEmployeeByID(employeeID);
        return employee.reimbursements.find(reimbursement=> reimbursement.id === reimbID);
    }
    
    async approveReimbsByID(employeeID:string,reimbID:string,newMessage:string):Promise<Boolean>{
        let employee:Employee = await this.getEmployee(employeeID);
        let reimb = employee.reimbursements.find(reimbursement=> reimbursement.id === reimbID);
        reimb.notes = newMessage;
        reimb.status = "Approved";
        await this.updateEmployee(employee);
        return true;
    }

    async denyReimbsByID(employeeID:string,reimbID:string,newMessage):Promise<Boolean>{
        const employee = await this.getEmployee(employeeID);
        let reimb = employee.reimbursements.find(reimbursement=> reimbursement.id === reimbID);
        reimb.notes = newMessage
        reimb.status = "Denied";
        await this.updateEmployee(employee);
        return true;
    }

    }

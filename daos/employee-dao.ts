
import { Employee } from "../entities"
import {v4} from 'uuid'
import { Reimbursement } from "../entities"
import { CosmosClient } from "@azure/cosmos";
import { response } from "express";

export interface EmployeeDAO{
//Create
//Read
    getEmployeeByID(employeeID:string): Promise <Employee>
    getAllEmployees():Promise<Employee[]>
//Update
    updateEmployee(employee:Employee): Promise<Employee>
//Delete

}


export class EmployeeDAOAzure implements EmployeeDAO{
    
    private client = new CosmosClient ('AccountEndpoint=https://employee-reimbursement.documents.azure.com:443/;AccountKey=ICfEA4QIVkiF9xYNA97qaegGsRlZzx8vpiG0IhJ1VDrIRe1Nr9CHKRQbov1Gwskb708a3DWrdatx93FyBecrpA==');
    private database = this.client.database('employeeReimbDB');
    private container = this.database.container ('employeeReimbs');


    async getEmployeeByID(employeeID:string):Promise<Employee>{
        const response = await this.container.item(employeeID, employeeID).read<Employee>();// resource-key, partition-key (the same for most containers)
        if(!response.resource){
            throw (`The employee with id ${employeeID} was not found`);
        }
        else{return {id:response.resource.id, fname: response.resource.fname,lname: response.resource.lname, manager: response.resource.manager, reimbursements: response.resource.reimbursements, username:response.resource.username, password:response.resource.password}
        }}

    async getAllEmployees(): Promise<Employee[]> {
        const response = await this.container.items.readAll<Employee>().fetchAll()
        return response.resources.map(i => ({id: i.id, fname:i.fname, lname:i.lname, manager:i.manager, reimbursements:i.reimbursements, username:i.username, password:i.password}))
        }

    async updateEmployee(employee: Employee): Promise<Employee> {
        const response = await this.container.items.upsert<Employee>(employee);
        return (employee);
     }
 
}
export const employeeDaoAzure= new EmployeeDAOAzure();

    


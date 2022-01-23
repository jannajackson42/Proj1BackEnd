import { logindao, LoginDAO, loginDaoAzure } from "../daos/login-dao";
import { Employee } from "../entities";
import { EmployeeDAO, employeeDaoAzure } from "../daos/employee-dao";
import { EmployeeActions } from "./employee-services";

export interface LoginService{

    loginWithUsernamePassword(username:string, password:string):Promise<Employee>
    getEmployeeByUser(username:string):Promise<Employee>;

}

export class LoginServiceImpl implements LoginService{
    private loginDao:LoginDAO

    constructor(private employeeDAO: EmployeeDAO, private logindao: LoginDAO){}

    async getEmployeeByUser(username: string): Promise<Employee> {
        const login = await loginDaoAzure.getIDByUsername(username);
        const id = login.employeeid
        return this.employeeDAO.getEmployeeByID(id);
    }

    async loginWithUsernamePassword(username: string, password: string): Promise<Employee> {
        let login = await loginDaoAzure.getIDByUsername(username);
        let pass = login.password;
        let employee = await this.getEmployeeByUser(username);
        if(password !== pass){
            throw new Error("Password does not match");
        }else{
            return employee;
        }




    }
}
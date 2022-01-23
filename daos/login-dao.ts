import { CosmosClient } from "@azure/cosmos";
import { Employee, Login } from "../entities";

export interface LoginDAO{

    getIDByUsername(username:string):Promise<Login>   
}

export class logindao implements LoginDAO{
    private client = new CosmosClient('AccountEndpoint=https://employee-reimbursement.documents.azure.com:443/;AccountKey=ICfEA4QIVkiF9xYNA97qaegGsRlZzx8vpiG0IhJ1VDrIRe1Nr9CHKRQbov1Gwskb708a3DWrdatx93FyBecrpA==;')
    private database = this.client.database('employeeReimbDB');
    private container = this.database.container ('login-info');

async getIDByUsername(username:string):Promise<Login>{
    const response = await this.container.item(username, username).read<Login>();
    return (response.resource);
}

}
export const loginDaoAzure= new logindao();
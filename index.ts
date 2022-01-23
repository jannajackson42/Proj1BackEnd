import Express, { response } from "express"
import { employeeDaoAzure, EmployeeDAOAzure } from "./daos/employee-dao";
import { Employee, Reimbursement } from "./entities";
import { EmployeeActions } from "./services/employee-services";
import EmployeeReimbs from "./services/employee-services";
import cors from "cors";
import { logindao, loginDaoAzure } from "./daos/login-dao";
import { LoginService, LoginServiceImpl } from "./services/login-service";

const app=Express();
app.use(cors());
app.use(Express.json());


const employeeService: EmployeeReimbs = new EmployeeActions(employeeDaoAzure);
const loginService: LoginService = new LoginServiceImpl(employeeDaoAzure, loginDaoAzure);

//Get All Employees
app.get('/employees', async(req,res)=>{
    try{
        const employees: Employee[] = await employeeService.getAllEmployees();
            res.send(employees)
        } 
        catch (error:any){
            res.status(404)
            res.send("No Employees Found")
        }
    })
        
//get all reimbursements
app.get('/reimbursements', async(req,res)=>{
    try{
        const reimbursements: Reimbursement[] = await employeeService.getAllReimbs();
        res.send(reimbursements);
    }
    catch(error:any){
        res.status(404)
        res.send("No reimbursements found")
    }
})

//Get Employee by ID
app.get('/employee/:id', async(req,res)=>{
    try {
        let employeeID = req.params.id;
        const employee = await employeeService.getEmployee(employeeID);
        res.send(employee)
    }
    catch (error:any) {
    res.status(404)
    res.send("No Employee Found")
}
})
//get Reimbs by Employee ID
app.get('/reimbursements/:id', async(req,res)=>{
    try{
        const reimbursements:Reimbursement[] = await employeeService.getReimbsByEmpID(req.params.id);
        res.send(reimbursements);
    }
    catch(error:any){
        res.status(404);
        res.send(`No Reimbursements Found for employee ${req.params.id}.`)
    }
})

//get Reimb by Reimb ID
app.get('reimbursements/:id/:reimbID', async(req,res)=>{
    try{
        let reimbID = req.params.reimbID;
        let id = req.params.id;
        const reimb = await employeeService.getReimbByID(id,reimbID);
        res.send(reimb);
    }
    catch(error:any){
        res.status(404);
        res.send(`No Reimbursements with id ${req.params.reimbID} found`)
    }
})

//Add Reimbursement to Employee
app.post('/employee/:id', async(req,res)=>{
    try{
    let reimbursement: Reimbursement = req.body;
    let id = req.params.id;
    await employeeService.addReimbursement(id,reimbursement)
    res.status(201)  
    res.send("New reimbursement created for id " + id);
    }
    catch(error){
        res.status(400)
        res.send(error.message);
    }
})

//approve Reimbursement
app.patch('/employee/:id/:reimbid/approve', async(req,res)=>{
    try{
    let reimbid = req.params.reimbid;
    let id = req.params.id;
    let note = req.body.notes;
    await employeeService.approveReimbsByID(req.params.id,req.params.reimbid,req.body.notes);
    res.status(201)
    res.send("Reimbursement Approved!")
    }
    catch(error){}
})

//deny reimbursement
app.patch('/employee/:id/:reimbid/deny', async(req,res)=>{
    let reimbid = req.params.reimbid;
    let id = req.params.id;
    let note = req.body.notes;
    await employeeService.denyReimbsByID(req.params.id,req.params.reimbid,req.body.notes);
    res.status(201)
    res.send("Reimbursement Denied")
    
})

app.get('/employee/find/:username', async(req,res)=>{
    let username = req.params.username;
    let employee = await loginService.getEmployeeByUser(username);
    res.status(201)
    res.send(employee)
})

app.patch('/login', async (req,res)=>{
    try{
    const body:{username:string,password:string} = req.body;
    const employee:Employee = await loginService.loginWithUsernamePassword(body.username,body.password);
    let answer={...employee,...body}
    res.status(201);
    res.send(answer);
    }
    catch(error){
        res.status(400);
        res.send("Unable to login, check that your Username and Password are correct");
    }
})


app.listen(4000, () => console.log('App started'))


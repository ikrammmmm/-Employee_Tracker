const inquirer = require("inquirer");
const consoleTable = require("console.table");
const questions = require("./assets/lib/questions.js")
const con = require("./assets/lib/connection.js");
const Query = require("./assets/lib/queries.js");
const query = new Query();

//To ask user
const promptUser = (question) => {
  return inquirer.prompt(question);
}

//check if table is empty
function checkDepartment(departments) {
  if(!departments.length) return -1;
}

function checkRole(roles) {
  if(!roles.length) return -1;
}

function checkEmployee(employees) {
  if(!employees.length) return -1;
}

//Get index of the choosen answer
function getDepartmentIndex(departments,answer) {
  return  departments.findIndex(i => i.name === answer.department);
}

function getRoleIndex(roles,answer) {
  return  roles.findIndex(i => i.title === answer.role);
}

function getEmployeeIndex(employees,answer) {
  return  employees.findIndex(i => i.first_name +' (id:'+ i.id+')' === answer.employee);
}
function getEmployeeIndexToRemove(employees,employee_id) {
  return employees.findIndex(i=>i.id === employee_id);
}

//Remove chosen employee from list of possible managers
function RemoveEmployeeFromChoices(employees,employee_id) {
  let employee_index_remove = getEmployeeIndexToRemove(employees,employee_id);
  employees.splice(employee_index_remove,1);
  return employees;
}

//Let user choose from the table
async function ChooseDepartment(departments,message) {
  let departments_choice = getDepartmentChoices(departments);
  let answer = await promptUser(questions.chooseDepartment(departments_choice,message));
  let department_index = getDepartmentIndex(departments,answer);

  return departments[department_index].id;
}

async function ChooseRole(roles, message) {
  let roles_choice = getRoleChoices(roles);
  let answer = await promptUser(questions.chooseRole(roles_choice,message));
  let role_index = getRoleIndex(roles,answer);

  return roles[role_index].id;
}

async function ChooseEmployee(employees,message) {
  let employees_choice = getEmployeeChoices(employees);
  let answer = await promptUser(questions.chooseEmployee(employees_choice,message));
  let employee_index = getEmployeeIndex(employees,answer);

  return employees[employee_index].id;
}

async function ChooseManager(employees,message) {
  let employees_choice = [];
  if(employees.length) employees_choice = getEmployeeChoices(employees);
  employees_choice.push("None");

  let answer = await promptUser(questions.chooseEmployee(employees_choice,message));
  if(answer.employee === "None") return null;
  let employee_index = getEmployeeIndex(employees,answer);

  return employees[employee_index].id;
}


//Get list of choices for user
function getDepartmentChoices(departments) {
  let departments_choice = [];
  for(let i of departments) departments_choice.push(i.name);
  return departments_choice;
}

function  getRoleChoices(roles) {
  let roles_choice = [];
  for(let i of roles) roles_choice.push(i.title);
  return roles_choice;
}

function getEmployeeChoices(employees) {
  let employees_choice = [];
  for(let i of employees) employees_choice.push(i.first_name + ' (id:' + i.id + ')');
  return employees_choice;
}


//View Functions
async function ViewEmployeeByManager() {
  let managers = await query.ViewManager();
  let hasManager = checkEmployee(managers);

  if(hasManager === -1) return "No Managers";
  const manager_id = await ChooseEmployee(managers,"manager");

  return await query.ViewEmployeeByManager(manager_id);
}

async function ViewTotalUtilizedBudget() {
  let departments = await query.ViewDepartment();
  let hasDepartment = checkDepartment(departments);

  if(hasDepartment === -1) {console.log("No Departments"); return ;}
  const department_id = await ChooseDepartment(departments,"department");

  return await query.ViewTotalUtilizedBudget(department_id);
}


//Add Functions
async function addDepartment() {
  const answer =  await promptUser(questions.addDepartment);
  await query.AddDepartment(answer.name);
}

async function addRole() {
  let departments = await query.ViewDepartment();
  let hasDepartment = checkDepartment(departments);
  
  if(hasDepartment === -1) {console.log("Create Department First!"); return ;}

  const role = await promptUser(questions.addRole());
  const department_id = await ChooseDepartment(departments,"associated department");

  await query.AddRole(role.title,role.salary,department_id);
}

async function addEmployee() {
  let roles = await query.ViewRole();
  let employees = await query.ViewEmployee();
  let hasRole = checkRole(roles);

  if(hasRole === -1) {console.log("Create Role First!"); return ;}

  const employee = await promptUser(questions.addEmployee());
  const role_id = await ChooseRole(roles,"role");
  const manager_id = await ChooseManager(employees,"manager"); 

  await query.AddEmployee(employee.first_name,employee.last_name,role_id,manager_id);
} 


//Update Functions
async function UpdateEmployeeRole() {

  let employees = await query.ViewEmployee();
  let roles = await query.ViewRole();
  let hasEmployee = checkEmployee(employees);

  if(hasEmployee === -1) {console.log("No Employees"); return ;}

  const employee_id = await ChooseEmployee(employees,"employee");
  const role_id = await ChooseRole(roles,"new role");

  await query.UpdateEmployeeRole(employee_id,role_id);
}

async function UpdateEmployeeManager() {

  let employees = await query.ViewEmployee();
  let hasEmployee = checkEmployee(employees);

  if(hasEmployee === -1) {console.log("No Employees"); return ;}

  const employee_id = await ChooseEmployee(employees,"employee");
  employees = RemoveEmployeeFromChoices(employees,employee_id);
  const manager_id = await ChooseManager(employees,"new manager");

  await query.UpdateEmployeeManager(employee_id,manager_id);
}


//Delete Functions
async function DeleteDepartment() {
  let departments = await query.ViewDepartment();
  let hasDepartment = checkDepartment(departments);

  if(hasDepartment === -1) {console.log("No Departments"); return ;}
  let department_id = await ChooseDepartment(departments,"department");

  await query.DeleteDepartment(department_id);
}

async function DeleteRole() {
  let roles = await query.ViewRole();
  let hasRole = checkRole(roles);

  if(hasRole === -1) {console.log("No Roles"); return ;}
  let role_id = await ChooseRole(roles,"role");

  await query.DeleteRole(role_id);
}

async function DeleteEmployee() {
  let employees = await query.ViewEmployee();
  let hasEmployee = checkEmployee(employees);

  if(hasEmployee === -1) {console.log("No Employees"); return ;}
  let employee_id = await ChooseEmployee(employees,"employee");

  await query.DeleteEmployee(employee_id);
}

//start menu
async function init(){
  const answer =  await promptUser(questions.init);
  let data;
  switch(answer.action) {
    case "View Departments" : data = await query.ViewDepartment(); if(!data.length) data = "No Departments"; console.table(data); break;
    case "View Roles" : data = await query.ViewRole(); if(!data.length) data= "No Roles"; console.table(data); break;
    case "View Employees" : data = await query.ViewEmployee(); if(!data.length) data= "No Employees"; console.table(data); break;
    case "View Employees by Manager" : data = await ViewEmployeeByManager(); console.table(data); break;
    case "View Total Utilized Budget of a Department" : data = await ViewTotalUtilizedBudget(); console.table(data); break;
    
    case "Add Department" : await addDepartment(); break;
    case "Add Role" : await addRole(); break;
    case "Add Employee" : await addEmployee(); break;
    
    case "Update Employee Roles" : await UpdateEmployeeRole(); break;
    case "Update Employee Managers" : await UpdateEmployeeManager(); break;
    
    case "Delete Department" : await DeleteDepartment();break;
    case "Delete Role" : await DeleteRole();break;
    case "Delete Employee" : await DeleteEmployee();break;

    case "Leave" : con.end();  console.log("Disconnected!");return;
  }

  init();
}

//start program
con.connect(async function(err) {
  if (err) throw err;
  console.log("Connected!");
  await init();
});
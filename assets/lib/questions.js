//startup questions
const init = 
    {
        type: "list",
        name: "action",
        pageSize: 14,
        message: "Please indicate the task",
        choices: [
            "View Departments", 
            "View Roles", 
            "View Employees",
            "View Employees by Manager",
            "View Total Utilized Budget of a Department",
            "Add Department", 
            "Add Role", 
            "Add Employee",    
            "Update Employee Roles",
            "Update Employee Managers",
            "Delete Department",
            "Delete Role",
            "Delete Employee",     
            "Leave"
        ]
    };
    
//Add inquiries
const addDepartment = 
    {
        type: "input",
        name: "name",
        message: "Enter name for the New Department",
        validate: (value)=>{ if(value) {return true} else {return 'Please enter a value!'} }
    };


function addRole() {
   return [
        {
            type: "input",
            name: "title",
            message: "Enter title for the New Role",
            validate: (value)=>{ if(value) {return true} else {return 'Please enter a value!'} }
        },
        {
            type: "input",
            name: "salary",
            message: "Enter salary for the New Role",
            validate: (value)=>{ if(value) {return true} else {return 'Please enter a value!'} }
        }
    ];
} 
function addEmployee() {
    return [
        {
            type: "input",
            name: "first_name",
            message: "Enter first name of the employee",
            validate: (value)=>{ if(value) {return true} else {return 'Please enter a value!'} }
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter last name of the employee",
            validate: (value)=>{ if(value) {return true} else {return 'Please enter a value!'} }
        }
        ];
 } 

//Choose inquiries

function chooseDepartment(departments,message) {
    return {
        type: "list",
        name: "department",
        pageSize: departments.length,
        message: `Please choose the ${message}`,
        choices: departments
    };
}

function chooseRole(roles,message) {
    return {
        type: "list",
        name: "role",
        pageSize: roles.length,
        message: `Please choose the ${message}`,
        choices: roles
    };
}

function chooseEmployee(employees,message) {
    return {
         type: "list",
         name: "employee",
         pageSize: employees.length,
         message: `Please choose the ${message}`,
         choices: employees
     };
 }
 
module.exports = {init,addDepartment,addRole,addEmployee,chooseEmployee,chooseDepartment,chooseRole};

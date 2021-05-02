const con = require("./connection.js");

class Query{

    //View Queries
    ViewDepartment() {   
        return new Promise( ( resolve, reject ) => {
            con.query(`SELECT * FROM departments`, (err, result)=>{
                if (err){
                    return reject( err );
                }
                resolve( result );
            });
        })
    }

    ViewRole() {
        return new Promise( ( resolve, reject ) => {
            con.query(`SELECT A.id, A.title, A.salary, B.name AS "department name" 
                        FROM roles A  
                        INNER JOIN departments B
                        ON A.department_id = B.id ;`, 
            (err, result)=>{
                if (err){
                    return reject( err );
                }
                resolve( result );
            });
        })
    }

    ViewEmployee() {
        return new Promise( ( resolve, reject ) => {
            con.query(`SELECT A.id, A.first_name, A.last_name, B.title AS "role", A.manager_id, C.first_name AS "manager"
                        FROM employees A
                        LEFT JOIN roles B
                        ON A.role_id = B.id
                        LEFT JOIN employees C
                        ON A.manager_id = C.id ;`,
             (err, result) => {
                if (err){
                    return reject( err );
                }
                resolve( result );
            });
        })
    } 
    
    ViewManager() {
        return new Promise( ( resolve, reject ) => {
            con.query(`SELECT first_name, last_name,id FROM employees
                        WHERE (id IN (SELECT manager_id FROM employees))`, 
            (err, result) => {
                if (err){
                    return reject( err );
                }
                resolve( result );
            });
        })
    }

    ViewEmployeeByManager(manager_id) {
        return new Promise( ( resolve, reject ) => {
            con.query(`SELECT A.id, A.first_name, A.last_name, B.title AS "role" 
                        FROM employees A
                        INNER JOIN roles B
                        ON A.role_id = B.id AND A.manager_id = ${manager_id};`
                        ,
             (err, result) => {
                if (err){
                    return reject( err );
                }
                resolve( result );
            });
        })
    }

    
    ViewTotalUtilizedBudget(department_id) {
        return new Promise( ( resolve, reject ) => {
            con.query(`SELECT SUM(salary) AS "Total Utilized Budget"
                        FROM employees A
                        INNER JOIN roles B
                        ON A.role_id = B.id AND B.department_id = ${department_id};`,
                (err, result) => {
                    if (err){
                        return reject( err );
                    }
                    if (result[0]['Total Utilized Budget'] == null) result[0]['Total Utilized Budget']=0 ;
                    resolve( result );
                });
        })
    }

    //Add Queries
    AddDepartment(name) {   
        return new Promise( ( resolve, reject ) => {
            con.query("INSERT INTO departments SET ?",
            { name: name },
            (err, result) => {
                if (err){
                    return reject( err );
                }
                console.log(`${name} Department added successfully!`);
                resolve( result );
            });
        })
    }

    AddRole(title,salary,department_id) {   
        return new Promise( ( resolve, reject ) => {
            con.query("INSERT INTO roles SET ?",
            { 
                title: title,
                salary: parseFloat(salary),
                department_id : department_id
            },
            (err, result) => {
                if (err){
                    return reject( err );
                }
                console.log(`${title} Role added successfully!`);
                resolve( result );
            });
        })
    }

    AddEmployee(first_name,last_name,role_id,manager_id) {   
        return new Promise( ( resolve, reject ) => {
            con.query("INSERT INTO employees SET ?",
            { 
                first_name: first_name,
                last_name: last_name,
                role_id : role_id,
                manager_id : manager_id,        
            },
            (err, result) => {
                if (err){
                    return reject( err );
                }
                console.log(`${first_name} ${last_name} Employee added successfully!`);
                resolve( result );
            });
        })
    }

    //Update Queries
    UpdateEmployeeRole(id,role_id) {   
        return new Promise( ( resolve, reject ) => {
            con.query(`UPDATE employees SET role_id =${role_id} WHERE id=${id}`,
            (err, result) => {
                if (err){
                    return reject( err );
                }
                console.log(`Employee's Role updated successfully!`);
                resolve( result );
            });
        })
    }

    UpdateEmployeeManager(id,manager_id) {   
        return new Promise( ( resolve, reject ) => {
            con.query(`UPDATE employees SET manager_id =${manager_id} WHERE id=${id}`,
            (err, result) => {
                if (err){
                    return reject( err );
                }
                console.log(`Employee's Manager updated successfully!`);
                resolve( result );
            });
        })
    }

    //Delete Queries
    DeleteDepartment(department_id) {
        return new Promise( ( resolve, reject ) => {
            con.query(`DELETE FROM departments WHERE id=${department_id};`,
            (err, result) => {
                if (err){
                    return reject( err );
                }
                console.log(`Department deleted successfully!`);
                resolve( result );
            });
        })
    }

    DeleteRole(role_id) {
        return new Promise( ( resolve, reject ) => {
            con.query(`DELETE FROM roles WHERE id=${role_id};`,
            (err, result) => {
                if (err){
                    return reject( err );
                }
                console.log(`Role deleted successfully!`);
                resolve( result );
            });
        })
    }

    DeleteEmployee(employee_id) {
        return new Promise( ( resolve, reject ) => {
            con.query(`DELETE FROM employees WHERE id=${employee_id};`,
            (err, result) => {
                if (err){
                    return reject( err );
                }
                console.log(`Employee deleted successfully!`);
                resolve( result );
            });
        })
    }
}

module.exports = Query;
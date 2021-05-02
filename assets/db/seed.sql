USE Employee_db;

INSERT INTO departments(name)
VALUES
("Sales"),
("Engineering"),
("Management"),
("Finance");

INSERT INTO roles(title, salary,department_id)
VALUES
("Sales Lead",1000,1),
("Salesperson",2000,1),
("Lead Engineer",300,2),
("Software Engineer",400,2),
("Project Manager",4000,3),
("Recruiter",300,3),
("Accountant",20000,4),
("Account Manager",300,4),
("Budget Analyst",400,4);

INSERT INTO employees(first_name,last_name,role_id,manager_id)
VALUES
("John","Smith",1,null),
("Willa","Blow",2,null),
("Emelia","Deacon",3,null),
("Joesph","Blanchard",4,null),
("Harry","Smith",5,null),
("Kent","Kane",6,null),
("Dave","Dew",7,null),
("Trent","Tidd",8,null),
("Oscar","Mayer",9,null);




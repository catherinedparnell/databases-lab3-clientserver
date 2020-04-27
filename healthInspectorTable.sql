USE nyc_inspections;


DROP TABLE IF EXISTS HealthInspectors;
CREATE TABLE IF NOT EXISTS HealthInspectors (
HireDate DATE,
Salary INT,
AdminPrivileges BIT,				# 0 if no, 1 if yes
Username VARCHAR(150) NOT NULL,
Password VARCHAR(150),				# need to make sure this is not stored in plain text
PRIMARY KEY (Username) 				
);

SELECT * FROM HealthInspectors;



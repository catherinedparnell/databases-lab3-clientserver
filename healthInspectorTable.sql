USE nyc_inspections;

-- I just did the attributes that he listed, if we want to add more we can --
DROP TABLE IF EXISTS HealthInspectors;
CREATE TABLE IF NOT EXISTS HealthInspectors (
HireDate DATE,
Salary INT,
AdminPrivileges BIT,				# 0 if no, 1 if yes?
Username VARCHAR(150) NOT NULL,
Password VARCHAR(150),				# need to make sure this is not stored in plain text
PRIMARY KEY (Username) 				# I assume this should be the primary key, unless we made a separate ID?
);

SELECT * FROM HealthInspectors;
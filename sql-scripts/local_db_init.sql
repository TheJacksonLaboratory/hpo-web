### anticipation is that this is run by a user with the required permissions
### root would have this
DROP DATABASE IF EXISTS `hpo_web`;
CREATE DATABASE `hpo_web`;
#DROP USER IF EXISTS 'hpo_web'@'%';
CREATE USER 'hpo_web'@'%' IDENTIFIED BY 'hpo_web';
GRANT REFERENCES , SELECT, INSERT, DELETE, UPDATE, CREATE, DROP, INDEX, ALTER, CREATE VIEW, SHOW VIEW,  TRIGGER, LOCK TABLES , CREATE ROUTINE, ALTER ROUTINE ON `hpo_web`.* TO 'hpo_web'@'%';
SHOW GRANTS FOR 'hpo_web'@'%';


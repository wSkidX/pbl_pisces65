CREATE DATABASE IF NOT EXISTS db_authService;
CREATE DATABASE IF NOT EXISTS db_notificationService;
CREATE DATABASE IF NOT EXISTS db_jadwalService;
CREATE DATABASE IF NOT EXISTS db_sensorService;

CREATE USER IF NOT EXISTS 'myuser'@'%' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON db_authService.* TO 'myuser'@'%';
GRANT ALL PRIVILEGES ON db_notificationService.* TO 'myuser'@'%';        
GRANT ALL PRIVILEGES ON db_jadwalService.* TO 'myuser'@'%';
GRANT ALL PRIVILEGES ON db_sensorService.* TO 'myuser'@'%';
FLUSH PRIVILEGES;


-- CREATE TABLE Users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     role ENUM('employer', 'job_seeker') NOT NULL
-- );

-- CREATE TABLE Profiles (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT,
--     resume TEXT,
--     skills TEXT,
--     experience TEXT,
--     FOREIGN KEY (user_id) REFERENCES Users(id)
-- );

-- CREATE TABLE JobListings (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     employer_id INT,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     requirements TEXT,
--     location VARCHAR(255),
--     FOREIGN KEY (employer_id) REFERENCES Users(id)
-- );

-- CREATE TABLE Applications (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     job_id INT,
--     job_seeker_id INT,
--     status ENUM('pending', 'accepted', 'rejected') NOT NULL,
--     applied_on DATE,
--     FOREIGN KEY (job_id) REFERENCES JobListings(id),
--     FOREIGN KEY (job_seeker_id) REFERENCES Users(id)
-- );

-- CREATE TABLE Teams (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     employer_id INT,
--     name VARCHAR(255) NOT NULL,
--     description TEXT,
--     FOREIGN KEY (employer_id) REFERENCES Users(id)
-- );

-- CREATE TABLE Projects (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     team_id INT,
--     name VARCHAR(255) NOT NULL,
--     description TEXT,
--     status ENUM('active', 'completed', 'on_hold') NOT NULL,
--     FOREIGN KEY (team_id) REFERENCES Teams(id)
-- );

-- CREATE TABLE Tasks (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     project_id INT,
--     assigned_to INT,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     status ENUM('pending', 'in_progress', 'completed') NOT NULL,
--     due_date DATE,
--     FOREIGN KEY (project_id) REFERENCES Projects(id),
--     FOREIGN KEY (assigned_to) REFERENCES Users(id)
-- );

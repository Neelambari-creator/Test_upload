# CIVIXA – AI-Assisted Civic Issue Reporting and Management Platform

**Report Civic Problems. Improve Your Community.**

## 📌 Project Overview

Civixa is a web-based AI-assisted civic issue reporting and management platform designed to help citizens report common public infrastructure problems through a simple and user-friendly interface.

The platform allows citizens to register, log in, and submit civic complaints related to potholes, road damage, garbage accumulation, streetlight failures, water leakage, drainage problems, electrical issues, and public property damage.

Civixa uses a simple rule-based classification mechanism to identify the issue category, assign a priority level, and suggest the responsible department based on predefined rules. It aims to make civic issue reporting more organized and convenient.

## 🎯 Objectives

- To provide a digital platform for reporting civic problems.
- To simplify the process of submitting public complaints.
- To allow citizens to upload photographs of reported issues.
- To classify civic issues using predefined rules.
- To assign priority levels such as Low, Medium, and High.
- To suggest the appropriate department for reported issues.
- To encourage citizen participation in community development.

## ✨ Key Features

- **User Registration:** Allows new citizens to create an account.
- **User Login:** Provides authenticated access using JWT authentication.
- **Citizen Dashboard:** Provides an interface for citizens to access reporting features.
- **Civic Issue Reporting:** Allows citizens to report different types of public problems.
- **Photo Upload:** Supports uploading photographs of civic issues.
- **Rule-Based Classification:** Identifies issue categories based on predefined rules.
- **Priority Assignment:** Assigns Low, Medium, or High priority to reported issues.
- **Department Suggestion:** Suggests the responsible department based on the reported issue.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Node.js
- Express.js

### Database
- MySQL
- mysql2

### Authentication
- JSON Web Token (JWT)

### Development Tools
- Visual Studio Code
- Node.js and npm
- MySQL

## 🏗️ System Architecture

Civixa follows a full-stack web application architecture.

1. **Frontend:** React.js provides the user interface for registration, login, dashboard access, and civic issue reporting.
2. **Backend:** Node.js and Express.js handle API requests and application logic.
3. **Database:** MySQL stores user information and application data.
4. **Authentication:** JWT supports secure authentication for protected operations.
5. **Classification:** A rule-based mechanism assists in categorizing reported civic issues and assigning priority levels.

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following software is installed:

- Node.js
- npm
- MySQL Server
- Visual Studio Code

### Step 1: Clone the Repository

```bash
git clone https://github.com/Neelambari-creator/Test_upload.git
```

### Step 2: Open the Project

```bash
cd Test_upload
```

### Step 3: Start the Backend

Open a terminal and execute:

```bash
cd backend
npm install
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Step 4: Start the Frontend

Open another terminal and execute:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

### Step 5: Open the Application

Open your browser and visit:

http://localhost:5173

**Note:** Start the MySQL server and configure the database connection details in the backend before running the application. The commands above assume the project contains `backend` and `frontend` folders.

## 📂 Project Modules

1. User Registration and Login Module
2. Citizen Dashboard Module
3. Civic Issue Reporting Module
4. Image Upload Module
5. Rule-Based Issue Classification Module
6. Priority Assignment and Department Suggestion Module
7. Database Management Module

## 🔮 Future Enhancements

- Real-time complaint status tracking.
- Administrator dashboard for complaint management.
- GPS-based location identification.
- Email and SMS notifications.
- Advanced AI-based issue classification.
- Mobile application development.
- Data analytics and reporting.

## 🎓 Project Information

**Project Name:** Civixa

**Project Title:** AI-Assisted Civic Issue Reporting and Management Platform

**Project Type:** MCA Academic Project

**Area:** Full-Stack Web Development

**Domain:** Web Application Development

## 👩‍💻 Developer

**Neelambari V**

GitHub: https://github.com/Neelambari-creator

## 📄 License

This project is developed for academic and educational purposes.

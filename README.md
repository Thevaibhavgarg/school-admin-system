# 📚 School Administration System

> A comprehensive web-based **School Administration System** built with **Spring Boot** and **React** for managing all administrative operations of an educational institution.

![Java](https://img.shields.io/badge/Java-17-blue?logo=java) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green?logo=spring) ![React](https://img.shields.io/badge/React-18-blue?logo=react) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12-blue?logo=postgresql)

---

## 🎯 Features Overview

### ✅ **Core Modules** (9 Modules - ALL COMPLETE)

| Module | Features | Role |
|--------|----------|------|
| **🔐 Registration/Login** | JWT auth, session management, role-based access | All Users |
| **🎓 Admission** | Multi-step form, all student details, admission number auto-generation | Clerk, Admin |
| **💳 Fee Payment** | Payment processing, receipt generation, payment history tracking | Clerk, Admin, Principal |
| **✅ Attendance** | Mark attendance, date filtering, status tracking (Present/Absent/Late/Leave) | Teacher, Admin |
| **📊 Performance** | Record marks, grade calculation, performance trends, rankings | Teacher, Admin, Principal |
| **📚 Syllabus** | Maintain curriculum, coverage tracking, subject mapping, teacher assignment | Teacher, Admin, Principal |
| **📅 Scheduling** | Create timetables, teacher assignment, room allocation, conflict detection | Principal, Admin |
| **📋 Reports** | Admission, attendance, performance, fee, syllabus reports with filtering | Principal, Admin, Clerk |
| **📈 Analysis** | Performance analysis, financial analysis, attendance trends, predictions | Principal, Admin |

### ✨ **Admin Features** (NEW!)

- ✅ **Class Management** - Create, edit, delete classes with section tracking
- ✅ **Section Management** - Manage sections within classes
- ✅ **Subject Management** - Create subjects with codes, assign to classes

### ✨ **Key Features**

- ✅ **Multi-role support** - Admin, Clerk, Teacher, Principal, Student
- ✅ **Responsive design** - Works on desktop, tablet, and mobile
- ✅ **Real-time notifications** - Toast messages for all actions
- ✅ **Secure authentication** - JWT token-based security
- ✅ **Data validation** - Client-side and server-side validation
- ✅ **Professional UI** - Material Design with MUI components & Emoji icons
- ✅ **Comprehensive CRUD** - Create, read, update, delete operations
- ✅ **Error handling** - Helpful error messages and recovery

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Java 17** (JDK)
- **Node.js 16+**
- **PostgreSQL 12+**
- **Maven 3.6+**

### Step 1: Backend Setup
```bash
cd school-admin-backend
mvn clean install
mvn spring-boot:run
```
**Server running on:** `http://localhost:8080`

### Step 2: Frontend Setup
```bash
cd school-admin-frontend
npm install
npm run dev
```
**App running on:** `http://localhost:5173`

### Step 3: Login
- **URL:** http://localhost:5173/login
- **Username:** `admin`
- **Password:** `password`

---

## 📁 Project Structure

```
FSAD Project/
├── school-admin-backend/          # Spring Boot Backend (Java 17)
│   ├── src/main/java/com/school/admin/
│   │   ├── config/                # Security, JWT, Initialization
│   │   ├── controller/            # 9 REST Controllers
│   │   ├── service/               # Business Logic
│   │   ├── repository/            # JPA Data Access
│   │   ├── model/                 # 12 JPA Entities
│   │   ├── dto/                   # Data Transfer Objects
│   │   └── exception/             # Custom Exceptions
│   ├── src/main/resources/
│   │   ├── application.properties # PostgreSQL Configuration
│   │   └── data.sql              # Initial Demo Data
│   └── pom.xml                   # Maven Dependencies
│
├── school-admin-frontend/         # React Vite Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/            # Classes, Sections, Subjects
│   │   │   ├── clerk/            # Admission, Fee Payment
│   │   │   ├── teacher/          # Attendance, Performance, Syllabus
│   │   │   ├── principal/        # Reports, Analysis, Schedule
│   │   │   ├── student/          # Student Portal
│   │   │   └── auth/             # Login Page
│   │   ├── api/                  # 9 Axios API Clients
│   │   ├── components/           # Reusable Components
│   │   ├── context/              # React Context (Auth)
│   │   └── utils/                # Helper Functions
│   ├── vite.config.js           # Vite Configuration
│   └── package.json             # NPM Dependencies
│
├── PROJECT_OVERVIEW.md           # Complete Documentation
├── DEMO_GUIDE.md                # Step-by-step Demo Instructions  
└── README.md                    # This File
```

---

## 👥 Demo Credentials

```
Username: admin
Password: password
```

**Available Roles:**
- ADMIN (Full access to all modules)
- PRINCIPAL (Reports, Analysis, Scheduling)
- TEACHER (Attendance, Performance, Syllabus)
- CLERK (Admission, Fee Payment)
- STUDENT (View own data)

---

## 🏗️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.5
- **Language:** Java 17 (SapMachine JDK)
- **Security:** Spring Security + JWT (JJWT 0.12.5)
- **ORM:** Hibernate 6.4.4.Final (JPA)
- **Database:** PostgreSQL 42.6.2
- **Build:** Maven 3.9.11
- **Port:** 8080

### Frontend
- **Framework:** React 18 + Vite
- **UI Library:** Material-UI v5
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Notifications:** React Toastify
- **Port:** 5173

### Database
- **RDBMS:** PostgreSQL 12+
- **Port:** 5432
- **Database:** school_admin_db
- **Auto Schema:** Hibernate ddl-auto=update

---

## 🧪 What's Implemented

### ✅ All 9 Modules Complete
- [x] Registration/Login with JWT
- [x] Admission (Multi-step form)
- [x] Fee Payment Processing
- [x] Attendance Marking
- [x] Performance Tracking
- [x] Syllabus Management
- [x] Class Scheduling
- [x] Reports Generation
- [x] Analysis Dashboard

### ✅ Admin Features
- [x] Class Management (CRUD)
- [x] Section Management (CRUD)
- [x] Subject Management (CRUD)

### ✅ UI/UX Enhancements
- [x] Responsive Design
- [x] Material Design Components
- [x] Loading States
- [x] Error Handling
- [x] Toast Notifications
- [x] Form Validation
- [x] Emoji Icons
- [x] Professional Styling

---

## 📊 Data Models

**12 Core Entities:**
1. User
2. Student
3. Teacher
4. SchoolClass
5. Section
6. Subject
7. Attendance
8. Performance
9. Syllabus
10. ClassSchedule
11. FeePayment
12. AcademicYear

---

## 🔐 Security Features

- ✅ JWT Token-based Authentication
- ✅ Role-based Access Control (RBAC)
- ✅ Password Security with Spring Security
- ✅ CORS Configuration
- ✅ Protected API Endpoints (@PreAuthorize)
- ✅ Session Management with Token Expiry
- ✅ Secure Data Transmission Ready

---

## 📝 Documentation

| Document | Purpose |
|----------|---------|
| **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** | Complete feature documentation with requirements mapping |
| **[DEMO_GUIDE.md](./DEMO_GUIDE.md)** | Step-by-step demo instructions and talking points |
| **[README.md](./README.md)** | Quick start guide (this file) |

---

## 🎬 Demo Flow

1. **Login** with `admin` / `password`
2. **Create Classes** (Class 1, 5, 10)
3. **Add Sections** (A, B, C)
4. **Add Subjects** (English, Math, Science)
5. **Admit Students** via Admission form
6. **Mark Attendance** as Teacher
7. **Record Performance** Marks
8. **Process Fee Payments**
9. **Generate Reports**
10. **View Analysis**

[Full demo guide with screenshots: DEMO_GUIDE.md](./DEMO_GUIDE.md)

---

## 🔌 Key API Endpoints

```
POST   /api/auth/login
GET    /api/students
POST   /api/students
GET    /api/students/classes
POST   /api/students/classes
GET    /api/students/sections/class/{classId}
POST   /api/students/sections
GET    /api/students/subjects/class/{classId}
POST   /api/students/subjects
POST   /api/attendance
GET    /api/attendance/...
POST   /api/performance
GET    /api/reports/...
GET    /api/analysis/...
```

[Complete API reference: PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md#-api-architecture)

---

## ✅ Requirements Fulfillment

| # | Requirement | Status | Implementation |
|---|------------|--------|-----------------|
| 1 | Employee login with roles | ✅ | JWT Authentication + RBAC |
| 2 | Admission with student details | ✅ | Multi-step form, all fields |
| 3 | Fee payment processing | ✅ | FeePayment module + UI |
| 4 | Attendance management | ✅ | Attendance marking + reports |
| 5 | Performance tracking | ✅ | Performance recording + analysis |
| 6 | Syllabus maintenance | ✅ | Syllabus CRUD + teacher assignment |
| 7 | Class scheduling | ✅ | ClassSchedule + timetable |
| 8 | Reports generation | ✅ | ReportController + 6+ report types |
| 9 | Analysis dashboard | ✅ | AnalysisController + charts |
| 10 | Class management | ✅ | NEW - Admin class/section/subject CRUD |

**Status: 100% COMPLETE ✅**

---

## 🌐 Responsive Design

| Breakpoint | Device | Layout |
|-----------|--------|--------|
| < 600px | Mobile | Single column, hamburger menu |
| 600-960px | Tablet | 2 columns, collapsible sidebar |
| > 960px | Desktop | Full layout, permanent sidebar |

---

## 🐛 Troubleshooting

### Backend Issues
```bash
# Port 8080 already in use?
lsof -i :8080
kill -9 <PID>

# PostgreSQL not running?
# Start PostgreSQL and ensure database exists
createdb school_admin_db

# Clean rebuild
mvn clean install
mvn spring-boot:run
```

### Frontend Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 💡 For Academic Presentation

**Key Talking Points:**
- ✅ "Complete implementation of all 9 functional requirements"
- ✅ "Full-stack application with Spring Boot and React"
- ✅ "Secure JWT authentication with role-based access control"
- ✅ "Professional UI with Material Design"
- ✅ "Responsive across all devices"
- ✅ "Real-world educational institution needs"
- ✅ "Clean architecture with separation of concerns"
- ✅ "Comprehensive error handling and validation"

[See DEMO_GUIDE.md for presentation structure](./DEMO_GUIDE.md)

---

## 🎓 Learning Outcomes

Through building and understanding this project, you'll learn:
- ✅ Full-stack application development
- ✅ Spring Boot REST API design
- ✅ React component architecture
- ✅ Database design and SQL
- ✅ JWT authentication and security
- ✅ Role-based access control
- ✅ Responsive UI/UX design
- ✅ Testing and debugging

---

## 🚀 Future Enhancements

1. Document management system
2. Email and SMS notifications
3. Mobile app (React Native)
4. Advanced analytics with ML
5. Online exams module
6. Parent portal
7. Assignment submission system
8. Library management
9. Hostel management
10. Student fee structure configuration

---

## 📞 Support & Help

For detailed information:
1. **Setup Issues:** Check DEMO_GUIDE.md → Troubleshooting
2. **Feature Details:** Read PROJECT_OVERVIEW.md
3. **Demo Instructions:** Follow DEMO_GUIDE.md
4. **Browser Console:** Press F12 for debug logs
5. **Server Logs:** Check terminal output

---

## 📄 License

This is an academic project for educational purposes.

---

## 👨‍💻 Authors

**FSAD Project Team**  
School Administration System  
May 2026

---

<div align="center">

### Perfect for Academic Presentation! 🎉

[📋 View Full Project Documentation](./PROJECT_OVERVIEW.md) | [🎬 View Demo Guide](./DEMO_GUIDE.md)

**Made with ❤️ for education**

</div>
# Runs on http://localhost:8080
```

### 3. Frontend
```bash
cd school-admin-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## API Base URL
All endpoints are prefixed with `/api`

### Auth
- `POST /api/auth/login` — public
- `POST /api/auth/register` — ADMIN only

### Students
- `GET/POST /api/students`
- `GET /api/students/classes` — all classes
- `GET /api/students/sections/class/{id}` — sections for a class

### Fee
- `POST /api/fees` — process payment
- `GET /api/fees/summary?academicYear=2024-2025`

### Attendance
- `POST /api/attendance` — bulk mark
- `GET /api/attendance/class/{cId}/section/{sId}/date/{date}`

### Performance
- `POST /api/performance`
- `GET /api/performance/student/{id}/year/{year}`

### Syllabus
- `POST /api/syllabus`
- `GET /api/syllabus/class/{id}/year/{year}`

### Schedules
- `POST /api/schedules`
- `GET /api/schedules/class/{cId}/section/{sId}`

### Reports
- `GET /api/reports/admissions`
- `GET /api/reports/syllabus/class/{id}?academicYear=`
- `GET /api/reports/attendance/class/{id}`
- `GET /api/reports/performance/class/{id}?academicYear=`
- `GET /api/reports/classes`

### Analysis
- `GET /api/analysis/academic?academicYear=`
- `GET /api/analysis/financial?academicYear=`
- `GET /api/analysis/dashboard?academicYear=`

# 💰Expense Tracker 

A secure and scalable RESTful backend API for managing personal expenses, built with Node.js, Express, Sequelize, and MySQL. Includes user authentication, Razorpay payment integration for premium features, AWS S3 report storage, and SendGrid for password recovery.

--- 

# ✅ Features

- User Registration and Login (JWT-based)

- Track income and expenses

- View all transactions with filters

- Download reports (AWS S3)

- Razorpay integration for premium membership

- Forgot password via SendGrid email service

- Authenticated and role-based route protection

---

## 📁 Project Structure

├── app.js
├── controllers/
├── models/
├── routes/
├── middleware/
├── util/
├── config/
├── .env
└── README.md

---


## ⚙️ Tech Stack

- **Node.js**

- **Express.js**

- **MySQL**

- **Sequelize (ORM)**

- **JWT – Authentication**

- **bcrypt – Password hashing**

- **Razorpay – Premium upgrade**

- **SendGrid – Email service**

- **AWS S3 – Report storage**

- **dotenv – Environment config**

---

## 🔐 Authentication

All endpoints (except user register/login and forgot password) are protected by JWT.Include token in `Authorization` header as:
`Authorization: Bearer <token>`

---

## 🚀 API Endpoints

### 👤 User

- `POST /api/expenses/` – Add expense  
- `GET /api/expenses/` – Get all expenses  
- `PUT /api/expenses/:id` – Update expense  
- `DELETE /api/expenses/:id` – Delete expense  


### 💸 Expense

- `POST /api/expenses/` – Add expense  
- `GET /api/expenses/` – Get all expenses  
- `PUT /api/expenses/:id` – Update expense  
- `DELETE /api/expenses/:id` – Delete expense  

### 📊 Report

- `GET /api/reports/download` – Download expense report (Premium only)  
- `GET /api/reports/history` – View all downloaded reports  

### 💎 Premium

- `GET /api/premium/status` – Check premium status  
- `POST /api/premium/upgrade` – Initiate payment via Razorpay  

---



## 🧪 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
2. **Install dependencies**
   ```bash
   npm install

3. **Configure .env**
   ```bash
   DB_NAME=
   DB_USER=
   DB_PASSWORD=
   JWT_SECRET=
   SENDGRID_API_KEY=
   S3_BUCKET=
   AWS_ACCESS_KEY=
   AWS_SECRET_KEY=

4. **Run the app**
   ```bash
   npm start

---


## 🧪 Testing the API

Use **Postman** or **Thunder Client**.  
Set `Authorization: Bearer <token>` after login to access secured routes.

---

## 👨‍💻 Author
**Sumit Patil**  
GitHub: @Sumitp92




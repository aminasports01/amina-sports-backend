# 🧠 AI-Powered Multi-Role E-commerce Backend

A scalable and production-ready backend for a modern e-commerce platform. Built
with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**, this API supports
multi-role authentication and includes AI-powered capabilities.

---

## 🚀 Features

- 🔐 Authentication (JWT आधारित)
- 👥 Multi-role system (User, Admin, Vendor)
- 📦 Product management (CRUD)
- 🛒 Order management
- ⭐ Review & rating system
- 🤖 AI assistant integration (for recommendations / chat)
- 📊 Scalable REST API
- 🧾 Input validation & error handling

---

## 🏗️ Tech Stack

- **Node.js**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **bcrypt** (password hashing)

---

---

## ⚙️ Installation

### 1️⃣ Clone the repository

````

### 2️⃣ Install dependencies

```bash
pnpm install
````

### 3️⃣ Setup environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/dbname
JWT_SECRET=your_secret_key
PORT=5000
```

### 4️⃣ Prisma setup

```bash
npx prisma migrate dev
npx prisma generate
```

### 5️⃣ Run the server

```bash
pnpm dev
```

---

## 🔐 Authentication

- Register & Login with email/password
- Password hashing using bcrypt
- JWT-based authorization
- Role-based route protection

---

## 👥 Roles

| Role   | Permissions           |
| ------ | --------------------- |
| User   | Browse, order, review |
| Vendor | Manage own products   |
| Admin  | Full system control   |

---

## 📡 API Endpoints (Sample)

### Auth

- `POST /api/register`
- `POST /api/users/login`

### Products

- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

### Orders

- `POST /api/orders`
- `GET /api/orders`

---

## 🤖 AI Assistant (Concept)

- Product recommendation based on user behavior
- Chat-based assistant for product queries
- Smart search suggestions

---

## 📊 Future Improvements

- Payment integration (Stripe)
- Advanced analytics dashboard
- Caching (Redis)
- Microservices architecture

---

## 🧪 Demo Credentials

```txt
User:
email: user@example.com
password: 123456

Admin:
email: admin@example.com
password: 123456
```

---

## 🌐 Live API

> Coming soon...

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Author

**Md Meherab Hossain Munna**

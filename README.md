# Salebration

**Salebration** is a full-featured **Point of Sale (POS)** and **Inventory Management** web application.
It is designed to handle retail sales, inventory tracking, supplier management, and financial reporting — all in one app.

---

## 🚀 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend:** [Laravel](https://laravel.com/) with Repository-Service pattern
- **Authentication:** [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)
- **Payments:** Manual payment & QRIS integration via [Xendit](https://www.xendit.co/)
- **Email Notifications:** Laravel Mail for notifications & supplier order requests

---

## 📌 Features

### Core Features

- Point of Sale system with manual & QRIS (Xendit) payments
- Inventory management with stock tracking
- Email notifications for important actions
- Reorder process:
  - Send reorder requests via email to suppliers
  - Supplier can accept or discard orders through a link

### Sidebar Menu

- Dashboard
- Activity Log
- Customers
- Point of Sale
- Transactions
- Invoices
- Products
- Stock Management
- Purchase Orders
- Suppliers
- Product Categories
- Expenses
- Expense Categories
- Sales Report
- Inventory Report
- Financial Report
- User Management
- Role Management
- App Settings

---

## 📂 Project Structure

- **Frontend:** `Next.js`:
  - Tailwind CSS
  - Shadcn UI
  - Tanstack-Query
  - Tanstack-Table
- **Backend:** `Laravel`:
  - Repository-Service pattern for clean architecture
  - Spatie for roles & permissions
  - REST API endpoints for frontend consumption

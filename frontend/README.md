# 🖥️ Frontend App (Next.js)

This is the frontend application built with [Next.js](https://nextjs.org/), designed to provide a fast, responsive, and modern interface for our users. It interacts with the backend via APIs to display data, handle user actions, and provide a smooth experience.

---

## 📦 Features

- ⚡ Built with Next.js & React
- 🎨 Styled using TailwindCSS ans ShadCN UI
- 🔐 Authentication & Authorization
- 📊 Dashboard & Reporting Interfaces
- 🔌 API Integration with Backend (REST)
- 📱 Responsive Design

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-frontend-repo.git
cd your-frontend-repo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file and fill in your local values.

```bash
cp .env.example .env
```

Then, update the .env file with the required environment variables (API URLs, keys, etc).

### 4. Build the Project

```bash
npm run build
```

### 4. Start the Production Server

```bash
npm run build
```

#### For development mode, you can use:

```bash
npm run dev
```

---

## 🛠 Environment Variables

Here are some common variables you may need in your .env:

```bash
BACKEND_URL=
NEXT_PUBLIC_BACKEND_URL=

ACCESS_TOKEN_NAME=
NEXT_PUBLIC_ACCESS_TOKEN_NAME=

REFRESH_TOKEN_NAME=
NEXT_PUBLIC_REFRESH_TOKEN_NAME=

ACCESS_TOKEN_EXPIRATION=
NEXT_PUBLIC_ACCESS_TOKEN_EXPIRATION=

REFRESH_TOKEN_EXPIRATION=
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRATION=

APP_NAME=
APP_DOMAIN="http://localhost:3000

```

Refer to `.env.example` for a full list.

---

# 🌍 Wonderlust

Wonderlust is a full-stack travel listings web application built using **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, and **Passport.js**. Users can register, log in, and create, edit, or delete travel listings with reviews.

---

## 📸 Screenshots

### Project Dashboard

This project includes several views that represent different sections of the application.

| ![Dashboard](screenshots/screenshot1.png) | ![Data View](screenshots/screenshot2.png) | ![Reports](screenshots/screenshot3.png) | ![Settings](screenshots/screenshot4.png) |

---

## 🚀 Features

- 📝 Create, read, update, and delete travel listings.
- 💬 Leave reviews on listings.
- 🔐 User authentication and authorization.
- 🔒 Route protection for logged-in users and owners only.
- ⚡ Flash messages for feedback.
- 🧾 Form validation with Joi.
- 🗂️ Clean MVC structure.

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, ejs-mate (templating)
- **Database**: MongoDB, Mongoose
- **Authentication**: Passport.js, express-session
- **Validation**: Joi
- **Utilities**: method-override, connect-flash

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Swayam29082004/Airbnb
   cd Airbnb
   nodmon app.js
   
```bash
project-root/
│
├── backend/                  # Express backend
│   ├── controllers/          # Route logic & controller files
│   ├── models/               # Mongoose schemas and data models
│   ├── routes/               # API route definitions
│   ├── middleware/           # Auth and error-handling middleware
│   └── server.js             # Main server file
│
├── frontend/                 # React frontend
│   ├── public/               # Static assets (index.html, icons, etc.)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Main page components / views
│   │   ├── App.js            # Main App component
│   │   └── index.js          # React DOM entry point
│
├── .gitignore                # Git ignored files and folders
├── README.md                 # Project documentation
└── package.json              # Project metadata and scripts (or two if split frontend/backend)


## 📝 License
|  This project is licensed under the MIT License - see the LICENSE file for details.|
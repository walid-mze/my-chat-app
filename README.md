# 💬 My Chat App

A real-time chat web application built with **Vue.js** and **Firebase**. This project demonstrates modern frontend development, real-time data synchronization, and cloud-based authentication.
---

## 🚀 Project Overview

**My Chat App** enables users to communicate instantly through a responsive and user-friendly interface. Messages are synchronized in real time using Firebase, showcasing how modern web applications handle live data and user authentication at scale.

---

## ✨ Features

*  Real-time messaging
*  User authentication with Firebase Auth
*  Single-Page Application (SPA) using Vue.js
*  Responsive and clean UI
*  Modular, component-based architecture
*  Cloud backend with Firebase
*  Ready for deployment

---

## 🛠 Tech Stack

* **Frontend:** Vue.js, HTML, CSS, JavaScript
* **Backend / Services:** Firebase (Authentication, Realtime Database / Firestore)
* **Package Manager:** npm
* **Build Tool:** Vue CLI
* **Deployment:** Firebase Hosting

---

## 📁 Project Structure

```
my-chat-app/
├── public/                  # Static public files
├── src/
│   ├── assets/              # Images and styles
│   ├── components/          # Reusable Vue components
│   ├── views/               # Application pages (Chat, Login, etc.)
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── .firebase/               # Firebase local configuration
├── firebase.json            # Firebase hosting configuration
├── vue.config.js            # Vue CLI configuration
├── package.json             # Project dependencies and scripts
└── README.md                # Documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/walid-mze/my-chat-app.git
cd my-chat-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure Firebase

* Create a project in the **Firebase Console**
* Enable:

  * Authentication
  * Realtime Database or Firestore
* Add your Firebase configuration keys to the project

### 4️⃣ Run the application

```bash
npm run serve
```

The app will be available at:

```
http://localhost:8080
```

---

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist/` folder.

---

## ☁️ Deployment (Firebase Hosting)

```bash
firebase init hosting
firebase deploy
```

---

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

* Vue.js and component-based UI design
* Real-time databases
* Authentication workflows
* Frontend–backend integration
* Scalable web application structure
* Deployment pipelines


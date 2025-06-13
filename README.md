# Signalx

This Project Is A Web Application That Uses Webpack For Bundling, Babel For Transpiling JavaScript, And Also Supports Building And Serving The Application.

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [User Guide for Application/Website](#user-guide-for-applicationwebsite)
  - [1. Accessing the Home Page](#1-accessing-the-home-page)
  - [2. Navigating to the Login Page](#2-navigating-to-the-login-page)
  - [3. Logging In](#3-logging-in)
  - [4. Creating a New Account](#4-creating-a-new-account)
  - [5. Logging In After Registration](#5-logging-in-after-registration)
  - [Password Reset Tips](#password-reset-tips)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 12 Or Higher Is Recommended)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Download The Source Code.
2. Unzip The Project.
3. Install All The Dependencies Using The Following Command.
   ```shell
   npm install
   ```
4. Look Inside Readme.txt Of Stock-API To Start The Python Backend Server

## Scripts

- Migrate Database:
  ```shell
  npm run migrate
  ```
  This Script Is Used To Initialize The Database / Remove It

- Start Backend Server:
  ```shell
  npm run start
  ```
  This Script Is Used To Start The Backend Server On Port 5000 Using SSL

- Start Development Server:
  ```shell
  npm run start-dev
  ```
  This Script Is Used To Run Server In Webpack Development Mode With Live Reload And Development Mode Feature Based On `webpack.dev.js` Configuration File.

  - Build for Production:
  ```shell
  npm run build
  ```
  This Script Is Used To Run Webpack In Production Mode With `webpack.prod.js` Configuration File And Produces Several Build File Inside The Directory `dist`.

- Serve(http):
  ```shell
  npm run serve
  ```
  This Script Is Used To Serve The Content Of `dist` Directory With [`http-server`](https://www.npmjs.com/package/http-server) On Localhost Without SSL.

- Serve(https):
  ```shell
  npm run serve:https
  ```
  This Script Is Used To Serve The Content Of `dist` Directory With [`http-server`](https://www.npmjs.com/package/http-server) On 0.0.0.0 With SSL.

- Redirect Http Traffic To Https:
  ```shell
  npm run redirect
  ```
  This Script Is Used To Redirect All Http Traffic To Https For Secure Connection

## Project Structure

This Project Was Designed So That Its Code Can Remain Modular And Organized.

```text
Capstone/
├── dist/                   # Compiled files for production
├── docs/                   # Compiled files for github pages
├── src/                    # Source project files
│   ├── public/             # Public files
│   ├── scripts/            # Source JavaScript files
│   │   ├── data/           # Stock related and legacy files
│   │   ├── pages/          # Pages related
│   │   ├── routes/         # Routes related
│   │   ├── config.js       # API enpoint
│   │   ├── index.js        # Main JavaScript entry file
│   │   ├── pwa.js          # Progressive web app file
│   │   └── sw.js           # Service worker file
│   ├── styles/             # Source CSS files
│   │   └── styles.css      # Main CSS file
│   ├── index.html          # Main HTML file
│   ├── redirect.js         # Traffic redirect file
│   └── server.js           # Backend file
├── Stock-API/              # Python backend related 
├── .env                    # Project config file
├── migration.config.js     # PGSQL config file
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Project metadata and dependencies
├── README.md               # Project documentation
├── webpack.common.js       # Webpack common configuration
├── webpack.dev.js          # Webpack development configuration
└── webpack.prod.js         # Webpack production configuration
```

## User Guide for Application/Website

This document provides step-by-step instructions for using the Capstone application/website, including accessing the site, logging in, and creating a new account if you don't have one.

### 1. Accessing the Home Page

- Open the Capstone application or website in your browser.
- You will be directed to the home page.

### 2. Navigating to the Login Page

- On the home page, find and click the **Navigation** button.
- Select the **Auth** or **Login** menu from the navigation.
- You will be redirected to the login page.

### 3. Logging In

- Enter your **username** and **password** in the login form.
- Click the **Log In** button to access the application.

> **Note:**  
> After logging in, if you see a new menu item such as **Predict** in the navigation, this means you have successfully logged in and gained access to additional features.

### 4. Creating a New Account

If you don't have an account yet, follow these steps:

1. On the login page, look for the text  
   **"Don't have an account? Create an account"**.
2. Click the **Create an account** link.
3. You will be taken to the registration page.
4. Fill out the registration form with:
    - **Username**
    - **Email**
    - **Password**
    - **Confirm Password** (enter the same password again)
5. Check or click **Accept terms and conditions** to agree to the terms.
6. After filling out all information and accepting the terms, click the **Create Account** or **Register** button.
7. Your account will be created, and you can return to the login page.

### 5. Logging In After Registration

- Enter your **username** and **password** that you registered.
- Click **Log In** to access the application.
- Now you can use all available features, such as the **Predict** menu after logging in.

### Password Reset Tips

If you forget your password, there is usually a **Forgot Password** option on the login page to help you reset your password.

---

This document may be updated at any time as the application/website evolves.

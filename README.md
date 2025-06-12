# Signalx

This Project Is A Web Application That Uses Webpack For Bundling, Babel For Transpiling JavaScript, And Also Supports Building And Serving The Application.

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

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

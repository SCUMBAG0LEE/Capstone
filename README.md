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

## Scripts

- Build for Production:
  ```shell
  npm run build
  ```
  This Script Is Used To Run Webpack In Production Mode With `webpack.prod.js` Configuration File And Produces Several Build File Inside The Directory `dist`.

- Start Development Server:
  ```shell
  npm run start-dev
  ```
  This Script Is Used To Run Server In Webpack Development Mode With Live Reload And Development Mode Feature Based On `webpack.dev.js` Configuration File.

- Serve:
  ```shell
  npm run serve
  ```
  This Script Is Used To Serve The Content Of `dist` Directory With [`http-server`](https://www.npmjs.com/package/http-server). 

## Project Structure

This Project Was Designed So That Its Code Can Remain Modular And Organized.

```text
Capstone/
├── dist/                   # Compiled files for production
├── src/                    # Source project files
│   ├── public/             # Public files
│   ├── scripts/            # Source JavaScript files
│   │   └── index.js        # Main JavaScript entry file
│   ├── styles/             # Source CSS files
│   │   └── styles.css      # Main CSS file
│   └── index.html/         # Main HTML file
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Project metadata and dependencies
├── README.md               # Project documentation
├── webpack.common.js       # Webpack common configuration
├── webpack.dev.js          # Webpack development configuration
└── webpack.prod.js         # Webpack production configuration
```

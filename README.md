# EX3
Realtime 3D engine written in TypeScript

## This repo is not ready for use


[![CircleCI](https://circleci.com/gh/pluginio/ex3.svg?style=svg)](https://circleci.com/gh/pluginio/ex3)

## About

EX3 is a lightweight, fast & feature rich 3D graphics framework for **WebGL**. A clean and simple API is ideal for progressive mobile features and high performance. This means that your games and applications will be both **fast** and  **mobile** compatible.


# Pre-requisites

**EX3** is built on modern **HTML5** web technologies. The following software is required to get started.


## Node.js

**Node.js** is a runtime environment that will allow you to run JavaScript outside of your browser. **Node.js** comes with **npm** as its built-in package manager. **EX3** uses **npm** to download all of its code dependencies.

- [Download Node.js](https://nodejs.org/en/download/)

## Visual Studio Code

Whilst a variety of **IDEs** can be used to write **EX3** games and apps, we will use Visual Studio Code as it is **FREE** and very simple to get started with. **Visual Studio Code** is a development environment that is used to write your game or application code.

- [Download Visual Studio Code](https://code.visualstudio.com/)

## Git

**Git** is a decentralized version control system. **EX3** uses GitHub to store the **EX3**  codebase. You will require a **Git client** to download the **EX3** project source code.

- [Download Git](https://git-scm.com/)

**Windows users** should also consider downloading **Git bash**. Git bash is a **terminal** simulator that allows users of UNIX or Linux style environments to run command-line operations.

- [Download Git bash](https://gitforwindows.org/)

## Getting started

Once you have installed all of the software listed above, we must clone the **EX3** code onto your computer. Using your **terminal** or **Git bash**, navigate to the folder where you would like to store your project and enter the following:

`git clone https://github.com/pluginio/ex3.git`

This should now start the download process of the **EX3** codebase. If you require more information about **terminal** or **Git bash**, you can find complete documentation on the websites above.

## Start Your IDE

It's time to open **Visual Studio Code**. Once open, you can select:  `open folder...` in the **start menu**. Navigate to the folder where you cloned **EX3** and select `open`. The **EX3** project is now ready for you to pull the code **dependencies**. You will be able to navigate to the source code by locating the `src` folder.

## Dependencies

We already downloaded and installed **Node.js** which includes the node package manager **npm**. We can open a **terminal window** in Visual Studio Code, `Terminal -> New Terminal` from the **Menu bar**. In this terminal window we can now run our first **npm** command:

`npm install`

This should start downloading all of the dependencies that are required by the **EX3** library.

## Build Steps

The code is now ready to **build**. We already provided a few **build** instructions that use the **webpack** build tool. You can find out more information about **webpack** at: [https://webpack.js.org/](https://webpack.js.org/)

### Development Build

To run a development build, we simply run the following instruction in the **terminal**:

`npm run dev`

You can now navigate to `http://127.0.0.1:3000` in your browser. All being well you should see a sample of the **EX3** engine running in your browser. You can make changes to the source code and your changes will be reflected automatically upon saving.

### Release Build

To create a release build, you may run the following build instruction in your **terminal**

`npm run release`

This build instruction will package and **minify** the code so that the final file size is optimal. The resultant **JavaScript** code will be emitted into the `release` folder.

### Desktop Build

We have provided the ability to run **EX3** projects as desktop applications for **Windows**, **MacOS** and **Linux** using the **Electron** library. To make a desktop build run:

`npm run desktop`

### Unit tests

Also included is a suite of unit tests. Unit tests allow for the automation of testing and can catch issues before deployment. You can run the suite of unit tests with:

`npm run test`

## Many Thanks
**Thank you** for checking out **EX3 TypeScript**. We are super excited to see the amazing WebGL games and apps that you build and we hope to showcase them here. Please let us know about your projects. :)
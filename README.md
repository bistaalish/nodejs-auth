# Express Mongoose Custom Error API Boilerplate

A boilerplate for quickly setting up a Node.js application using Express, Mongoose, and a custom error handling API.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Express.js for building RESTful APIs.
- Mongoose for MongoDB database interaction.
- Custom Error Handling middleware for consistent error responses.
- Basic project structure to kickstart your Node.js project.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- MongoDB server up and running (locally or on a remote server).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/express-mongoose-custom-error-api-boilerplate.git
```

2. Change into the project directory:

```bash
cd npm-express-boilerplate
```

3. Install the dependencies:

```bash
npm install
```
  
## Usage

1. Copy .env.example to .env.
2. Add connection string to .env in MONGO_URI.
3. Start the server:

```bash
npm start
```
4. Your Express application will be running at `http://localhost:3000` by default.
5. Begin building your API `routes` and `models` in the routes and models directories.

## Contributing
Contributions are welcome! If you have any improvements or feature suggestions, please open an issue or submit a pull request.

## Liscense
This project is licensed under the MIT License - see the [LICENSE]() file for details.

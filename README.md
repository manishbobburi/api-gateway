# API Gateway

This repository implements an **API Gateway** for a microservices-based airline booking system. It handles routing, authentication, and communication between services like Flight Service and Booking Service.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Docker Setup](#docker-setup)
- [Developer Guide](#developer-guide)

## Overview

The API Gateway acts as a single entry point for the backend microservices. It provides authentication handling, proxy routing, and request rate limiting. All incoming requests are validated and then routed to the respective service.

## Features

- User authentication using JWT
- Role-based access control (Admin, Customer, Flight Company)
- Secure password encryption with bcrypt
- Proxy routing for Flight and Booking services
- Centralized error and success response formats
- Configurable CORS and rate limiting
- Sequelize ORM with MySQL support

## Project Structure

```bash
src/
├── config/
├── controllers/
├── middlewares/
├── migrations/
├── models/
├── repositories/
├── routes/
├── seeders/
├── services/
└── utils/
```

## Tech Stack

| Component            | Technology           | Description                                      |
|----------------------|----------------------|--------------------------------------------------|
| Backend    | Node.js, Express.js  | Core framework for handling API requests         |
| ORM                  | Sequelize            | Object-Relational Mapper for MySQL               |
| Authentication        | JWT, bcrypt          | Secure user authentication and authorization     |
| Proxy Middleware     | http-proxy-middleware| API routing to other microservices               |
| Database             | MySQL                | Relational database                              |
| Containerization     | Docker               | For container-based deployment                   |

## Environment Variables

Create a `.env` file in the project root with the following keys:
```javascript
# Server Configuration
PORT=3001

# Security
SALT_ROUNDS=10
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1h

# Service Endpoints
FLIGHT_SERVICE=http://localhost:3000
BOOKING_SERVICE=http://localhost:4000
```

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/manishbobburi/api-gateway.git
cd api-gateway
```

2. **Install dependencies:**

```bash
npm install
```

3. **Setup the database using Sequelize CLI:**

```bash
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```

## Running the Project

To start the API Gateway in development mode"

```bash
npm run dev
```
## Docker Setup

1. **Build the Docker Image**
```bash
docker build -t api-gateway .
```
2. **Run the Container**
```bash
# Example:
docker run -p 3000:3000 --name api-gateway-app api-gateway
```


## API Endpoints
The API is versioned under ``/api/v1``.

### Authentication Routes

| **Entity** | **Method** | **Endpoint**        | **Description**          | **Middleware / Controller**                           |
|-------------|-------------|--------------------|--------------------------|--------------------------------------------------------|
| User        | POST        | `/user/signup`     | Register a new user      | `validateAuthRequest`                                  |
| User        | POST        | `/user/signin`     | User login               | `validateAuthRequest`                                  |
| User        | POST        | `/user/role`       | Assign role to a user    | `checkAuth`, `isAdmin`                                 |

### Proxy Routes

| **Entity** | **Route Prefix**   | **Target Service**                | **Description**                 |
|-------------|--------------------|----------------------------------|---------------------------------|
| Proxy       | `/flightService`   | `FLIGHT_SERVICE` (from `.env`)   | Routes requests to Flight API   |
| Proxy       | `/bookingService`  | `BOOKING_SERVICE` (from `.env`)  | Routes requests to Booking API  |


## Developer Guide
### Migrations
**Run all migrations:**

```bash
npx sequelize db:migrate
```
**Undo last migrations:**

```bash
npx sequelize db:migrate:undo
```
Seed Data
**Run all seeders:**
```bash
npx sequelize db:seed:all
```

## Author

**Manish Bobburi**
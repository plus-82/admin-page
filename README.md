# Admin Dashboard

A simple modern admin dashboard with authentication.

## Features

- Modern login page with validation
- REST API authentication
- Dashboard with mock content
- Token-based authentication
- Responsive design

## Environment Setup

This project uses environment variables to configure API endpoints:

- Development: Create or edit `.env` file with appropriate values
- Production: Create or edit `.env.production` file with production values

Example:
```
REACT_APP_API_URL=http://localhost:8080
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

## API Endpoints

The application is configured to work with the following APIs:

- **Authentication**: `POST /api/v1/auth/sign-in`
  - Request: `{ email: string, password: string }`
  - Response: 
  ```json
  {
    "data": {
      "accessToken": "token value",
      "accessTokenExpireTime": 86400000
    },
    "code": "CM-001",
    "message": "success"
  }
  ```

## Configuration

The API base URL can be changed in `.env` files for different environments:

- Development: `.env`
- Production: `.env.production`
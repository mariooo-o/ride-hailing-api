# Raid Hailing API

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.

## API Endpoints

### Users

* `GET /api/users`
* `GET /api/users/:id`
* `POST /api/users`
* `PUT /api/users/:id`
* `DELETE /api/users/:id`

### Drivers

* `GET /api/drivers`
* `GET /api/drivers/:id`
* `POST /api/drivers`
* `PUT /api/drivers/:id`
* `DELETE /api/drivers/:id`

### Orders

* `GET /api/orders`
* `GET /api/orders/:id`
* `POST /api/orders`
* `PUT /api/orders/:id`
* `DELETE /api/orders/:id`

### Ratings

* `GET /api/ratings`
* `GET /api/ratings/:id`
* `POST /api/ratings`
* `PUT /api/ratings/:id`
* `DELETE /api/ratings/:id`

## Example Request

### Create User

{
  "fullName": "Alex Samosir",
  "email": "alex@email.com",
  "phoneNumber": "08123456789"
}

### Create Driver

{
  "fullName": "Budi Driver",
  "email": "budi@email.com",
  "phoneNumber": "08129876543",
  "licenseNumber": "SIMC-001",
  "vehicleType": "Motor",
  "vehicleNumber": "BK 1234 XYZ",
  "status": "available"
}

### Create Order

{
  "user": "USER_ID",
  "driver": "DRIVER_ID",
  "pickupAddress": "Jl. Merdeka No. 1",
  "destinationAddress": "Jl. Sudirman No. 10",
  "price": 18000,
  "status": "accepted"
}

### Create Rating

{
  "order": "ORDER_ID",
  "user": "USER_ID",
  "driver": "DRIVER_ID",
  "score": 5,
  "comment": "Driver ramah dan cepat"
}

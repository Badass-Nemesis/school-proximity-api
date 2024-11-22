# School Proximity API

## Description

The School Proximity API is designed to manage school data by allowing users to add new schools and retrieve a list of schools sorted by proximity to a user-specified location. This project is built with Node.js, Express.js, and MySQL.

## Installation

1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/Badass-Nemesis/school-proximity-api.git
    cd school-proximity-api
    ```
2. Install the necessary dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file in the root directory and add the following environment variables:
    ```plaintext
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASS=your_database_password
    DB_NAME=school_db
    DB_PORT=your_database_port
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```
    OR
    ```sh
    npm run dev
    ```
2. The server will be running at `http://localhost:3000`.

### Example Requests

- **Add School**
  ```sh
  POST /api/schools/addSchool
  Content-Type: application/json
  {
    "name": "Example School",
    "address": "123 Example St",
    "latitude": 12.34,
    "longitude": 56.78
  }
  ```

- **List Schools**
  ```sh
  GET /api/schools/listSchools?latitude=12.34&longitude=56.78
  ```

## API Endpoints

### Add School

- **Endpoint**: `/api/schools/addSchool`
- **Method**: POST
- **Payload**:
  ```json
  {
    "name": "Example School",
    "address": "123 Example St",
    "latitude": 12.34,
    "longitude": 56.78
  }
  ```
- **Description**: Adds a new school to the database after validating the input data.

### List Schools

- **Endpoint**: `/api/schools/listSchools`
- **Method**: GET
- **Parameters**:
  - `latitude`: User's latitude.
  - `longitude`: User's longitude.
- **Description**: Fetches all schools from the database, sorts them based on proximity to the user's location, and returns the sorted list.

## Environment Variables

- `DB_HOST`: Hostname of your MySQL database.
- `DB_USER`: Username for your MySQL database.
- `DB_PASS`: Password for your MySQL database.
- `DB_NAME`: Name of your database (e.g., `school_db`).
- `DB_PORT`: Port number for your MySQL database (default is `3306`).

## Database Setup

1. Connect to your MySQL database.
2. Run the following commands:
    ```sql
    USE school_db;

    CREATE TABLE schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
    );
    ```

## Deployment

To deploy your project to a hosting service like Render:

1. **Create a new web service** on Render.
2. **Connect your GitHub repository** to Render.
3. **Set up environment variables** in the Render dashboard:
    - `DB_HOST`
    - `DB_USER`
    - `DB_PASS`
    - `DB_NAME`
    - `DB_PORT`
4. **Deploy the service** and Render will handle the rest.

**Note:** For the database setup, I used Aiven for MySQL as the online server. After establishing a connection using MySQL Workbench, I created the `school_db` database and the `schools` table as described in the Database Setup section.

## Postman Collection

You can use the following Postman collection to test your API endpoints:

1. **Import the collection** using the link:
    ```plaintext
    https://tinyurl.com/bdd4h42f
    ```
2. **Set the `baseUrl` variable** to your deployed API URL:
    ```plaintext
    https://school-proximity-api.onrender.com
    ```

## Haversine Formula

The Haversine formula is used to calculate the great-circle distance between two points on a sphere given their longitudes and latitudes. This formula is essential for sorting the list of schools based on their proximity to a user-specified location.

### Formula

## YT link -> https://youtu.be/t6NkBRQ2Fz0

```plaintext
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2( √a, √(1−a) )
d = R ⋅ c

where:
- φ is latitude,
- λ is longitude,
- R is the Earth's radius (mean radius = 6,371 km)
- Δφ is the difference in latitude
- Δλ is the difference in longitude
```

### Example Implementation in JavaScript

```javascript
function haversineDistance(lat1, lon1, lat2, lon2) {
    function toRadians(degree) {
        return degree * (Math.PI / 180);
    }
    const R = 6371; // earth’s mean radius in kms
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in kms
}
```

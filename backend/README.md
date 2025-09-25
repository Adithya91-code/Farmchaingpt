# FarmChainX Backend

Spring Boot backend application for FarmChainX Supply Chain Management System.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **User Management**: Registration and login for different user roles (Farmer, Distributor, Retailer, Consumer, Admin)
- **Crop Management**: CRUD operations for crops with supply chain tracking
- **Supply Chain Tracking**: Complete traceability from farm to consumer
- **SQL Server Integration**: Robust database storage with JPA/Hibernate

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- SQL Server (Local or Azure SQL Database)

## Database Setup

1. Install SQL Server or use Azure SQL Database
2. Create a database named `farmchainx`
3. Update the database connection details in `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=farmchainx;encrypt=true;trustServerCertificate=true
    username: your_username
    password: your_password
```

## Environment Variables

Set the following environment variables:

- `DB_USERNAME`: Database username (default: sa)
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT secret key for token signing

## Running the Application

1. Clone the repository
2. Navigate to the backend directory
3. Run the application:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Crops (Protected)
- `GET /api/crops` - Get user's crops
- `POST /api/crops` - Create new crop
- `PUT /api/crops/{id}` - Update crop
- `DELETE /api/crops/{id}` - Delete crop
- `GET /api/crops/farmer/{farmerId}` - Get crops by farmer ID
- `GET /api/crops/distributor/{distributorId}` - Get crops by distributor ID

### QR Code Scanning
- `GET /api/crops/scan/{cropId}` - Get crop details for QR scanning (public)

## Database Schema

The application automatically creates the following tables:

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Encrypted)
- `name`
- `location`
- `role` (FARMER, DISTRIBUTOR, RETAILER, CONSUMER, ADMIN)
- `farmer_id` (3-digit unique ID for farmers)
- `distributor_id` (3-digit unique ID for distributors)
- `created_at`
- `updated_at`

### Crops Table
- `id` (Primary Key)
- `name`
- `crop_type`
- `harvest_date`
- `expiry_date`
- `soil_type`
- `pesticides_used`
- `image_url`
- `user_id` (Foreign Key)
- Supply chain tracking fields
- `created_at`
- `updated_at`

## Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control
- CORS configuration for frontend integration

## Development

The application uses:
- Spring Boot 3.2.0
- Spring Security 6
- Spring Data JPA
- SQL Server JDBC Driver
- JWT (JSON Web Tokens)
- Bean Validation

## Testing

Run tests with:
```bash
mvn test
```

## Building for Production

```bash
mvn clean package
```

This creates a JAR file in the `target` directory that can be deployed to any server with Java 17+.
# Configuration Schema Documentation

This document describes the complete configuration schema used by the Onerlaw CLI. The schema is defined using [Zod](https://github.com/colinhacks/zod) for runtime validation and TypeScript type safety.

## Schema Overview

The configuration system supports multiple projects, each with their own environment settings. This allows you to manage different Google Cloud projects and environments from a single configuration file.

## Schema Definition Location

The complete schema is defined in `src/config/schema.mts` using Zod validation. This ensures type safety and runtime validation of all configuration values.

## Configuration Structure

### Root Configuration Schema

```typescript
type Config = Array<ProjectConfig>
```

The root configuration is an array of project configurations, allowing you to manage multiple Google Cloud projects.

### Project Configuration Schema

```typescript
type ProjectConfig = {
  project: string              // Google Cloud Project ID
  environment: EnvironmentConfig
}
```

Each project contains:
- **project**: Google Cloud Project ID (required, minimum 1 character)
- **environment**: Environment-specific configuration

### Environment Configuration Schema

```typescript
type EnvironmentConfig = {
  name: string                    // Environment name (required)
  environment: 'dev' | 'staging' | 'prod'  // Environment type
  database?: DatabaseConfig | null          // Optional database configuration
  pubsub?: PubSubConfig | null             // Optional Pub/Sub configuration  
  apps?: Array<AppConfig> | null           // Optional apps configuration
}
```

#### Environment Fields

- **name**: 
  - **Type**: `string`
  - **Required**: Yes
  - **Validation**: Minimum 1 character
  - **Description**: Unique name for this environment (e.g., "my-app", "api-v2")

- **environment**: 
  - **Type**: `'dev' | 'staging' | 'prod'`
  - **Required**: Yes
  - **Description**: Environment type affecting resource sizing and configuration

- **database**: 
  - **Type**: `DatabaseConfig | null`
  - **Required**: No
  - **Default**: `null`
  - **Description**: Database configuration (enables Cloud SQL when provided)

- **pubsub**: 
  - **Type**: `PubSubConfig | null`
  - **Required**: No
  - **Default**: `null`
  - **Description**: Pub/Sub configuration (enables Pub/Sub when provided)

- **apps**: 
  - **Type**: `Array<AppConfig> | null`
  - **Required**: No
  - **Default**: `null`
  - **Description**: Application configurations for Cloud Run deployments

## Database Configuration

```typescript
type DatabaseConfig = {
  name: string    // Database name
  user: string    // Database user
}
```

When database configuration is provided, the infrastructure will create:
- Cloud SQL PostgreSQL instance
- Database with specified name
- Database user with generated password
- VPC private service connection
- Secret Manager entries for credentials

#### Database Fields

- **name**:
  - **Type**: `string`
  - **Required**: Yes (when database config is provided)
  - **Validation**: Minimum 1 character
  - **Description**: Name of the PostgreSQL database to create

- **user**:
  - **Type**: `string`
  - **Required**: Yes (when database config is provided)
  - **Validation**: Minimum 1 character
  - **Description**: Username for database access (password is auto-generated)

## Pub/Sub Configuration

```typescript
type PubSubConfig = {
  topic: string   // Pub/Sub topic name
}
```

When Pub/Sub configuration is provided, the infrastructure will create:
- Pub/Sub topic
- Subscription for message consumption
- IAM bindings for Cloud Run services
- Optional dead letter topic for failed messages

#### Pub/Sub Fields

- **topic**:
  - **Type**: `string`
  - **Required**: Yes (when Pub/Sub config is provided)
  - **Validation**: Minimum 1 character
  - **Description**: Name of the Pub/Sub topic to create

## Application Configuration

```typescript
type AppConfig = {
  name: string      // Application name
  port?: number     // Optional custom port
  dns?: DNSConfig   // Optional DNS configuration
}
```

Applications represent individual Cloud Run services that will be deployed. Each app gets its own:
- Cloud Run service
- Service account
- Container image registry
- Environment variables and secrets
- Load balancer backend (if DNS configured)

#### Application Fields

- **name**:
  - **Type**: `string`
  - **Required**: Yes
  - **Validation**: Minimum 1 character
  - **Description**: Unique name for the application/service

- **port**:
  - **Type**: `number`
  - **Required**: No
  - **Validation**: Integer, positive value
  - **Default**: 3000 (when not specified)
  - **Description**: Port number the application listens on

- **dns**:
  - **Type**: `DNSConfig`
  - **Required**: No
  - **Description**: DNS configuration for custom domain routing

### DNS Configuration

```typescript
type DNSConfig = {
  domainName: string          // Primary domain name
  subdomainNames: string[]    // Array of subdomain names
}
```

When DNS configuration is provided, the infrastructure will create:
- Global HTTP(S) Load Balancer
- Managed SSL certificate
- Cloud DNS zone and records
- Domain routing to Cloud Run services

#### DNS Fields

- **domainName**:
  - **Type**: `string`
  - **Required**: Yes (when DNS config is provided)
  - **Validation**: Minimum 1 character
  - **Description**: Primary domain name (e.g., "example.com")

- **subdomainNames**:
  - **Type**: `Array<string>`
  - **Required**: Yes (when DNS config is provided)
  - **Validation**: Minimum 1 subdomain required
  - **Description**: Array of subdomain names (e.g., ["www", "api", "admin"])

## Configuration Examples

### Basic Configuration (No Database, No Apps)

```json
[
  {
    "project": "my-gcp-project",
    "environment": {
      "name": "simple-app",
      "environment": "dev"
    }
  }
]
```

### Configuration with Database

```json
[
  {
    "project": "my-gcp-project", 
    "environment": {
      "name": "app-with-db",
      "environment": "prod",
      "database": {
        "name": "myapp_db",
        "user": "myapp_user"
      }
    }
  }
]
```

### Configuration with Apps and DNS

```json
[
  {
    "project": "my-gcp-project",
    "environment": {
      "name": "microservices-app",
      "environment": "prod",
      "database": {
        "name": "shared_db", 
        "user": "app_user"
      },
      "pubsub": {
        "topic": "events"
      },
      "apps": [
        {
          "name": "api-server",
          "port": 8080,
          "dns": {
            "domainName": "myapp.com",
            "subdomainNames": ["api", "admin"]
          }
        },
        {
          "name": "worker-service",
          "port": 3000
        },
        {
          "name": "frontend",
          "dns": {
            "domainName": "myapp.com", 
            "subdomainNames": ["www"]
          }
        }
      ]
    }
  }
]
```

### Multi-Project Configuration

```json
[
  {
    "project": "dev-project-123",
    "environment": {
      "name": "development",
      "environment": "dev",
      "apps": [
        {
          "name": "api",
          "port": 8000
        }
      ]
    }
  },
  {
    "project": "prod-project-456", 
    "environment": {
      "name": "production",
      "environment": "prod",
      "database": {
        "name": "prod_db",
        "user": "prod_user"
      },
      "pubsub": {
        "topic": "prod-events"
      },
      "apps": [
        {
          "name": "api",
          "port": 8080,
          "dns": {
            "domainName": "mycompany.com",
            "subdomainNames": ["api", "www"]
          }
        },
        {
          "name": "worker"
        }
      ]
    }
  }
]
```

## Container Image Naming

Container images are automatically derived from the configuration using the pattern:

```
us-central1-docker.pkg.dev/{project_id}/{environment}-{environment_name}/{app_name}:latest
```

**Example**: For project `my-project`, environment `prod`, environment name `api-service`, and app name `backend`:
```
us-central1-docker.pkg.dev/my-project/prod-api-service/backend:latest
```

## Resource Naming Conventions

All Google Cloud resources follow consistent naming patterns:

### Service Names
- **Pattern**: `{environment}-{environment_name}-{app_name}`
- **Example**: `prod-api-service-backend`

### Registry Names
- **Pattern**: `{environment}-{environment_name}`
- **Example**: `prod-api-service`

### Database Instance Names
- **Pattern**: `{environment}-{environment_name}`
- **Example**: `prod-api-service`

### VPC Names
- **Pattern**: `{environment}-{environment_name}-vpc`
- **Example**: `prod-api-service-vpc`

### Service Account Names
- **Pattern**: `{environment}-{environment_name}-{app_name}-sa`
- **Example**: `prod-api-service-backend-sa`

## Validation Rules

The schema enforces the following validation rules:

### Project Level
- **project**: Must be a non-empty string (Google Cloud Project ID format)

### Environment Level
- **name**: Must be 1-63 characters (Google Cloud resource naming limits)
- **environment**: Must be exactly one of: `dev`, `staging`, `prod`

### Database Level (when provided)
- **name**: Must be a non-empty string
- **user**: Must be a non-empty string

### Pub/Sub Level (when provided)
- **topic**: Must be a non-empty string

### Apps Level (when provided)
- **name**: Must be 1-63 characters per app
- **port**: Must be between 1-65535 if specified

### DNS Level (when provided)
- **domainName**: Must be a non-empty string
- **subdomainNames**: Must contain at least 1 subdomain

## Configuration Management Commands

The CLI provides commands to manage configurations:

- **`onerlaw-cli config new`**: Create new configuration interactively
- **`onerlaw-cli config modify`**: Modify existing configuration
- **`onerlaw-cli config remove`**: Remove configuration

Configuration files are stored locally in your project and used by deployment commands.

## Environment Variables and Secrets

### Automatic Environment Variables

When database is configured, Cloud Run services automatically receive:
- `DATABASE_URL`: Complete PostgreSQL connection string
- `DATABASE_NAME`: Database name
- `DATABASE_USER`: Database username
- `DATABASE_PASSWORD`: Database password (from Secret Manager)

### Custom Secrets

Additional secrets can be managed using:
```bash
# Single secret
onerlaw-cli secret -s SECRET_NAME -v SECRET_VALUE

# Bulk from .env file
onerlaw-cli secret --env-file .env
```

Secrets are automatically made available to all Cloud Run services in the environment.

## Best Practices

### Configuration Design
1. **Environment Separation**: Use separate projects or environment names for dev/staging/prod
2. **Descriptive Names**: Use clear, descriptive names for environments and apps
3. **Consistent Naming**: Follow the established naming conventions
4. **Minimal Configuration**: Only configure resources you need to reduce costs

### Security Considerations
1. **Project Isolation**: Use separate Google Cloud projects for sensitive environments
2. **Database Configuration**: Always use the database configuration for persistent data needs
3. **Secret Management**: Use the CLI's secret management for sensitive configuration
4. **DNS Configuration**: Only configure DNS for apps that need public access

### Performance Optimization
1. **Port Configuration**: Specify custom ports only when needed (defaults to 3000)
2. **App Granularity**: Design apps as independently scalable services
3. **Resource Sizing**: Use appropriate environment types (dev/staging/prod) for resource allocation

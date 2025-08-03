# Load Balancer Module

This Terraform module creates a global external Application Load Balancer for Cloud Run services. It provides SSL termination, HTTP to HTTPS redirect, and path-based routing capabilities.

## Features

- Global external Application Load Balancer
- Automatic SSL certificate management with Google-managed certificates
- HTTP to HTTPS redirect for security
- Path-based routing support for multiple backend services
- Network Endpoint Group (NEG) for Cloud Run integration
- Environment-based resource naming for multi-environment deployments
- Comprehensive input validation and error handling

## Usage

### Basic Usage

```hcl
module "load_balancer" {
  source = "./modules/load-balancer"

  environment             = "prod"
  environment_name        = "my-app-prod"
  project_id              = "my-project-id"
  region                  = "us-central1"
  domains                 = ["example.com", "www.example.com"]
  cloud_run_service_name  = "my-cloud-run-service"
  network                 = "my-vpc-network"
}
```

### With Custom Configuration

```hcl
module "load_balancer" {
  source = "./modules/load-balancer"

  environment             = "staging"
  environment_name        = "my-app-staging"
  project_id              = "my-project-id"
  region                  = "us-central1"
  domains                 = ["staging.example.com"]
  cloud_run_service_name  = "my-cloud-run-service"
  network                 = "my-vpc-network"
  
  # Optional routing rules for path-based routing
  routing_rules = [
    {
      hosts              = ["api.example.com"]
      path_matcher_name  = "api-matcher"
      backend_service_id = "api-backend-service"
      path_rules = [
        {
          paths              = ["/api/*"]
          backend_service_id = "api-backend-service"
        }
      ]
    }
  ]
}
```



## Inputs

### Required Variables

| Name | Description | Type | Required |
|------|-------------|------|:--------:|
| environment | The environment type (dev, staging, prod) | `string` | yes |
| environment_name | The name of the environment (e.g., 'my-app-dev', 'my-app-prod') | `string` | yes |
| project_id | The Google Cloud Project ID | `string` | yes |
| region | The Google Cloud region for the Network Endpoint Group | `string` | yes |
| domains | List of domains for the SSL certificate | `list(string)` | yes |
| cloud_run_service_name | The name of the Cloud Run service to route traffic to | `string` | yes |
| network | The VPC network name for firewall rules | `string` | yes |

### Optional Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| routing_rules | List of routing rules for path-based routing to different backend services | `list(object)` | `[]` | no |

## Outputs

| Name | Description |
|------|-------------|
| ip_address | The global IP address of the load balancer |
| forwarding_rule_name | The name of the HTTPS forwarding rule |
| url_map_name | The name of the URL map |
| backend_service_name | The name of the backend service |
| neg_name | The name of the Network Endpoint Group |
| ssl_certificate_name | The name of the managed SSL certificate |
| base_name | The base name used for all resources in this module |

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 1.0 |
| google | ~> 5.0 |

## Resource Naming

All resources created by this module follow the naming convention:
- `${environment}-${environment_name}-lb-{resource-type}`

For example:
- `prod-my-app-prod-lb-ip` (Global IP address)
- `prod-my-app-prod-lb-backend` (Backend service)
- `prod-my-app-prod-lb-ssl-cert` (SSL certificate)

## Security Considerations

- **SSL Certificates**: Uses Google-managed SSL certificates for automatic renewal and management
- **Network Security**: Ensure your VPC network has appropriate security rules for your use case

## Serverless NEG Considerations

This module uses a serverless Network Endpoint Group (NEG) for Cloud Run integration. Important notes:
- **No Health Checks**: Serverless NEGs do not support health checks. Cloud Run handles service availability internally.
- **Automatic Scaling**: Cloud Run services automatically scale based on traffic and can scale to zero when not in use.
- **Cold Starts**: Be aware of potential cold start latency for Cloud Run services that scale to zero.

## Limitations and Considerations

- **SSL Certificate**: Managed SSL certificates require DNS validation. Ensure your domains point to the load balancer's IP address
- **Routing Rules**: Path-based routing rules are optional and only applied if specified
- **Network Endpoint Groups**: The module uses serverless NEGs specifically for Cloud Run services
- **Environment Validation**: The environment variable must be one of: dev, staging, prod

## Example Multi-Environment Setup

```hcl
# Development environment
module "load_balancer_dev" {
  source = "./modules/load-balancer"

  environment             = "dev"
  environment_name        = "my-app-dev"
  project_id              = "my-project-id"
  region                  = "us-central1"
  domains                 = ["dev.example.com"]
  cloud_run_service_name  = "my-cloud-run-service-dev"
  network                 = "my-vpc-network"
}

# Production environment
module "load_balancer_prod" {
  source = "./modules/load-balancer"

  environment             = "prod"
  environment_name        = "my-app-prod"
  project_id              = "my-project-id"
  region                  = "us-central1"
  domains                 = ["example.com", "www.example.com"]
  cloud_run_service_name  = "my-cloud-run-service-prod"
  network                 = "my-vpc-network"
}
```

## Dependencies

This module has the following dependencies:
- Google Cloud Project with billing enabled
- Cloud Run service already deployed
- VPC network for firewall rules
- Appropriate IAM permissions for the service account running Terraform

## Contributing

When contributing to this module, please ensure:
- All resources follow the naming convention `${environment}-${environment_name}-lb-{resource-type}`
- Variables include proper validation rules
- Sensitive variables are marked with `sensitive = true`
- Documentation is updated for any new features or changes 
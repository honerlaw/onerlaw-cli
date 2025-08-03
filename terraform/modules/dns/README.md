# DNS Module

This module creates and manages DNS records for a load balancer using Google Cloud DNS. It automatically sets up DNS zones and records to route traffic from your domain to the load balancer.

## Purpose

The DNS module solves the problem of manually configuring DNS records by automatically:
- Creating a Cloud DNS managed zone for your domain
- Setting up A records pointing to the load balancer IP address
- Configuring www subdomain records (A or CNAME)
- Supporting additional subdomains as needed
- Enabling DNSSEC for security
- Enabling Cloud Logging for DNS query monitoring

## Features

- **Automatic DNS Zone Creation**: Creates a managed DNS zone for your domain
- **Load Balancer Integration**: Automatically points DNS records to your load balancer's IP address
- **Subdomain Support**: Configures www and additional subdomains
- **Security**: Enables DNSSEC for enhanced security
- **Monitoring**: Enables Cloud Logging for DNS query monitoring
- **Flexible Configuration**: Supports both A records and CNAME records for subdomains

## Usage

### Basic Usage

```hcl
module "dns" {
  source = "./modules/dns"

  environment            = "prod"
  environment_name       = "my-app"
  project_id             = "my-project-id"
  domain_name            = "example.com"
  load_balancer_ip_address = module.load_balancer[0].ip_address

  depends_on = [module.load_balancer]
}
```

### Advanced Usage with Additional Subdomains

```hcl
module "dns" {
  source = "./modules/dns"

  environment            = "prod"
  environment_name       = "my-app"
  project_id             = "my-project-id"
  domain_name            = "example.com"
  load_balancer_ip_address = module.load_balancer[0].ip_address
  
  create_www_record      = true
  create_www_cname_record = false
  subdomain_names  = ["api", "admin", "cdn"]

  depends_on = [module.load_balancer]
}
```

## Required Variables

- `environment`: The environment type (dev, staging, prod)
- `environment_name`: The name of the environment
- `project_id`: The Google Cloud Project ID
- `domain_name`: The primary domain name (e.g., "example.com")
- `load_balancer_ip_address`: The IP address of the load balancer

## Optional Variables

- `create_www_record`: Whether to create an A record for www subdomain (default: true)
- `create_www_cname_record`: Whether to create a CNAME record for www subdomain (default: false)
- `subdomain_names`: List of subdomain names to create A records for (e.g., ["api", "admin", "staging"])

## Outputs

- `dns_zone_name`: The name of the DNS managed zone
- `dns_zone_dns_name`: The DNS name of the managed zone
- `name_servers`: The list of name servers for the DNS zone
- `primary_domain_a_record`: The A record for the primary domain
- `www_a_record`: The A record for www subdomain (if created)
- `www_cname_record`: The CNAME record for www subdomain (if created)
- `additional_subdomain_records`: The A records for additional subdomains

## DNS Configuration

After deploying this module, you'll need to:

1. **Update your domain registrar**: Point your domain's name servers to the Google Cloud DNS name servers provided in the `name_servers` output
2. **Wait for propagation**: DNS changes can take up to 48 hours to propagate globally
3. **Verify SSL certificate**: The load balancer's SSL certificate will automatically provision once DNS is properly configured

## Dependencies

This module depends on:
- Google Cloud DNS API being enabled
- A load balancer module that provides an IP address
- Proper IAM permissions for DNS management

## Security Considerations

- DNSSEC is enabled by default for enhanced security
- Cloud Logging is enabled for DNS query monitoring
- All DNS records point to the load balancer, which handles SSL termination

## Cost Considerations

- Cloud DNS managed zones have a monthly cost per zone
- DNS queries are charged per million queries
- DNSSEC and Cloud Logging may incur additional costs 
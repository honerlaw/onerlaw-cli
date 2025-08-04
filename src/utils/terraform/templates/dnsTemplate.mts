import { type EnvironmentConfig } from '@/config/schema.mjs'

export function dnsTemplate(dns: EnvironmentConfig['dns'] = null): string {
  if (!dns) {
    return `# domain_name = "example.com"  # Uncomment and set to enable load balancer and DNS
# subdomain_names = ["www", "api"]  # Uncomment and set to enable subdomains`
  }

  return `domain_name = "${dns.domainName}"
subdomain_names = ${JSON.stringify(dns.subdomainNames)}`
}

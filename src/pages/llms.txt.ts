import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site, url }) => {
  const siteURL = site ?? new URL(url.origin);
  const absoluteURL = (path: string) => new URL(path, siteURL).toString();
  const profileURL = absoluteURL("/");

  return new Response(
    `# Ban Tran
> DataOps-Sec & Lead Data Engineer based in Ho Chi Minh City, Vietnam. Specialized in Apache Kafka, Apache Spark, Kubernetes, Hashicorp Vault, Keycloak, Go, and enterprise data platforms.

## Main Pages
- [Home](${profileURL}): Canonical profile page and professional bio.
- [Projects](${absoluteURL("/projects/")}): Data engineering, security, and cloud-native projects.
- [Blog](${absoluteURL("/blog/")}): Technical articles on Kafka, Kubernetes, security, and systems engineering.
- [Contact](${absoluteURL("/contact/")}): Get in touch or connect on social media.
- [CV](${absoluteURL("/cv/")}): Full curriculum vitae detailing work experience and education.

## Technical Expertise
- **Core**: Apache Kafka, Apache Spark, Kubernetes, Python, Go, PostgreSQL.
- **Security & DataOps-Sec**: Hashicorp Vault, Keycloak SSO, Coraza WAF, APISIX.
- **DevOps & Cloud**: Docker, ArgoCD, Azure, Prometheus, Grafana, Redis, Supabase, Terraform.

## Professional Experience
- **Head of Data Control Department at Esuhai Group (2022 - Present)**: Leads a 9-member team managing data pipelines processing 10M+ events daily with 99.99% uptime.
- **Database Administrator at IQVIA Inc (2017 - 2022)**: Architected drugstore data foundations and engineered record-matching algorithms for 100K+ entries.

## Key Projects
- [Real-time Data Synchronization Platform](${absoluteURL("/projects/realtime-data-sync")}): CDC pipelines processing millions of events daily with Kafka and Go.
- [Zero-Trust Security Infrastructure](${absoluteURL("/projects/zero-trust-soc")}): High-security setup featuring Vault, Keycloak SSO, and APISIX API Gateway.
- [High-Availability Kubernetes Platform](${absoluteURL("/projects/kubernetes-cluster")}): Automated CI/CD deployments using ArgoCD and container migrations.
- [AVIF Image Converter](${absoluteURL("/projects/image-converter")}): High-performance image optimization API utilizing Go and Libvips.
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};

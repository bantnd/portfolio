// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import type { Header, Footer, About, Project } from "./types.ts";

import ProfilePic from "./assets/profile-pic.png";

import ZeroTrust from "./assets/projects/ZeroTrust.png";
import Kubernetes from "./assets/projects/Kubernetes.svg";
import AvifLogo from "./assets/projects/Avif-logo-rgb.svg";
import MSSQLIcon from "./assets/icons/mssql.svg";
import BytebaseIcon from "./assets/icons/bytebase.svg";
import LinkedinIcon from "./assets/icons/linkedin.svg";
import AzureIcon from "./assets/icons/Azure.svg";
import FabricIcon from "./assets/icons/fabric.svg";
import LokiIcon from "./assets/icons/loki.svg";
import ApisixIcon from "./assets/icons/apisix.svg";
import LonghornIcon from "./assets/icons/longhorn.svg";
import MaterializeIcon from "./assets/icons/materialize.svg";
import PowerBIIcon from "./assets/icons/PowerBI.svg";

export const meta = {
  about: {
    // index page
    title: "Ban Tran — DataOps-Sec / Lead Data Engineer",
    description:
      "Ban Tran is a DataOps-Sec and Lead Data Engineer in Ho Chi Minh City, Vietnam, focused on Kafka, Spark, Kubernetes, Vault, Keycloak, and enterprise data platforms.",
  },
  projects: {
    title: "Projects | Ban Tran",
    description:
      "Selected data engineering, DataOps-Sec, Kubernetes, streaming, and cloud-native security projects by Ban Tran.",
  },
  blog: {
    title: "Blog | Ban Tran",
    description:
      "Technical notes and articles from Ban Tran on data engineering, DataOps-Sec, Kafka, Kubernetes, and cloud-native systems.",
  },
  contact: {
    title: "Contact | Ban Tran",
    description:
      "Contact Ban Tran, DataOps-Sec and Lead Data Engineer based in Ho Chi Minh City, Vietnam.",
  },
  cv: {
    title: "CV | Ban Tran",
    description:
      "Curriculum vitae of Ban Tran, DataOps-Sec and Lead Data Engineer in Ho Chi Minh City, Vietnam.",
  },
  // blog post title and description are taken from the variables in markdown file
};

export const header: Header = { logoTitle: "B" };

export const footer: Footer = {
  // parses html
  content:
    // "Made with ❤️ by Ban Tran • <a href='https://github.com/bantnd/vercel-portfolio' class='link'>Source Code</a>",
    "Made with ❤️ by Ban Tran",
};

export const about: About = {
  // parses html
  headLine: "Hi, I'm <span class='fancy-highlight'>Ban Tran</span>",
  tagLine: "DataOps-Sec / Lead Data Engineer",
  profilePic: ProfilePic,
  // parses html
  description:
    "I'm a Computer Scientist and DataOps-Sec specialist focused on architecting high-performance, resilient data systems. Currently leading data control initiatives at Esuhai Group, I orchestrate enterprise-scale pipelines using **Kafka**, **Spark**, and **Kubernetes**. My work bridges the gap between massive-scale **Data Engineering**, **Cloud-Native Security (Vault/Keycloak)**, and **DevOps**, transforming complex data flows into strategic, secure, and actionable assets processing **10M+ events daily**.",
  links: [
    {
      icon: "Github",
      iconUrl: "https://cdn.simpleicons.org/github",
      href: "https://github.com/bantnd"
    },
    {
      icon: "Linkedin",
      iconUrl: LinkedinIcon.src,
      href: "https://www.linkedin.com/in/bantnd/"
    },
    {
      icon: "Telegram",
      iconUrl: "https://cdn.simpleicons.org/telegram",
      href: "https://t.me/B_TND"
    },
    {
      icon: "Signal",
      iconUrl: "https://cdn.simpleicons.org/signal",
      href: "https://signal.me/#eu/UaFB41yCNAhrkK5IrSXMuF07MK_EKwHQ7tHn4-eAGgPFxtCaSfxM_5RpgfVh49Yw"
    },
    {
      icon: "Zalo",
      iconUrl: "https://cdn.simpleicons.org/zalo",
      href: "https://zaloapp.com/qr/p/1i7p9az54et7r"
    },
    {
      icon: "Mail",
      iconUrl: "https://cdn.simpleicons.org/gmail",
      href: "mailto:ban.ndtran@gmail.com"
    },
  ],
  workExperience: [
    {
      title: "Head of Data Control Department",
      timeline: "2022 - Present",
      company: "Esuhai Group",
      location: "Vietnam",
      description: [
        "Leading a **9-member team** to architect and manage mission-critical data flows, processing **10M+ events daily** with 99.99% uptime",
        "Orchestrated real-time ETL/ELT pipelines using **Kafka** and **Spark**, reducing data ingestion latency by **60%**",
        "Administered **Bitrix24 CRM** at scale, automating complex cross-departmental workflows for **500+ users**",
        "Derived actionable strategic insights through executive **Power BI** dashboards, driving data-informed decisions for leadership",
        "Hardened security posture by implementing **Hashicorp Vault**, **Keycloak SSO**, and **Coraza WAF**, achieving ZERO security breaches in 2 years",
        "Architected high-availability **Kubernetes** clusters and migrated legacy workloads to cloud-native environments via automated CI/CD",
      ],
    },
    {
      title: "Database Administrator",
      timeline: "2017 - 2022",
      company: "IQVIA Inc",
      location: "Vietnam",
      description: [
        "Architected drugstore universal data foundation, ensuring **100% data integrity** and availability for analytical reporting",
        "Engineered fuzzy matching algorithms to standardize **100K+ records** with **95%+ accuracy**, eliminating critical data duplication",
        "Streamlined legacy workflows, resulting in a **40% reduction** in end-to-end data processing time",
        "Delivered critical QA and data exports for stakeholders across **10+ departments** with rigorous accuracy standards",
        "Developed custom internal QC tools that empowered non-technical users to perform advanced data analysis",
      ],
    },
  ],
  education: [
    {
      title: "Bachelor of Computer Science",
      timeline: "2013 - 2017",
      institution: "University of Information Technology VNUHCM",
      location: "Vietnam",
      description: [
        "Researched and developed intelligent systems used in education and administration including intelligent problem solvers, automated knowledge queries, management systems, search semantic text documents, expert systems, decision support systems, and diagnostic systems.",
        "Researched and developed application systems used in computer vision and multimedia processing systems.",
      ],
    },
  ],
  // parses html
  getInTouch:
    "Have a project in mind or just want to chat? I'm always open to discussing new ideas and opportunities. Feel free to reach out directly or connect with me on social media.",
  techStack: {
    core: [
      { name: "Apache Kafka", icon: "https://cdn.simpleicons.org/apachekafka" },
      { name: "Apache Spark", icon: "https://cdn.simpleicons.org/apachespark" },
      { name: "Kubernetes", icon: "https://cdn.simpleicons.org/kubernetes" },
      { name: "Python", icon: "https://cdn.simpleicons.org/python" },
      { name: "Go", icon: "https://cdn.simpleicons.org/go" },
      { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql" },
    ],
    secondary: [
      { name: "Docker", icon: "https://cdn.simpleicons.org/docker" },
      { name: "Apache Airflow", icon: "https://cdn.simpleicons.org/apacheairflow" },
      { name: "ArgoCD", icon: "https://cdn.simpleicons.org/argo" },
      { name: "Azure", icon: AzureIcon.src },
      { name: "Hashicorp Vault", icon: "https://cdn.simpleicons.org/vault" },
      { name: "Keycloak", icon: "https://cdn.simpleicons.org/keycloak" },
      { name: "Power BI", icon: PowerBIIcon.src },
      { name: "Redis", icon: "https://cdn.simpleicons.org/redis" },
      { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql" },
      { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase" },
      { name: "Grafana", icon: "https://cdn.simpleicons.org/grafana" },
      { name: "Prometheus", icon: "https://cdn.simpleicons.org/prometheus" },
    ],
    familiar: [
      { name: "Javascript", icon: "https://cdn.simpleicons.org/javascript" },
      { name: "PHP", icon: "https://cdn.simpleicons.org/php" },
      { name: "Bash", icon: "https://cdn.simpleicons.org/gnubash" },
      { name: "Microsoft SQL Server", icon: MSSQLIcon.src },
      { name: "Elasticsearch", icon: "https://cdn.simpleicons.org/elasticsearch" },
      { name: "OpenSearch", icon: "https://cdn.simpleicons.org/opensearch" },
      { name: "Clickhouse", icon: "https://cdn.simpleicons.org/clickhouse" },
      { name: "Apisix", icon: ApisixIcon.src },
      { name: "Airbyte", icon: "https://cdn.simpleicons.org/airbyte" },
      { name: "Apache Superset", icon: "https://cdn.simpleicons.org/apachesuperset" },
      { name: "N8n", icon: "https://cdn.simpleicons.org/n8n" },
      { name: "Jenkins", icon: "https://cdn.simpleicons.org/jenkins" },
      { name: "Terraform", icon: "https://cdn.simpleicons.org/terraform" },
    ],
  },
};

export const projects: Project[] = [
  {
    logoImage: "https://cdn.simpleicons.org/apachekafka",
    title: "Real-time Data Synchronization Platform",
    techs: ["Kafka", "Debezium", "Confluent", "Go"],
    description:
      "Built enterprise-scale data synchronization system handling millions of events daily. Implemented CDC pipelines with Kafka and stream processing for real-time data transformations.",
    sourceHref: "",
    liveHref: "/projects/realtime-data-sync",
  },
  {
    logoImage: ZeroTrust,
    title: "Zero-Trust Security Infrastructure",
    techs: ["Vault", "Keycloak", "APISIX", "Coraza WAF"],
    description:
      "Designed and implemented enterprise security architecture with centralized secrets management, SSO/OpenID authentication, and API gateway with WAF protection.",
    sourceHref: "",
    liveHref: "/projects/zero-trust-soc",
  },
  {
    logoImage: Kubernetes,
    title: "High-Availability Kubernetes Platform",
    techs: ["Kubernetes", "Docker", "ArgoCD", "Prometheus"],
    description:
      "Migrated legacy applications to HA Kubernetes clusters. Implemented complete CI/CD pipelines, monitoring stack, and automated deployment workflows.",
    sourceHref: "",
    liveHref: "/projects/kubernetes-cluster",
  },
  {
    logoImage: AvifLogo,
    title: "AVIF Image Converter",
    techs: ["Go", "Libvips", "AVIF"],
    description:
      "A project aimed at reducing our company's storage usage by converting existing images into the AVIF format. We have built an API that efficiently converts images to AVIF, enabling smaller file sizes while maintaining image quality. This helps optimize storage costs and improve delivery performance.",
    sourceHref: "",
    liveHref: "/projects/image-converter",
  },
];

// add blog articles in /src/content/blog

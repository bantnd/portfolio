import type { APIRoute } from "astro";
import { about, projects } from "../consts";

const stripMarkup = (value: string) =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

const listItems = (items: string[]) => items.map((item) => `- ${stripMarkup(item)}`).join("\n");

const techItems = [
  ...about.techStack.core,
  ...about.techStack.secondary,
  ...about.techStack.familiar,
].map((tech) => tech.name);

const profileLinks = about.links
  .map((link) => `- ${link.icon}: ${link.href}`)
  .join("\n");

const workExperience = about.workExperience
  .map(
    (job) => `### ${job.title}

${job.company}, ${job.location}

${job.timeline}

${Array.isArray(job.description) ? listItems(job.description) : stripMarkup(job.description)}
`,
  )
  .join("\n");

const education = about.education
  .map(
    (edu) => `### ${edu.title}

${edu.institution}, ${edu.location}

${edu.timeline}

${Array.isArray(edu.description) ? listItems(edu.description) : stripMarkup(edu.description)}
`,
  )
  .join("\n");

const featuredProjects = projects
  .slice(0, 3)
  .map(
    (project) => `### ${project.title}

Technologies: ${project.techs.join(", ")}

${project.description}
`,
  )
  .join("\n");

const buildMarkdown = (profileURL: string) => `# Ban Tran

${about.tagLine}

Ho Chi Minh City, Vietnam

## Summary

${stripMarkup(about.description)}

## Core Expertise

${techItems.map((tech) => `- ${tech}`).join("\n")}

## Featured Projects

${featuredProjects}
## Work Experience

${workExperience}
## Education

${education}
## Contact

Location: Ho Chi Minh City, Vietnam

## Links

${profileLinks}

## Canonical Source

${profileURL}
`;

export const GET: APIRoute = ({ site, url }) => {
  const siteURL = site ?? new URL(url.origin);
  const profileURL = new URL("/", siteURL).toString();

  return new Response(buildMarkdown(profileURL), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};

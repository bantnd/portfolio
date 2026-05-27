# Portfolio Website

Minimalistic and beautiful portfolio website built with [Astro](https://astro.build/) and [daisyUI](https://daisyui.com/).

![Portfolio Screenshot](image.png)

## Requirements

- [Bun](https://bun.sh/) installed (latest stable recommended)

## Run Locally (Bun)

1. Install dependencies:

```bash
bun install
```

2. Start the development server:

```bash
bun run dev
```

3. Open your browser at:

```text
http://localhost:4321
```

## Build For Production

1. Build the site:

```bash
bun run build
```

2. Preview the production build locally:

```bash
bun run preview
```

## Available Scripts

- `bun run dev`: Start Astro development server.
- `bun run build`: Build production output.
- `bun run preview`: Preview production output.

## Customization

- Update site data in `src/consts.ts`.
- Add blog posts in `src/content/blog` using `.md` or `.mdx`.

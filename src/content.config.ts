import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";
import { STATES, TIERS, evidenceProblems, projectProblems, researchProblems } from "./lib/rules";

const fail = (problems: string[], ctx: z.RefinementCtx) =>
  problems.forEach((message) => ctx.addIssue({ code: "custom", message }));

const evidence = defineCollection({
  loader: file("src/content/evidence.json"),
  schema: z
    .object({
      id: z.string(),
      claim: z.string(),
      /** Short label for verification strips and project rows. */
      short: z.string().max(36).optional(),
      state: z.enum(STATES),
      date: z.string().optional(),
      method: z.string().optional(),
      source: z.object({ label: z.string(), url: z.url().optional() }).optional(),
      limitation: z.string().optional(),
      body: z.string(),
    })
    .superRefine((e, ctx) => fail(evidenceProblems(e), ctx)),
});

const mark = z.union([
  z.object({ layers: z.number().int().min(2).max(6), selected: z.number().int().min(0) }),
  z.object({ nodes: z.literal(true) }),
]);

const projects = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "src/content/projects" }),
  schema: z
    .object({
      name: z.string(),
      order: z.number().int(),
      depth: z.enum(["full", "short"]),
      access: z.enum(["public", "private"]),
      status: z.enum(["draft", "published"]).default("published"),
      claim: z.string(),
      description: z.string().max(170),
      row: z.object({ idea: z.string(), evidence: z.array(reference("evidence")).min(1).max(3), note: z.string() }),
      brief: z.object({ problem: z.string(), idea: z.string(), evidence: z.string(), limit: z.string() }),
      briefEvidence: reference("evidence"),
      strip: z.array(reference("evidence")).min(1).max(4),
      repository: z.url().optional(),
      live: z.url().optional(),
      diagram: reference("diagrams").optional(),
      exhibit: z.enum(["null-trap", "presence-timeline"]).optional(),
      mark,
      limitations: z.array(z.string()).min(1),
    })
    .superRefine((p, ctx) => fail(projectProblems({ id: p.name, access: p.access, repository: p.repository }), ctx)),
});

const diagrams = defineCollection({
  loader: file("src/content/diagrams.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    selected: z.number().int().min(0),
    boundary: z.object({ after: z.number().int().min(0), rule: z.string() }).optional(),
    layers: z
      .array(
        z.object({ name: z.string(), purpose: z.string(), modules: z.array(z.string()).max(4), detail: z.string() }),
      )
      .min(2)
      .max(6),
  }),
});

const research = defineCollection({
  loader: file("src/content/research.json"),
  schema: z
    .object({
      id: z.string(),
      title: z.string(),
      status: z.enum(["in-progress", "preprint", "peer-reviewed", "published"]),
      tier: z.enum(TIERS),
      problem: z.string().optional(),
      method: z.string().optional(),
      results: z.string().optional(),
      notShown: z.string(),
      related: reference("projects").optional(),
    })
    .superRefine((r, ctx) => fail(researchProblems(r), ctx)),
});

const capabilities = defineCollection({
  loader: file("src/content/capabilities.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    substantial: z.array(reference("projects")),
    supporting: z.array(reference("projects")),
  }),
});

const roles = defineCollection({
  loader: file("src/content/roles.json"),
  schema: z.object({
    id: z.string(),
    organisation: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string().optional(),
    kind: z.enum(["leadership", "work", "education"]),
    summary: z.string(),
    evidence: z.array(reference("evidence")).default([]),
  }),
});

export const collections = { evidence, projects, diagrams, research, capabilities, roles };

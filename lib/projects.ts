import api from "./api";

export interface Project {
  id: string | number;
  title: string;
  description: string;
  github_url?: string | null;
  demo_url?: string | null;
  tech_stack: string[];
  image_url?: string | null;
  created_at?: string | null;
}

export interface ProjectInput {
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  techStack: string[];
  image: File | null;
  imageUrl: string | null;
}

export function parseTechStack(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function normalize(raw: Record<string, unknown>): Project {
  return {
    ...(raw as unknown as Project),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    tech_stack: parseTechStack(raw.tech_stack),
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await api.get("/portfolio");
  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list.map(normalize);
}

export async function fetchProject(id: string): Promise<Project> {
  const res = await api.get(`/portfolio/${id}`);
  if (!res.data?.data) {
    throw new Error(res.data?.message || "Project tidak ditemukan");
  }
  return normalize(res.data.data);
}

function toFormData(input: ProjectInput) {
  const formData = new FormData();
  formData.append("title", input.title.trim());
  formData.append("description", input.description.trim());
  formData.append("github_url", input.githubUrl.trim());
  formData.append("demo_url", input.demoUrl.trim());
  formData.append("tech_stack", input.techStack.join(","));
  if (input.image) {
    formData.append("image", input.image);
  } else if (input.imageUrl) {
    formData.append("image_url", input.imageUrl);
  }
  return formData;
}

export async function createProject(input: ProjectInput) {
  const res = await api.post("/portfolio", toFormData(input));
  return res.data;
}

export async function updateProject(id: string, input: ProjectInput) {
  const res = await api.put(`/portfolio/${id}`, toFormData(input));
  return res.data;
}

export async function deleteProject(id: Project["id"]) {
  const res = await api.delete(`/portfolio/${id}`);
  return res.data;
}

export function formatDate(value?: string | null, style: "short" | "long" = "short") {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}

const relative = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

export function timeAgo(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const seconds = (date.getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "baru saja";
}

/** Fields that make a portfolio card look unfinished when empty. */
export function missingFields(p: Project) {
  const missing: string[] = [];
  if (!p.image_url) missing.push("gambar");
  if (!p.demo_url) missing.push("demo");
  if (!p.github_url) missing.push("repo");
  if (!p.tech_stack.length) missing.push("tech stack");
  return missing;
}

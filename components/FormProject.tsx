"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiExternalLink, FiGithub, FiImage, FiSave, FiTrash2, FiUploadCloud, FiX } from "react-icons/fi";
import type { ProjectInput } from "@/lib/projects";
import ProjectImage from "@/components/ui/ProjectImage";
import TechBadge from "@/components/ui/TechBadge";
import Spinner from "@/components/ui/Spinner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DESCRIPTION = 500;

interface Props {
  formType: "create" | "edit";
  initialValues?: Partial<ProjectInput>;
  onSubmit: (values: ProjectInput) => Promise<void>;
  footer?: React.ReactNode;
}

type Errors = Partial<Record<"title" | "description" | "githubUrl" | "demoUrl" | "image", string>>;

function isValidUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const inputClass = (hasError?: boolean) =>
  `w-full h-11 px-3.5 rounded-xl border bg-surface text-[15px] outline-none placeholder:text-muted/70 transition focus:ring-4 ${
    hasError
      ? "border-danger focus:ring-danger/15"
      : "border-line focus:border-primary focus:ring-primary/15"
  }`;

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export default function FormProject({ formType, initialValues, onSubmit, footer }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [githubUrl, setGithubUrl] = useState(initialValues?.githubUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(initialValues?.demoUrl ?? "");
  const [techStack, setTechStack] = useState<string[]>(initialValues?.techStack ?? []);
  const [techInput, setTechInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialValues?.imageUrl ?? null);
  const [errors, setErrors] = useState<Errors>({});
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const localPreview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);
  const preview = localPreview ?? imageUrl;

  const addTech = (raw: string) => {
    const items = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!items.length) return;
    setTechStack((prev) => {
      const next = [...prev];
      items.forEach((t) => {
        if (!next.some((x) => x.toLowerCase() === t.toLowerCase())) next.push(t);
      });
      return next;
    });
    setTechInput("");
  };

  const pickFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, image: "File harus berupa gambar (PNG, JPG, WEBP, GIF, SVG)." }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((e) => ({ ...e, image: "Ukuran gambar maksimal 5 MB." }));
      return;
    }
    setErrors((e) => ({ ...e, image: undefined }));
    setImage(file);
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!title.trim()) next.title = "Judul project wajib diisi.";
    if (!description.trim()) next.description = "Deskripsi wajib diisi.";
    else if (description.length > MAX_DESCRIPTION)
      next.description = `Deskripsi maksimal ${MAX_DESCRIPTION} karakter.`;
    if (!isValidUrl(githubUrl)) next.githubUrl = "URL tidak valid. Gunakan format https://...";
    if (!isValidUrl(demoUrl)) next.demoUrl = "URL tidak valid. Gunakan format https://...";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pendingTech = techInput.trim() ? [...techStack, techInput.trim()] : techStack;
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      const first = Object.keys(nextErrors)[0];
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ title, description, githubUrl, demoUrl, techStack: pendingTech, image, imageUrl });
      if (formType === "create") {
        setTechInput("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 lg:pb-0">
      {/* LEFT */}
      <div className="lg:col-span-8 space-y-6">
        <section className="rounded-2xl border border-line bg-surface p-5 md:p-6 space-y-5 animate-fade-in">
          <div>
            <h2 className="font-semibold">Informasi Project</h2>
            <p className="text-sm text-muted mt-0.5">Detail utama yang ditampilkan di portfolio.</p>
          </div>

          <Field label="Judul Project" htmlFor="field-title" error={errors.title} required>
            <input
              id="field-title"
              type="text"
              placeholder="cth. Acme Corp Redesign"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((x) => ({ ...x, title: undefined }));
              }}
              className={inputClass(!!errors.title)}
            />
          </Field>

          <Field
            label="Deskripsi"
            htmlFor="field-description"
            error={errors.description}
            required
            hint={
              <span className="flex justify-between">
                <span>Jelaskan tujuan, fitur utama, dan hasil project.</span>
                <span className="tabular-nums">
                  {description.length}/{MAX_DESCRIPTION}
                </span>
              </span>
            }
          >
            <textarea
              id="field-description"
              rows={5}
              placeholder="Ceritakan secara singkat tentang project ini..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((x) => ({ ...x, description: undefined }));
              }}
              className={`${inputClass(!!errors.description)} h-auto py-2.5 resize-y min-h-[120px]`}
            />
          </Field>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 md:p-6 space-y-5 animate-fade-in">
          <div>
            <h2 className="font-semibold">Link & Teknologi</h2>
            <p className="text-sm text-muted mt-0.5">Tautan repository, demo, dan stack yang digunakan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="GitHub URL" htmlFor="field-githubUrl" error={errors.githubUrl}>
              <div className="relative">
                <FiGithub className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="field-githubUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    if (errors.githubUrl) setErrors((x) => ({ ...x, githubUrl: undefined }));
                  }}
                  className={`${inputClass(!!errors.githubUrl)} pl-10`}
                />
              </div>
            </Field>

            <Field label="Live Demo URL" htmlFor="field-demoUrl" error={errors.demoUrl}>
              <div className="relative">
                <FiExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="field-demoUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://..."
                  value={demoUrl}
                  onChange={(e) => {
                    setDemoUrl(e.target.value);
                    if (errors.demoUrl) setErrors((x) => ({ ...x, demoUrl: undefined }));
                  }}
                  className={`${inputClass(!!errors.demoUrl)} pl-10`}
                />
              </div>
            </Field>
          </div>

          <Field
            label="Tech Stack"
            htmlFor="field-tech"
            hint="Tekan Enter atau koma untuk menambahkan. Backspace untuk menghapus yang terakhir."
          >
            <div className="flex flex-wrap items-center gap-1.5 min-h-11 px-2.5 py-2 rounded-xl border border-line bg-surface focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition">
              {techStack.map((t) => (
                <TechBadge key={t} name={t} className="!text-xs !py-1">
                  <button
                    type="button"
                    onClick={() => setTechStack((prev) => prev.filter((x) => x !== t))}
                    className="-mr-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
                    aria-label={`Hapus ${t}`}
                  >
                    <FiX />
                  </button>
                </TechBadge>
              ))}
              <input
                id="field-tech"
                type="text"
                value={techInput}
                placeholder={techStack.length ? "" : "React, Tailwind CSS, Node.js"}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v.includes(",")) addTech(v);
                  else setTechInput(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech(techInput);
                  } else if (e.key === "Backspace" && !techInput && techStack.length) {
                    setTechStack((prev) => prev.slice(0, -1));
                  }
                }}
                onBlur={() => addTech(techInput)}
                className="flex-1 min-w-[140px] h-7 bg-transparent outline-none text-[15px] placeholder:text-muted/70"
              />
            </div>
          </Field>
        </section>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-4 space-y-6">
        <section className="rounded-2xl border border-line bg-surface p-5 md:p-6 animate-fade-in">
          <h2 className="font-semibold mb-1">Gambar Project</h2>
          <p className="text-sm text-muted mb-4">Thumbnail yang tampil di kartu portfolio.</p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              pickFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />

          {preview ? (
            <div className="group relative rounded-xl overflow-hidden border border-line aspect-[16/10] bg-surface-muted">
              <ProjectImage src={preview} alt="Preview gambar project" className="w-full h-full" />
              <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition flex items-end justify-end gap-2 p-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="h-8 px-3 rounded-lg bg-white/90 text-slate-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-white shadow"
                >
                  <FiImage /> Ganti
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImageUrl(null);
                  }}
                  className="h-8 w-8 rounded-lg bg-white/90 text-rose-600 flex items-center justify-center hover:bg-white shadow"
                  aria-label="Hapus gambar"
                >
                  <FiTrash2 />
                </button>
              </div>
              {image && (
                <span className="absolute top-2 left-2 max-w-[70%] truncate text-[11px] px-2 py-1 rounded-md bg-slate-950/60 text-white backdrop-blur-sm">
                  {image.name}
                </span>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={`w-full aspect-[16/10] rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-6 transition ${
                dragging
                  ? "border-primary bg-primary-soft"
                  : errors.image
                    ? "border-danger/60 bg-danger-soft"
                    : "border-line bg-surface-muted hover:border-primary/60 hover:bg-primary-soft"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-surface text-primary flex items-center justify-center shadow-sm mb-3">
                <FiUploadCloud className="text-xl" />
              </div>
              <p className="text-sm font-medium">
                <span className="text-primary">Klik untuk upload</span> atau seret gambar ke sini
              </p>
              <p className="text-xs text-muted mt-1">PNG, JPG, WEBP, GIF atau SVG · maks. 5 MB</p>
            </button>
          )}
          {errors.image && <p className="text-xs text-danger mt-2">{errors.image}</p>}
        </section>

        {/* Live preview */}
        <section className="hidden lg:block rounded-2xl border border-line bg-surface p-5 md:p-6 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Pratinjau Kartu</p>
          <div className="rounded-xl border border-line overflow-hidden">
            <ProjectImage src={preview} alt="" className="w-full aspect-[16/9]" />
            <div className="p-3">
              <p className="font-semibold text-sm line-clamp-1">{title || "Judul project"}</p>
              <p className="text-xs text-muted mt-1 line-clamp-2">{description || "Deskripsi singkat project."}</p>
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {techStack.slice(0, 4).map((t) => (
                    <TechBadge key={t} name={t} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Actions: sticky bar on mobile, card on desktop */}
        <section className="fixed lg:static inset-x-0 bottom-0 z-20 lg:z-auto border-t lg:border border-line bg-surface/95 lg:bg-surface backdrop-blur-md lg:backdrop-blur-none lg:rounded-2xl p-3 lg:p-6">
          <div className="hidden lg:block mb-4">
            <h2 className="font-semibold">{formType === "create" ? "Publikasikan" : "Simpan Perubahan"}</h2>
            <p className="text-sm text-muted mt-0.5">
              {formType === "create"
                ? "Periksa kembali detail sebelum dipublikasikan ke portfolio."
                : "Perubahan akan langsung tampil di portfolio."}
            </p>
          </div>
          <div className="flex flex-row-reverse lg:flex-col gap-2 lg:gap-3 max-w-7xl mx-auto">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 lg:flex-none h-11 rounded-xl bg-primary text-white dark:text-slate-950 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition shadow-sm shadow-indigo-500/20 disabled:opacity-70"
            >
              {submitting ? <Spinner className="w-4 h-4" /> : <FiSave />}
              {submitting ? "Menyimpan..." : formType === "create" ? "Buat Project" : "Simpan Perubahan"}
            </button>
            <Link
              href="/project"
              className="flex-1 lg:flex-none h-11 rounded-xl border border-line text-sm font-semibold flex items-center justify-center hover:bg-surface-muted transition"
            >
              Batal
            </Link>
          </div>
        </section>

        {footer}
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { FiExternalLink, FiGithub, FiImage, FiTrash2, FiUploadCloud, FiX } from "react-icons/fi";
import type { ProjectInput } from "@/lib/projects";
import { button, input, panel } from "@/lib/ui";
import ProjectImage from "@/components/ui/ProjectImage";
import TechBadge from "@/components/ui/TechBadge";
import Spinner from "@/components/ui/Spinner";
import Kbd from "@/components/ui/Kbd";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DESCRIPTION = 500;

interface Props {
  formType: "create" | "edit";
  initialValues?: Partial<ProjectInput>;
  onSubmit: (values: ProjectInput) => Promise<void>;
  /** Existing tech names, offered as autocomplete so casing stays consistent. */
  techSuggestions?: string[];
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

const noop = () => () => {};
function useIsMac() {
  return useSyncExternalStore(
    noop,
    () => /mac|iphone|ipad/i.test(navigator.userAgent),
    () => false
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: React.ReactNode;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="flex items-baseline gap-1.5 text-[13px] font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-subtle">opsional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <div className="text-xs text-subtle">{hint}</div>
      ) : null}
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-x-8 gap-y-4 p-5 md:p-6">
      <div>
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-[13px] text-muted mt-1">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function FormProject({ formType, initialValues, onSubmit, techSuggestions = [], footer }: Props) {
  const router = useRouter();
  const isMac = useIsMac();
  const [initial] = useState(() => ({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    githubUrl: initialValues?.githubUrl ?? "",
    demoUrl: initialValues?.demoUrl ?? "",
    techStack: initialValues?.techStack ?? [],
    imageUrl: initialValues?.imageUrl ?? null,
  }));

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [githubUrl, setGithubUrl] = useState(initial.githubUrl);
  const [demoUrl, setDemoUrl] = useState(initial.demoUrl);
  const [techStack, setTechStack] = useState<string[]>(initial.techStack);
  const [techInput, setTechInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initial.imageUrl);
  const [errors, setErrors] = useState<Errors>({});
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const localPreview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);
  const preview = localPreview ?? imageUrl;

  const dirty =
    title !== initial.title ||
    description !== initial.description ||
    githubUrl !== initial.githubUrl ||
    demoUrl !== initial.demoUrl ||
    techStack.join("\n") !== initial.techStack.join("\n") ||
    Boolean(techInput.trim()) ||
    image !== null ||
    imageUrl !== initial.imageUrl;

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty || submitting) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, submitting]);

  const suggestions = useMemo(
    () => techSuggestions.filter((s) => !techStack.some((t) => t.toLowerCase() === s.toLowerCase())),
    [techSuggestions, techStack]
  );

  const addTech = (raw: string) => {
    const items = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      // Reuse the existing spelling when the name is already known.
      .map((t) => techSuggestions.find((s) => s.toLowerCase() === t.toLowerCase()) ?? t);
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
    if (!title.trim()) next.title = "Judul wajib diisi.";
    if (!description.trim()) next.description = "Deskripsi wajib diisi.";
    else if (description.length > MAX_DESCRIPTION) next.description = `Maksimal ${MAX_DESCRIPTION} karakter.`;
    if (!isValidUrl(githubUrl)) next.githubUrl = "URL tidak valid — gunakan format https://…";
    if (!isValidUrl(demoUrl)) next.demoUrl = "URL tidak valid — gunakan format https://…";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
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
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = () => {
    if (dirty) setConfirmLeave(true);
    else router.push("/project");
  };

  const canSubmit = formType === "create" || dirty;
  const fieldProps = (name: keyof Errors) => ({
    id: `field-${name}`,
    "aria-invalid": Boolean(errors[name]) || undefined,
    "aria-describedby": errors[name] ? `field-${name}-error` : undefined,
  });

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          if (canSubmit) formRef.current?.requestSubmit();
        }
      }}
      noValidate
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start pb-20 lg:pb-0"
    >
      {/* Main */}
      <div className="min-w-0">
        <div className={`${panel} divide-y divide-line`}>
          <Section title="Informasi" description="Judul dan deskripsi yang tampil di kartu portfolio.">
            <Field label="Judul" htmlFor="field-title" error={errors.title}>
              <input
                {...fieldProps("title")}
                type="text"
                placeholder="Acme Corp Redesign"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((x) => ({ ...x, title: undefined }));
                }}
                className={input(!!errors.title)}
              />
            </Field>

            <Field
              label="Deskripsi"
              htmlFor="field-description"
              error={errors.description}
              hint={
                <span className="flex justify-between gap-4">
                  <span>Apa yang dibangun, untuk siapa, dan hasilnya.</span>
                  <span
                    className={`font-mono tabular-nums ${description.length > MAX_DESCRIPTION ? "text-danger" : ""}`}
                  >
                    {description.length}/{MAX_DESCRIPTION}
                  </span>
                </span>
              }
            >
              <textarea
                {...fieldProps("description")}
                rows={5}
                placeholder="Ceritakan singkat tentang project ini…"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((x) => ({ ...x, description: undefined }));
                }}
                className={input(!!errors.description, "h-auto py-2 leading-relaxed resize-y min-h-[120px]")}
              />
            </Field>
          </Section>

          <Section title="Tautan" description="Repository dan halaman demo. Kosongkan jika tidak ada.">
            <Field label="Repository GitHub" htmlFor="field-githubUrl" error={errors.githubUrl} optional>
              <div className="relative">
                <FiGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
                <input
                  {...fieldProps("githubUrl")}
                  type="url"
                  inputMode="url"
                  placeholder="https://github.com/…"
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    if (errors.githubUrl) setErrors((x) => ({ ...x, githubUrl: undefined }));
                  }}
                  className={input(!!errors.githubUrl, "pl-9 font-mono text-[13px]")}
                />
              </div>
            </Field>

            <Field label="Live demo" htmlFor="field-demoUrl" error={errors.demoUrl} optional>
              <div className="relative">
                <FiExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
                <input
                  {...fieldProps("demoUrl")}
                  type="url"
                  inputMode="url"
                  placeholder="https://…"
                  value={demoUrl}
                  onChange={(e) => {
                    setDemoUrl(e.target.value);
                    if (errors.demoUrl) setErrors((x) => ({ ...x, demoUrl: undefined }));
                  }}
                  className={input(!!errors.demoUrl, "pl-9 font-mono text-[13px]")}
                />
              </div>
            </Field>
          </Section>

          <Section title="Tech stack" description="Teknologi utama. Dipakai juga untuk filter di halaman Projects.">
            <Field
              label="Teknologi"
              htmlFor="field-tech"
              hint={
                <>
                  <Kbd>Enter</Kbd> atau koma untuk menambah, <Kbd>⌫</Kbd> untuk menghapus yang terakhir.
                </>
              }
            >
              <div className="flex flex-wrap items-center gap-1 min-h-9 px-1.5 py-1.5 rounded-md border border-line bg-surface hover:border-line-strong focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/15 transition-[border-color,box-shadow]">
                {techStack.map((t) => (
                  <TechBadge key={t} name={t} className="h-6 pr-0.5 text-foreground">
                    <button
                      type="button"
                      onClick={() => setTechStack((prev) => prev.filter((x) => x !== t))}
                      className="w-4 h-4 rounded-sm flex items-center justify-center text-subtle hover:text-foreground hover:bg-line"
                      aria-label={`Hapus ${t}`}
                    >
                      <FiX className="text-[10px]" />
                    </button>
                  </TechBadge>
                ))}
                <input
                  id="field-tech"
                  type="text"
                  list="tech-suggestions"
                  autoComplete="off"
                  value={techInput}
                  placeholder={techStack.length ? "" : "React, Tailwind CSS, Node.js"}
                  onChange={(e) => {
                    const v = e.target.value;
                    const native = e.nativeEvent as InputEvent;
                    const picked =
                      (!native.inputType || native.inputType === "insertReplacementText") &&
                      suggestions.some((s) => s === v);
                    if (v.includes(",") || picked) addTech(v);
                    else setTechInput(v);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
                      e.preventDefault();
                      addTech(techInput);
                    } else if (e.key === "Backspace" && !techInput && techStack.length) {
                      setTechStack((prev) => prev.slice(0, -1));
                    }
                  }}
                  onBlur={() => addTech(techInput)}
                  className="flex-1 min-w-[140px] h-6 px-1.5 bg-transparent outline-none text-sm placeholder:text-subtle"
                />
                <datalist id="tech-suggestions">
                  {suggestions.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
            </Field>
          </Section>
        </div>
      </div>

      {/* Aside */}
      <aside className="space-y-4 lg:sticky lg:top-20 lg:row-span-2">
        <section className={panel}>
          <header className="flex items-center justify-between h-11 px-4 border-b border-line">
            <h2 className="text-sm font-medium">Gambar</h2>
            <span className="font-mono text-[11px] text-subtle">16:9 · maks 5 MB</span>
          </header>
          <div className="p-4">
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
              <>
                <div className="rounded-md overflow-hidden border border-line aspect-[16/9] bg-surface-muted">
                  <ProjectImage src={preview} alt="Pratinjau gambar project" className="w-full h-full" />
                </div>
                {image && <p className="font-mono text-[11px] text-subtle mt-2 truncate">{image.name}</p>}
                <div className="flex gap-2 mt-3">
                  <button type="button" onClick={() => fileRef.current?.click()} className={button("secondary", "sm", "flex-1")}>
                    <FiImage /> Ganti
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImageUrl(null);
                    }}
                    className={button("secondary", "sm", "hover:!text-danger")}
                    aria-label="Hapus gambar"
                    title="Hapus gambar"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </>
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
                className={`w-full aspect-[16/9] rounded-md border border-dashed flex flex-col items-center justify-center gap-1.5 text-center p-4 transition-colors ${
                  dragging
                    ? "border-accent bg-accent-soft text-foreground"
                    : errors.image
                      ? "border-danger/60 bg-danger-soft"
                      : "border-line-strong text-muted hover:border-subtle hover:text-foreground"
                }`}
              >
                <FiUploadCloud className="text-lg" />
                <span className="text-[13px] font-medium">{dragging ? "Lepas untuk upload" : "Pilih atau seret gambar"}</span>
                <span className="text-[11px] text-subtle">PNG, JPG, WEBP, GIF, SVG</span>
              </button>
            )}
            {errors.image && <p className="text-xs text-danger mt-2">{errors.image}</p>}
          </div>
        </section>

        {/* Card preview mirrors ProjectCard */}
        <section className="hidden lg:block">
          <p className="text-xs text-subtle mb-2">Pratinjau kartu</p>
          <div className={`${panel} overflow-hidden`}>
            <ProjectImage src={preview} alt="" className="w-full aspect-[16/9] border-b border-line text-xl" />
            <div className="p-3">
              <p className={`text-sm font-medium line-clamp-1 ${title ? "" : "text-subtle"}`}>{title || "Judul project"}</p>
              <p className="text-xs text-muted mt-1 line-clamp-2">{description || "Deskripsi singkat project."}</p>
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {techStack.slice(0, 4).map((t) => (
                    <TechBadge key={t} name={t} />
                  ))}
                  {techStack.length > 4 && (
                    <span className="font-mono text-[11px] text-subtle self-center">+{techStack.length - 4}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Actions: sticky bar on mobile, inline on desktop */}
        <div className="fixed lg:static inset-x-0 bottom-0 z-20 border-t lg:border-0 border-line bg-background/95 lg:bg-transparent backdrop-blur lg:backdrop-blur-none px-4 py-3 lg:p-0">
          <div className="flex items-center gap-2">
            <button type="button" onClick={cancel} className={button("secondary", "md", "flex-1 lg:flex-none")}>
              Batal
            </button>
            <button type="submit" disabled={submitting || !canSubmit} className={button("primary", "md", "flex-1")}>
              {submitting && <Spinner className="w-3.5 h-3.5" />}
              {submitting ? "Menyimpan…" : formType === "create" ? "Buat project" : "Simpan"}
              {!submitting && canSubmit && (
                <span className="hidden lg:inline font-mono text-[11px] opacity-50">{isMac ? "⌘" : "Ctrl"}↵</span>
              )}
            </button>
          </div>
          {formType === "edit" && (
            <p className="hidden lg:flex items-center gap-1.5 text-xs text-subtle mt-2.5" aria-live="polite">
              <span className={`w-1.5 h-1.5 rounded-full ${dirty ? "bg-accent" : "bg-line-strong"}`} />
              {dirty ? "Ada perubahan yang belum disimpan" : "Tidak ada perubahan"}
            </p>
          )}
        </div>
      </aside>

      {footer && <div className="min-w-0 lg:col-start-1">{footer}</div>}

      <ConfirmDialog
        open={confirmLeave}
        tone="default"
        title="Buang perubahan?"
        description="Perubahan yang belum disimpan akan hilang."
        confirmLabel="Buang"
        onConfirm={() => router.push("/project")}
        onClose={() => setConfirmLeave(false)}
      />
    </form>
  );
}

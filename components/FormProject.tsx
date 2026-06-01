import Link from "next/link";
import React from "react";

const FormProject = ({
  title,
  setTitle,
  description,
  setDescription,
  githubUrl,
  setGithubUrl,
  demoUrl,
  setDemoUrl,
  techStack,
  setTechStack,
  image,
  setImage,
  handleSubmit,
  loading,
  imagePreview,
  formType,
}: {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  githubUrl: string;
  setGithubUrl: (githubUrl: string) => void;
  demoUrl: string;
  setDemoUrl: (demoUrl: string) => void;
  techStack: string;
  setTechStack: (techStack: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  imagePreview: string | null;
  formType: "create" | "edit";
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* LEFT COLUMN */}
      <div className="lg:col-span-8 space-y-8">
        {/* HEADER */}
        <div>
          <h1
            className="
          text-[32px]
          leading-[1.2]
          tracking-[-0.01em]
          font-semibold
          text-[#000000]
          mb-2
        "
          >
            {formType === "create" ? "Create New Project" : "Edit Project"}
          </h1>

          <p
            className="
          text-[16px]
          leading-[1.5]
          text-[#4c4546]
        "
          >
            {formType === "create"
              ? "Fill in the details below to add a new project to your portfolio."
              : "Update the project details and save changes to update your portfolio."}
          </p>
        </div>

        {/* FORM CARD */}
        <div
          className="
        bg-[#f9f9f9]
        border border-[#cfc4c5]
        rounded-xl
        p-6 md:p-8
        space-y-6
        shadow-sm
      "
        >
          {/* TITLE */}
          <div className="space-y-2">
            <label
              className="
            block
            text-[12px]
            tracking-[0.05em]
            font-semibold
            text-[#1a1c1c]
          "
            >
              Project Title
            </label>

            <input
              type="text"
              placeholder="e.g. Acme Corp Redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
            w-full
            bg-[#f9f9f9]
            border border-[#cfc4c5]
            rounded-md
            px-4 py-2
            text-[16px]
            text-[#1a1c1c]
            placeholder:text-[#4c4546]/50
            focus:border-black
            focus:outline-none
            transition-colors
          "
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label
              className="
            block
            text-[12px]
            tracking-[0.05em]
            font-semibold
            text-[#1a1c1c]
          "
            >
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Briefly describe the project, goals, and outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="
            w-full
            bg-[#f9f9f9]
            border border-[#cfc4c5]
            rounded-md
            px-4 py-2
            text-[16px]
            text-[#1a1c1c]
            placeholder:text-[#4c4546]/50
            focus:border-black
            focus:outline-none
            transition-colors
            resize-y
          "
              required
            />
          </div>

          {/* URL GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GITHUB */}
            <div className="space-y-2">
              <label
                className="
              block
              text-[12px]
              tracking-[0.05em]
              font-semibold
              text-[#1a1c1c]
            "
              >
                GitHub URL
              </label>

              <div className="relative">
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="
                w-full
                bg-[#f9f9f9]
                border border-[#cfc4c5]
                rounded-md
                px-4 py-2
                text-[16px]
                text-[#1a1c1c]
                placeholder:text-[#4c4546]/50
                focus:border-black
                focus:outline-none
                transition-colors
              "
                />
              </div>
            </div>

            {/* DEMO */}
            <div className="space-y-2">
              <label
                className="
              block
              text-[12px]
              tracking-[0.05em]
              font-semibold
              text-[#1a1c1c]
            "
              >
                Live Demo URL
              </label>

              <div className="relative">
                <input
                  type="url"
                  placeholder="https://..."
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="
                w-full
                bg-[#f9f9f9]
                border border-[#cfc4c5]
                rounded-md
                px-4 py-2
                text-[16px]
                text-[#1a1c1c]
                placeholder:text-[#4c4546]/50
                focus:border-black
                focus:outline-none
                transition-colors
              "
                />
              </div>
            </div>
          </div>

          {/* TECH STACK */}
          <div
            className="
          space-y-2
          border-t border-[#cfc4c5]
          pt-6 mt-6
        "
          >
            <label
              className="
            block
            text-[12px]
            tracking-[0.05em]
            font-semibold
            text-[#1a1c1c]
          "
            >
              Tech Stack
            </label>

            <input
              type="text"
              placeholder="React,Tailwind CSS,Node.js"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="
            w-full
            bg-[#f9f9f9]
            border border-[#cfc4c5]
            rounded-md
            px-4 py-2
            text-[16px]
            text-[#1a1c1c]
            placeholder:text-[#4c4546]/50
            focus:border-black
            focus:outline-none
            transition-colors
          "
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-4 space-y-6">
        {/* MEDIA CARD */}
        <div
          className="
        bg-[#f9f9f9]
        border border-[#cfc4c5]
        rounded-xl
        p-6
        shadow-sm
      "
        >
          <h3
            className="
          text-[24px]
          leading-[1.3]
          font-medium
          text-[#1a1c1c]
          mb-4
        "
          >
            Project Media
          </h3>

          <label
            className="
          border-2 border-dashed
          border-[#cfc4c5]
          rounded-lg
          p-8
          flex flex-col
          items-center
          justify-center
          text-center
          hover:border-black
          transition-colors
          cursor-pointer
          bg-[#f3f3f3]
          group
        "
          >
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e: any) => {
                setImage(e.target.files[0]);
              }}
            />

            <p
              className="
            text-[16px]
            font-medium
            text-[#1a1c1c]
          "
            >
              Click to upload image
            </p>

            <p
              className="
            text-[14px]
            text-[#4c4546]
            mt-1
          "
            >
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </label>

          {image && (
            <div
              className="
            mt-4
            rounded-lg
            overflow-hidden
            border border-[#cfc4c5]
          "
            >
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="
              w-full
              h-auto
              object-cover
            "
              />
            </div>
          )}

          {!image && imagePreview && (
            <div
              className="
            mt-4
            rounded-lg
            overflow-hidden
            border border-[#cfc4c5]
          "
            >
              <img
                src={imagePreview}
                alt="preview"
                className="
              w-full
              h-auto
              object-cover
            "
              />
            </div>
          )}
        </div>

        {/* ACTION CARD */}
        <div
          className="
        bg-[#f9f9f9]
        border border-[#cfc4c5]
        rounded-xl
        p-6
        shadow-sm
        space-y-4
      "
        >
          <h3
            className="
          text-[24px]
          leading-[1.3]
          font-medium
          text-[#1a1c1c]
          mb-2
        "
          >
            {formType === "create" ? "Publish Project" : "Save Changes"}
          </h3>

          <p
            className="
          text-[14px]
          leading-[1.5]
          text-[#4c4546]
          mb-6
        "
          >
            {formType === "create"
              ? "Review your details before publishing this project to your live portfolio."
              : "Review your changes before saving."}
          </p>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="
            w-full
            bg-black
            text-white
            py-3
            rounded-md
            text-[12px]
            tracking-[0.05em]
            font-semibold
            hover:bg-black/90
            transition-colors
          "
            >
              {loading
                ? "Saving..."
                : formType === "create"
                ? "Create Project"
                : "Save Changes"}
            </button>

            <Link
              href="/project"
              type="button"
              className="
            w-full
            bg-[#f9f9f9]
            border border-black
            text-black
            py-3
            rounded-md
            text-[12px]
            tracking-[0.05em]
            font-semibold
            hover:bg-[#eeeeee]
            transition-colors
            text-center
          "
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormProject;

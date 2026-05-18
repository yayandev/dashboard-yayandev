"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import Topbar from "@/components/dashboard/Topbar";
import ProjectTable from "@/components/dashboard/ProjectTable";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = Cookies.get("token");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("github_url", githubUrl);
      formData.append("demo_url", demoUrl);
      formData.append("tech_stack", techStack);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("https://api-yayandev.vercel.app/api/portfolio", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed create project");
      }

      alert("Project created successfully");

      setTitle("");
      setDescription("");
      setGithubUrl("");
      setDemoUrl("");
      setTechStack("");
      setImage(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="bg-[#f3f3f3] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-[280px]">
        <Topbar setOpenSidebar={setSidebarOpen} />

        <div className="pt-24 p-4 md:p-6 mt-12">
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
                  Create New Project
                </h1>

                <p
                  className="
          text-[16px]
          leading-[1.5]
          text-[#4c4546]
        "
                >
                  Fill in the details below to add a new project to your
                  portfolio.
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
                  Publishing
                </h3>

                <p
                  className="
          text-[14px]
          leading-[1.5]
          text-[#4c4546]
          mb-6
        "
                >
                  Review your details before publishing this project to your
                  live portfolio.
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
                    {loading ? "Publishing..." : "Publish Project"}
                  </button>

                  <button
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
          "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

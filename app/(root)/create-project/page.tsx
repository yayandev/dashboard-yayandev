"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import Topbar from "@/components/dashboard/Topbar";
import Cookies from "js-cookie";
import FormProject from "@/components/FormProject";
import { Bounce, toast } from "react-toastify";

export default function CreateProject() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [image, setImage] = useState<File | null>(null);

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

      toast.success("Project created successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setTitle("");
      setDescription("");
      setGithubUrl("");
      setDemoUrl("");
      setTechStack("");
      setImage(null);
    } catch (err: any) {
      toast.error(
        err.message || "An error occurred while creating the project.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="bg-[#f3f3f3] text-[#1a1c1c] min-h-screen overflow-x-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar */}
        <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className="lg:ml-[280px]">
          <Topbar setOpenSidebar={setSidebarOpen} />

          <div className="pt-24 p-4 md:p-6 mt-12">
            <FormProject
              demoUrl={demoUrl}
              description={description}
              githubUrl={githubUrl}
              image={image}
              loading={loading}
              setDemoUrl={setDemoUrl}
              setDescription={setDescription}
              setGithubUrl={setGithubUrl}
              setImage={setImage}
              setTechStack={setTechStack}
              setTitle={setTitle}
              techStack={techStack}
              title={title}
              handleSubmit={handleSubmit}
              formType="create"
              imagePreview={null}
            />
          </div>
        </div>
      </main>
    </>
  );
}

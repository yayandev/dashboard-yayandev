"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import Topbar from "@/components/dashboard/Topbar";
import Cookies from "js-cookie";
import FormProject from "@/components/FormProject";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function EditProjectPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const params = useParams();

  const { id } = params;

  useEffect(() => {
    const fetchProject = async () => {
      setLoadingFetch(true);
      try {
        const res = await fetch(
          `https://api-yayandev.vercel.app/api/portfolio/${id}`
        );

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch project");
        }

        const { data, message, status, status_code } = result;

        if (status_code !== 200) {
          throw new Error(message || "Failed to fetch project");
        }

        setTitle(data.title);
        setDescription(data.description);
        setGithubUrl(data.github_url);
        setDemoUrl(data.demo_url);
        setTechStack(data.tech_stack);
        setImagePreview(data.image_url);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setLoadingFetch(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

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
      } else {
        formData.append("image_url", imagePreview || "");
      }

      const res = await fetch(
        `https://api-yayandev.vercel.app/api/portfolio/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to update project");
      }

      const { message, status_code } = result;

      if (status_code !== 200) {
        throw new Error(message || "Failed to update project");
      }

      toast.success("Project updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err: any) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
          {loadingFetch ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800"></div>
            </div>
          ) : (
            <FormProject
              demoUrl={demoUrl}
              description={description}
              githubUrl={githubUrl}
              image={image}
              imagePreview={imagePreview}
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
              formType="edit"
            />
          )}
        </div>
      </div>
    </main>
  );
}

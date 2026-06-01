import Link from "next/link";
import Cookies from "js-cookie";

import { FiEdit, FiTrash } from "react-icons/fi";
import { useState } from "react";

import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ProjectRow({ project, refetch }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `https://api-yayandev.vercel.app/api/portfolio/${project.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          toast.success("Project deleted successfully!", {
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

          refetch();
        } else {
          toast.error("Failed to delete project. Please try again.", {
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
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("An error occurred while deleting the project.", {
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
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <tr className="group hover:bg-[#f3f3f3]/50 transition-colors border-b border-[#e2e2e2]">
      <td className="py-3 px-4">
        <div className="w-12 h-8 rounded border border-[#e2e2e2] overflow-hidden relative">
          <img
            src={project.image_url}
            alt={project.title}
            className="object-cover grayscale hover:grayscale-0 transition w-full h-full"
          />
        </div>
      </td>

      <td className="py-3 px-4">
        <div className="text-sm font-medium">{project.title}</div>

        <div className="text-xs text-[#4c4546] mt-1">
          {project.description.length > 60
            ? project.description.substring(0, 57) + "..."
            : project.description}
        </div>
      </td>

      <td className="py-3 px-4">
        {project.tech_stack.map((tech: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded text-[11px] bg-[#e2e2e2] border border-[#cfc4c5] mr-2"
          >
            {tech}
          </span>
        ))}
      </td>

      <td className="py-3 px-4 text-sm text-[#4c4546]">
        {project.created_at
          ? new Date(project.created_at).toLocaleDateString()
          : "N/A"}
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
          <Link
            href={`/project/${project.id}`}
            className="p-2 hover:bg-[#eeeeee] rounded"
          >
            <FiEdit />
          </Link>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 hover:bg-[#eeeeee] rounded"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-800"></div>
            ) : (
              <FiTrash />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

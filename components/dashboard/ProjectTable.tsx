"use client";

import { useEffect, useState } from "react";

import ProjectRow from "./ProjectRow";

export default function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("https://api-yayandev.vercel.app/api/portfolio");

      if (!res.ok) {
        throw new Error("Failed to fetch portfolio");
      }

      const data = await res.json();

      setProjects(data?.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e2e2] p-10 text-center">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e2e2e2] bg-[#eeeeee]/40">
              <th className="py-3 px-4 text-sm text-[#4c4546]">Preview</th>

              <th className="py-3 px-4 text-sm text-[#4c4546]">Project Name</th>

              <th className="py-3 px-4 text-sm text-[#4c4546]">Description</th>

              <th className="py-3 px-4 text-sm text-[#4c4546]">Date Added</th>

              <th className="py-3 px-4 text-sm text-right text-[#4c4546]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.length > 0 ? (
              projects.map((project: any) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  refetch={fetchProjects}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

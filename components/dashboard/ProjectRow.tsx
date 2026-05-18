import Image from "next/image";

import { FiEdit, FiTrash } from "react-icons/fi";

export default function ProjectRow({ project }: any) {
  return (
    <tr className="group hover:bg-[#f3f3f3]/50 transition-colors border-b border-[#e2e2e2]">
      <td className="py-3 px-4">
        <div className="w-12 h-8 rounded border border-[#e2e2e2] overflow-hidden relative">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover grayscale"
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
          <button className="p-2 hover:bg-[#eeeeee] rounded">
            <FiEdit />
          </button>

          <button className="p-2 hover:bg-[#eeeeee] rounded">
            <FiTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}

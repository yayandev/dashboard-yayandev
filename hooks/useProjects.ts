"use client";

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/api";
import { fetchProjects, type Project } from "@/lib/projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Gagal memuat data project"));
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    return load();
  }, [load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    load();
  }, [load]);

  const removeLocal = useCallback((id: Project["id"]) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { projects, loading, error, refetch, removeLocal };
}

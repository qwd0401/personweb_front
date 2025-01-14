import { useQuery, useMutation } from "@tanstack/react-query";
import { projectApi, blogApi, contactApi, adminApi } from "../api";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectApi.getAll,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectApi.getById(id),
  });
};

// ... 其他 hooks

import { createFileFilesPost } from "@/api";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await createFileFilesPost({
    body: { file },
  });
  return response.data;
};

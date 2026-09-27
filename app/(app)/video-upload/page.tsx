"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Upload as UploadIcon } from "lucide-react";
import PageHeader from "@/components/PageHeader";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  // max file size is 100mb
  const maxFileSize = 100 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      return;
    }
    if (file.size > maxFileSize) {
      alert("File size is too large");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());
    try {
      const response = await axios.post("/api/video-upload", formData);
      if (response.status === 200) {
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
      alert("Video upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <PageHeader
        icon={UploadIcon}
        title="Upload Video"
        subtitle="Share a video and we'll compress and preview it automatically."
      />

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered h-24 w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full"
                required
              />
              <label className="label">
                <span className="label-text-alt">Max size: 100MB</span>
              </label>
            </div>

            {isUploading && (
              <progress className="progress progress-primary w-full" />
            )}

            <button
              type="submit"
              className="btn btn-primary w-full gap-2"
              disabled={isUploading}
            >
              <UploadIcon size={18} />
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;

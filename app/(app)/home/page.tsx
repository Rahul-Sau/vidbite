"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
import PageHeader from "@/components/PageHeader";
import { Film, HardDrive, Search, ArrowUpDown } from "lucide-react";

type SortOption = "newest" | "oldest" | "mostCompressed";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log(error);
      setError("Error fetching videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const visibleVideos = useMemo(() => {
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(search.toLowerCase()),
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === "mostCompressed") {
        const aRatio = Number(a.compressedSize) / Number(a.originalSize);
        const bRatio = Number(b.compressedSize) / Number(b.originalSize);
        return aRatio - bRatio;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [videos, search, sortBy]);

  const totalSavedMB = useMemo(() => {
    const saved = videos.reduce(
      (sum, video) =>
        sum + (Number(video.originalSize) - Number(video.compressedSize)),
      0,
    );
    return (saved / (1024 * 1024)).toFixed(1);
  }, [videos]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="h-9 w-48 bg-base-300 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card bg-base-100 shadow">
              <div className="aspect-video bg-base-300 animate-pulse rounded-t-2xl" />
              <div className="card-body p-4 space-y-2">
                <div className="h-4 w-3/4 bg-base-300 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-base-300 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        icon={Film}
        title="Your Videos"
        subtitle="Every upload, compressed and ready to share."
      />

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {videos.length > 0 && (
        <div className="stats shadow w-full mb-8 bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Film size={28} />
            </div>
            <div className="stat-title">Videos uploaded</div>
            <div className="stat-value">{videos.length}</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <HardDrive size={28} />
            </div>
            <div className="stat-title">Storage saved</div>
            <div className="stat-value text-secondary">{totalSavedMB} MB</div>
            <div className="stat-desc">thanks to compression</div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-xs">
          <Search size={18} className="opacity-50" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-xs">
          <ArrowUpDown size={18} className="opacity-50" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="grow bg-transparent"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="mostCompressed">Best compression</option>
          </select>
        </label>
      </div>

      {visibleVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Film size={48} className="text-base-content/30 mb-4" />
          <p className="text-lg text-base-content/60">
            {videos.length === 0
              ? "No videos yet — upload your first one to get started."
              : "No videos match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

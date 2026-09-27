import React, { useState, useEffect, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/types";
import { getHighlightConfig } from "@/lib/highlight";
import Image from "next/image";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
  onDelete: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onDownload,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      quality: "auto",
      format: "jpg",
      assetType: "video",
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const getPreviewVideoUrl = useCallback(
    (publicId: string) => {
      const { duration, startOffset } = getHighlightConfig(
        video.title,
        video.description,
      );
      return getCldVideoUrl({
        src: publicId,
        width: 400,
        height: 225,
        rawTransformations: [
          `e_preview:duration_${duration}:max_seg_9:min_seg_dur_1`,
          ...(startOffset ? [`so_${startOffset}`] : []),
        ],
      });
    },
    [video.title, video.description],
  );

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.round(seconds % 60);
    return `${minutes}:${secondsLeft.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100,
  );

  useEffect(() => {
    setPreviewError(false);
    setPreviewLoaded(false);
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <div
      className="card bg-base-100 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="aspect-video relative bg-base-200 overflow-hidden">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-base-200">
              <p className="text-sm text-error">Preview not available</p>
            </div>
          ) : (
            <>
              {!previewLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%]" />
              )}
              <video
                src={getPreviewVideoUrl(video.publicId)}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                onError={handlePreviewError}
                onCanPlay={() => setPreviewLoaded(true)}
              />
            </>
          )
        ) : (
          <Image
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 badge badge-neutral gap-1">
          <Clock size={14} />
          {formatDuration(Number(video.duration))}
        </div>
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg">{video.title}</h2>
        {video.description && (
          <p className="text-sm text-base-content/60 line-clamp-2">
            {video.description}
          </p>
        )}
        <p className="text-xs text-base-content/50">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          <div className="badge badge-outline gap-1">
            <FileUp size={14} />
            {formatSize(Number(video.originalSize))}
          </div>
          <div className="badge badge-outline gap-1">
            <FileDown size={14} />
            {formatSize(Number(video.compressedSize))}
          </div>
          <div className="badge badge-success badge-outline">
            -{compressionPercentage}%
          </div>
        </div>

        <div className="card-actions justify-end mt-4 gap-2">
          <button
            className="btn btn-ghost btn-sm text-error gap-2"
            onClick={() => onDelete(video.id)}
          >
            <Trash2 size={16} />
          </button>
          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={() =>
              onDownload(getFullVideoUrl(video.publicId), video.title)
            }
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

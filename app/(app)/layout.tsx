import Link from "next/link";
import { UserButton, Show } from "@clerk/nextjs";
import { Film, Image as ImageIcon, Upload } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1">
          <Link href="/home" className="text-xl font-bold text-primary">
            ClipSnap
          </Link>
        </div>
        <div className="flex-none gap-2">
          <Link href="/home" className="btn btn-ghost btn-sm gap-2">
            <Film size={18} />
            Videos
          </Link>
          <Link href="/video-upload" className="btn btn-ghost btn-sm gap-2">
            <Upload size={18} />
            Upload
          </Link>
          <Link href="/social-share" className="btn btn-ghost btn-sm gap-2">
            <ImageIcon size={18} />
            Social Share
          </Link>

          <Show when="signed-in">
            <UserButton />
          </Show>

          <Show when="signed-out">
            <Link href="/sign-in" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          </Show>
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}

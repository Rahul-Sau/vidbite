import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function createRouteMatcher(routes: string[]) {
  return (req: Request) => routes.includes(new URL(req.url).pathname);
}

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home",
]);

const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isAccessingDashboard = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  if (userId && isPublicRoute(req) && !isAccessingDashboard) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!userId) {
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isApiRequest && !isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

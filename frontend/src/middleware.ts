import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES } from "./constants/public-routes";
import { getSessionAction } from "./servers/auth";

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    const regexPattern = route.replace("(.*)", ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
}

export async function middleware(request: NextRequest) {
  const session = await getSessionAction();
  const { pathname } = request.nextUrl;

  if (session && pathname === "/enter") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!session) {
    const url = new URL("/enter", request.url);
    url.searchParams.set("callback_url", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

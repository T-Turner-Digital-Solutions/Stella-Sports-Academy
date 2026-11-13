import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAcceptInvitePage = pathname === "/admin/accept-invite";
  const isLoginApi = pathname === "/api/admin/login";
  const isAcceptInviteApi = pathname === "/api/admin/accept-invite";
  const isApiRoute = pathname.startsWith("/api/admin/");

  if (isLoginApi || isAcceptInviteApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (isLoginPage || isAcceptInvitePage) {
    if (session && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    if (isApiRoute) {
      return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

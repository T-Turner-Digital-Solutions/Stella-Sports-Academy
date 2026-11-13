import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isBoardArea = pathname.startsWith("/board");
  const isLoginPage = pathname === "/admin/login" || pathname === "/board/login";
  const isAcceptInvitePage = pathname === "/admin/accept-invite";
  const isLoginApi = pathname === "/api/admin/login";
  const isAcceptInviteApi = pathname === "/api/admin/accept-invite";
  // Has its own auth check (owner session OR a DB_SETUP_SECRET header) — it
  // needs to run even when nobody has a valid session yet, e.g. right after
  // DATABASE_URL is first connected or rotated.
  const isDbSetupApi = pathname === "/api/admin/db-setup";
  const isApiRoute = pathname.startsWith("/api/admin/");
  const defaultArea = isBoardArea ? "/board" : "/admin";

  if (isLoginApi || isAcceptInviteApi || isDbSetupApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (isLoginPage || isAcceptInvitePage) {
    if (session && isLoginPage) {
      return NextResponse.redirect(new URL(defaultArea, request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    if (isApiRoute) {
      return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }
    const loginUrl = new URL(isBoardArea ? "/board/login" : "/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/board/:path*", "/api/admin/:path*"],
};

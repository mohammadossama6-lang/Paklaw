import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const PROTECTED_PREFIX = "/portal";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith(PROTECTED_PREFIX)) return NextResponse.next();

  const session = await decrypt(req.cookies.get("session")?.value);
  if (!session) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};

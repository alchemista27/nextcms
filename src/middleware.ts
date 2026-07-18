import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Example of route protection based on roles
    if (path.startsWith("/admin/users") && token?.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    
    // Add more granular checks here if needed for EDITOR, AUTHOR, etc.
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};

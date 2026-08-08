import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // refresh the session
  const response = await updateSession(request);

  // You can add more logic here, but because we need to check roles from Prisma,
  // we do the granular role checks in the Server Components or API routes directly,
  // or use Supabase SSR here to check user existence.
  
  // For basic protection: if they access /admin and are not logged in, Supabase
  // updateSession doesn't automatically redirect. We can add a basic redirect here.
  const { data: { user } } = await (await import('./lib/supabase/server')).createClient().auth.getUser();

  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

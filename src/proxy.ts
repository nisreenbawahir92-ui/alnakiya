import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const DEMO_COOKIE = "al_nakiya_demo_admin";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Always strip legacy demo-admin cookie if present.
  const clearDemo = (response: NextResponse) => {
    if (request.cookies.has(DEMO_COOKIE)) {
      response.cookies.set(DEMO_COOKIE, "", {
        path: "/",
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      });
    }
    return response;
  };

  if (!url || !key) {
    if (isDashboard) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("error", "config");
      return clearDemo(NextResponse.redirect(loginUrl));
    }
    return clearDemo(NextResponse.next({ request }));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = user?.app_metadata?.role === "admin";

  if (isDashboard && !isAdmin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return clearDemo(NextResponse.redirect(loginUrl));
  }

  if (isLogin && isAdmin) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return clearDemo(NextResponse.redirect(dashboardUrl));
  }

  return clearDemo(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/catalog|catalog/.*\\.pptx|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|pptx)$).*)",
  ],
};

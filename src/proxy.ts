import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isBlockedBot } from "@/lib/bot-filter";

const DEMO_COOKIE = "al_nakiya_demo_admin";

function clearDemo(request: NextRequest, response: NextResponse) {
  if (request.cookies.has(DEMO_COOKIE)) {
    response.cookies.set(DEMO_COOKIE, "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
    });
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isBlockedBot(request.headers.get("user-agent"))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (isDashboard) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("error", "config");
      return clearDemo(request, NextResponse.redirect(loginUrl));
    }
    return clearDemo(request, NextResponse.next({ request }));
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
    return clearDemo(request, NextResponse.redirect(loginUrl));
  }

  if (isLogin && isAdmin) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return clearDemo(request, NextResponse.redirect(dashboardUrl));
  }

  return clearDemo(request, response);
}

/** Auth only — public catalog must not invoke Edge Middleware (Vercel quota). */
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

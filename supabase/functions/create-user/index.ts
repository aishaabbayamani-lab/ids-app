import { createClient } from "jsr:@supabase/supabase-js@2";

const ALLOWED_ROLES = ["analyst", "viewer"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const headers = { "Content-Type": "application/json", ...corsHeaders };

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: callerData, error: callerError } =
      await callerClient.auth.getUser();
    if (callerError || !callerData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers,
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: callerProfile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", callerData.user.id)
      .single();

    if (profileError || callerProfile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers,
      });
    }

    const { full_name, email, password, role } = await req.json();

    if (
      !full_name ||
      !email ||
      !password ||
      !ALLOWED_ROLES.includes(role)
    ) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers,
      });
    }

    const { data: createdUser, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name },
      });

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers,
      });
    }

    const { error: roleUpdateError } = await adminClient
      .from("profiles")
      .update({ role })
      .eq("id", createdUser.user.id);

    if (roleUpdateError) {
      return new Response(JSON.stringify({ error: roleUpdateError.message }), {
        status: 400,
        headers,
      });
    }

    return new Response(
      JSON.stringify({
        user: { id: createdUser.user.id, email: createdUser.user.email },
      }),
      { status: 200, headers },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unexpected error" }),
      { status: 500, headers },
    );
  }
});

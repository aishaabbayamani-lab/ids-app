import { createClient } from "jsr:@supabase/supabase-js@2";

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

    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("id, full_name, role, created_at");

    if (profilesError) {
      return new Response(JSON.stringify({ error: profilesError.message }), {
        status: 400,
        headers,
      });
    }

    const { data: authUsers, error: authError } =
      await adminClient.auth.admin.listUsers();

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers,
      });
    }

    const emailById = new Map(authUsers.users.map((u) => [u.id, u.email]));

    const users = profiles.map((profile) => ({
      id: profile.id,
      full_name: profile.full_name,
      role: profile.role,
      created_at: profile.created_at,
      email: emailById.get(profile.id) ?? null,
    }));

    return new Response(JSON.stringify({ users }), { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unexpected error" }),
      { status: 500, headers },
    );
  }
});

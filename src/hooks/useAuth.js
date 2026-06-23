import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export function useAuth() {
  const { user, profile, loading, setUser, setProfile, setLoading, clearAuth } =
    useAuthStore();

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        const userProfile = await getProfile(sessionUser.id);
        setProfile(userProfile);
      }
      setLoading(false);
    }

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          const userProfile = await getProfile(sessionUser.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearAuth();
  }

  async function adminListUsers() {
    const { data, error } = await supabase.functions.invoke("list-users");
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data.users;
  }

  async function adminCreateUser(values) {
    const { data, error } = await supabase.functions.invoke("create-user", {
      body: values,
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data.user;
  }

  async function adminUpdateUserRole(userId, role) {
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);
    if (error) throw error;
  }

  return {
    user,
    profile,
    loading,
    login,
    logout,
    getProfile,
    adminListUsers,
    adminUpdateUserRole,
    adminCreateUser,
  };
}

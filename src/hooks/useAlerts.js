import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("alerts")
      .select(
        "*, created_by_profile:profiles!alerts_created_by_fkey(full_name)",
      )
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setAlerts(data);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    const channel = supabase
      .channel("alerts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        () => {
          fetchAlerts();
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchAlerts]);

  async function createAlert(values) {
    const { data: userData } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from("alerts").insert({
      ...values,
      created_by: userData.user.id,
    });
    if (insertError) throw insertError;
    await fetchAlerts();
  }

  async function updateAlertStatus(id, status) {
    const updates = { status, updated_at: new Date().toISOString() };
    if (status === "resolved") {
      const { data: userData } = await supabase.auth.getUser();
      updates.resolved_by = userData.user.id;
      updates.resolved_at = new Date().toISOString();
    }
    const { error: updateError } = await supabase
      .from("alerts")
      .update(updates)
      .eq("id", id);
    if (updateError) throw updateError;
    await fetchAlerts();
  }

  async function deleteAlert(id) {
    const { error: deleteError } = await supabase
      .from("alerts")
      .delete()
      .eq("id", id);
    if (deleteError) throw deleteError;
    await fetchAlerts();
  }

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    createAlert,
    updateAlertStatus,
    deleteAlert,
  };
}

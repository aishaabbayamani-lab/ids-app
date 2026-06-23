import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useConfigs() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("ids_configs")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setConfigs(data);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  async function createConfig(values) {
    const { data: userData } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from("ids_configs").insert({
      ...values,
      created_by: userData.user.id,
    });
    if (insertError) throw insertError;
    await fetchConfigs();
  }

  return { configs, loading, error, fetchConfigs, createConfig };
}

export function useMetrics(configId) {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    if (!configId) {
      setMetrics([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("evaluation_metrics")
      .select("*, recorded_by_profile:profiles(full_name)")
      .eq("ids_config_id", configId)
      .order("recorded_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setMetrics(data);
      setError(null);
    }
    setLoading(false);
  }, [configId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  async function createMetric(values) {
    const { data: userData } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from("evaluation_metrics").insert({
      ...values,
      ids_config_id: configId,
      recorded_by: userData.user.id,
    });
    if (insertError) throw insertError;
    await fetchMetrics();
  }

  return { metrics, loading, error, fetchMetrics, createMetric };
}

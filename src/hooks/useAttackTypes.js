import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAttackTypes() {
  const [attackTypes, setAttackTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttackTypes = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("attack_types")
      .select("*")
      .order("name", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setAttackTypes(data);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAttackTypes();
  }, [fetchAttackTypes]);

  async function createAttackType(values) {
    const { error: insertError } = await supabase
      .from("attack_types")
      .insert(values);
    if (insertError) throw insertError;
    await fetchAttackTypes();
  }

  return { attackTypes, loading, error, fetchAttackTypes, createAttackType };
}

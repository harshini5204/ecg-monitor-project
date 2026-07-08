import { useEffect, useState } from "react";
import { getPatients } from "../api/patient.api";
import type { Patient } from "../types/patient";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await getPatients();

        setPatients(response.data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    patients,
    loading,
  };
}

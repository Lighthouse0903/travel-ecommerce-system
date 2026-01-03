"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { AgencyProfile } from "@/types/agency";
import { useAgencyService } from "@/services/agencyService";

const DRAFT_KEY = "agency_register_draft_v1";
type AgencyProfileState = {
  loading: boolean;
  profile: AgencyProfile | null;
  refresh: () => Promise<void>;
};

const AgencyProfileContext = createContext<AgencyProfileState | null>(null);

export const useAgencyProfile = () => {
  const ctx = useContext(AgencyProfileContext);
  if (!ctx)
    throw new Error(
      "useAgencyProfile must be used within <AgencyProfileProvider>"
    );
  return ctx;
};

export const AgencyProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getAgencyProfile } = useAgencyService();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AgencyProfile | null>(null);

  const refresh = async () => {
    setLoading(true);
    const res = await getAgencyProfile();

    if (res.success) {
      setProfile(res.data);
      // Nếu status == approved mới cho phép xóa draft
      if (res.data.status === "approved") {
        localStorage.removeItem(DRAFT_KEY);
      }
    } else {
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      await refresh();
      if (!mounted) return;
    };

    run();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ loading, profile, refresh }),
    [loading, profile]
  );
  return (
    <AgencyProfileContext.Provider value={value}>
      {children}
    </AgencyProfileContext.Provider>
  );
};

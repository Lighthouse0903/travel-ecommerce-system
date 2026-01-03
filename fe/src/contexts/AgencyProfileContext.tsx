"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { AgencyProfile } from "@/types/agency";
import { useAgencyService } from "@/services/agencyService";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, access, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AgencyProfile | null>(null);

  const refresh = useCallback(async () => {
    // Nếu chưa auth xong hoặc chưa login -> không gọi
    if (authLoading || !access || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await getAgencyProfile();

    if (res.success) {
      setProfile(res.data);
      if (res.data.status === "approved") {
        localStorage.removeItem(DRAFT_KEY);
      }
    } else {
      // không có hồ sơ đại lý / 401 / 404 -> coi như chưa đăng ký
      setProfile(null);
    }

    setLoading(false);
  }, [authLoading, access, user]);

  useEffect(() => {
    setLoading(true);
    setProfile(null);
    refresh();
  }, [refresh, user?.user_id, access]);

  const value = useMemo(
    () => ({ loading, profile, refresh }),
    [loading, profile, refresh]
  );

  return (
    <AgencyProfileContext.Provider value={value}>
      {children}
    </AgencyProfileContext.Provider>
  );
};

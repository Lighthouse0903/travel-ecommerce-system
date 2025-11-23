"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import RegisterAgencyForm from "@/components/auth/customer/RegisterAgencyForm";

const RegisterAgencyPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const isAgency = user?.roles?.includes(2);

  useEffect(() => {
    if (isAgency) {
      router.replace("/agency/dashboard");
    }
  }, [isAgency, router]);

  if (isAgency) {
    return null;
  }

  return <RegisterAgencyForm />;
};

export default RegisterAgencyPage;

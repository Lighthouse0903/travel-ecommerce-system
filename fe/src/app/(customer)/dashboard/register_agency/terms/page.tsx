"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TermsHero from "@/components/customer/register_agency/terms/TermsHero";
import PolicySummary from "@/components/customer/register_agency/terms/PolicySummary";
import DetailPolicy from "@/components/customer/register_agency/terms/DetailPolicy";
import CheckList from "@/components/customer/register_agency/terms/CheckList";
import ConsentGate from "@/components/customer/register_agency/terms/ConsentGate";
import { useAgencyAction } from "@/hooks/useAgencyAction";

const Terms = () => {
  const [checking, setChecking] = useState(true);
  const { guardRegisterAgencyTermsPage } = useAgencyAction();
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const res = await guardRegisterAgencyTermsPage();
      if (!mounted) return;

      if (res.allow) {
        setChecking(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Đang kiểm tra điều kiện đăng ký đại lý...
      </div>
    );
  }
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="w-full overflow-hidden">
      <motion.div {...fadeUp}>
        <div className="p-4 space-y-6">
          <Breadcrumb>
            <BreadcrumbList className="text-base md:text-lg">
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/register_agency">
                  Đăng kí đại lý
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Điều khoản & Chính sách</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="">
            <TermsHero />
            <PolicySummary />
            <DetailPolicy />
            <CheckList />
            <ConsentGate />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;

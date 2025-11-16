"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Heart,
  ShoppingBag,
  CreditCard,
  Edit,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

const ProfileLayout = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="mt-10 flex flex-col md:flex-row gap-6 px-4">
      {/* Side bar  */}
      <div className="bg-red-400 w-[30%]">side bar</div>
      <div className="bg-red-400 w-[70%]">Main</div>
    </div>
  );
};

export default ProfileLayout;

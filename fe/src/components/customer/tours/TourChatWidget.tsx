"use client";

import React from "react";
import { motion } from "framer-motion";

interface TourChatWidgetProps {
  agencyUserId: string | null;
  agencyName: string | null;
}

const TourChatWidget: React.FC<TourChatWidgetProps> = ({
  agencyUserId,
  agencyName,
}) => {
  if (!agencyName) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Bubble nhảy lên xuống */}
      <motion.button
        className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      >
        Chat
      </motion.button>
    </div>
  );
};

export default TourChatWidget;

"use client";

import { Button } from "@/components/button/button";
import { useRouter } from "next/navigation";

interface SettingsButtonProps {
  className?: string;
}

export const SettingsButton = ({ className }: SettingsButtonProps) => {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push("/store/settings");
  };

  return (
    <Button variant="link" className={className} onClick={handleSettingsClick}>
      Configurações
    </Button>
  );
};

import { Button } from "@/components/button/button";

interface SupportButtonProps {
  className?: string;
}

export const SupportButton = ({ className }: SupportButtonProps) => {
  const handleSupportClick = () => {
    const phoneNumber = "5541987658901"; // +55 41 98765-8901 sem formatação
    const message = encodeURIComponent("Olá, preciso de suporte com o eloop!");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button variant="link" className={className} onClick={handleSupportClick}>
      Suporte
    </Button>
  );
};

import { useEffect, useRef } from "react";
import { Header } from "@/views/header";
import { Button } from "@/components/button/button";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import { useMyBusiness } from "@/hooks/useMyBusiness";
import { useBusinessSubscription } from "@/hooks/useBusinessSubscription";
import { useQueryClient } from "@tanstack/react-query";

export const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId: string | null = searchParams.get("session_id");
  const { business } = useMyBusiness();
  const { refetch: refetchSubscription } = useBusinessSubscription(business?.id);
  const queryClient = useQueryClient();
  const processedRef = useRef<string | null>(null);

  // Process session_id to update subscription
  useEffect(() => {
    if (!sessionId || !business?.id || processedRef.current === sessionId) return;
    processedRef.current = sessionId;

    const processSession = async () => {
      try {
        const { data: sessionData, error: statusError } = await api.stripeSessionStatus(sessionId);
        if (statusError || !sessionData) return;

        await api.updateBusinessSubscription({
          business_id: business!.id as string,
          stripe_customer_id: sessionData.customer,
          stripe_subscription_id: sessionData.subscription,
          stripe_session_id: sessionId,
          payment_status: sessionData.payment_status,
          subscription_status: null,
          status: sessionData.status,
        });

        queryClient.invalidateQueries({ queryKey: ["business-subscription", business.id] });
        refetchSubscription();
      } catch (err) {
        console.error("Erro ao processar sessão:", err);
      }
    };

    processSession();
  }, [sessionId, business?.id, queryClient, refetchSubscription]);

  const today: Date = new Date();
  const nextBilling: Date = new Date(today);
  nextBilling.setMonth(nextBilling.getMonth() + 1);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 bg-white items-center justify-center">
        <div className="w-full px-8 py-8 sm:px-10 sm:py-8 max-w-lg mx-auto flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full border-4 border-primary-600 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-primary-600" strokeWidth={3} />
          </div>

          <h1 className="text-xl font-bold text-primary-600 mb-2">
            Assinatura confirmada
          </h1>
          <p className="text-sm text-neutral-600 mb-8">
            Agora você já pode enviar selos ilimitados.
          </p>

          <div className="w-full bg-gray-50 rounded-xl p-5 mb-8">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Resumo da assinatura
            </h3>
            <div className="flex justify-between text-sm text-neutral-600 mb-2">
              <span>Plano</span>
              <span className="font-medium text-neutral-800">R$ 27,90/mês</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Próxima cobrança</span>
              <span className="font-medium text-neutral-800">{formatDate(nextBilling)}</span>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => router.push("/store")}
            className="w-full"
          >
            Acessar página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

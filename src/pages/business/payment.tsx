import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Header } from "@/pages/landing/header";
import { TabNavigation } from "@/components/business/tab-navigation";
import { useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useMyBusiness } from "@/hooks/useMyBusiness";
import { useBusinessSubscription } from "@/hooks/useBusinessSubscription";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/button/button";

// Validar e inicializar Stripe
const getStripePromise = () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.error("VITE_STRIPE_PUBLISHABLE_KEY não está configurada nas variáveis de ambiente");
    return Promise.resolve(null);
  }
  
  return loadStripe(publishableKey);
};

const stripePromise = getStripePromise();

const DEFAULT_PRICE_ID = "price_1SWf6iDypeQ6bJI1ejk6ekQR";

export const Payment = () => {
  const { business } = useMyBusiness();
  const { subscription, isLoading: isLoadingSubscription, refetch: refetchSubscription } = useBusinessSubscription(business?.id);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const isStripeConfigured = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const sessionId = searchParams.get("session_id");
  const processedSessionIdRef = useRef<string | null>(null);

  // Quando voltar do Stripe com session_id, atualizar os dados
  useEffect(() => {
    // Evitar processar o mesmo session_id múltiplas vezes
    if (!sessionId || processedSessionIdRef.current === sessionId) {
      return;
    }

    processedSessionIdRef.current = sessionId;
    
    const processReturn = async () => {
      try {
        console.log("Processando retorno do Stripe com session_id:", sessionId);
        
        // Buscar status da sessão
        const { data: sessionData, error: statusError } = await api.stripeSessionStatus(sessionId);
        
        if (statusError || !sessionData) {
          console.error("Erro ao buscar status da sessão:", statusError);
          return;
        }

        console.log("Dados da sessão:", sessionData);

        // UPDATE: Atualizar registro usando o session_id
        // O updateBusinessSubscription vai buscar pelo session_id e atualizar
        // O business_id será mantido do registro existente
        const { error: saveError } = await api.updateBusinessSubscription({
          business_id: "", // Não precisa, será mantido do registro existente
          stripe_customer_id: sessionData.customer,
          stripe_subscription_id: sessionData.subscription,
          stripe_session_id: sessionId,
          payment_status: sessionData.payment_status,
          subscription_status: null,
          status: sessionData.status,
        });

        if (saveError) {
          console.error("Erro ao atualizar subscription:", saveError);
        } else {
          console.log("Subscription atualizada com sucesso!");
          // Invalidar cache e refetch para atualizar o estado
          queryClient.invalidateQueries({ queryKey: ['business-subscription', business?.id] });
          // Usar setTimeout para evitar loop, já que refetch pode causar re-render
          setTimeout(() => {
            refetchSubscription();
          }, 100);
        }
      } catch (err) {
        console.error("Erro ao processar retorno:", err);
      }
    };

    processReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const fetchClientSecret = useCallback(async () => {
    try {
      setError(null);
      console.log("Criando sessão de checkout...");

      const priceId = DEFAULT_PRICE_ID;

      if (!priceId) {
        throw new Error("Price ID não configurado.");
      }

      if (!business?.id) {
        throw new Error("Business não disponível.");
      }

      // Verificar se já existe subscription ativa antes de criar nova
      // O hook já faz cache, então podemos usar diretamente
      if (subscription && subscription.status === "complete") {
        const errorMsg = "Já existe uma assinatura ativa para este estabelecimento.";
        console.error(errorMsg);
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      const { data, error: apiError } = await api.stripeRequest(priceId);

      if (apiError || !data?.clientSecret) {
        throw apiError || new Error("Erro ao criar sessão de pagamento");
      }

      // CREATE: Salvar business_id e session_id quando a sessão for criada
      // Sempre cria novo registro
      if (data.sessionId && business.id) {
        console.log("Salvando business_id e session_id:", { businessId: business.id, sessionId: data.sessionId });
        
        const { error: saveError } = await api.createBusinessSubscription({
          business_id: business.id,
          stripe_customer_id: "", // Será preenchido depois quando o pagamento for completo
          stripe_subscription_id: null,
          stripe_session_id: data.sessionId,
          payment_status: "pending", // Status inicial
          subscription_status: null,
          status: "open", // Status da sessão
        });

        if (saveError) {
          console.error("Erro ao salvar session_id:", saveError);
          // Não bloquear o checkout se falhar ao salvar
        } else {
          console.log("Session_id salvo com sucesso!");
        }
      }

      return data.clientSecret;
    } catch (err) {
      console.error("Erro ao criar sessão:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar sessão de pagamento";
      // Não setar error novamente se já foi setado acima
      if (!error) {
        setError(errorMessage);
      }
      throw err;
    }
  }, [business?.id, subscription]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);

  const handleCancelSubscription = useCallback(async () => {
    if (!subscription?.stripe_subscription_id) {
      setCancelError("ID da assinatura não encontrado.");
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita."
    );

    if (!confirmed) {
      return;
    }

    setIsCanceling(true);
    setCancelError(null);

    try {
      const { data, error: cancelError } = await api.cancelSubscription(
        subscription.stripe_subscription_id
      );

      if (cancelError || !data) {
        throw cancelError || new Error("Erro ao cancelar assinatura");
      }

      // Atualizar o status da subscription no banco
      if (subscription.stripe_subscription_id) {
        await api.updateBusinessSubscription({
          business_id: subscription.business_id,
          stripe_customer_id: subscription.stripe_customer_id,
          stripe_subscription_id: subscription.stripe_subscription_id,
          stripe_session_id: subscription.stripe_session_id,
          payment_status: subscription.payment_status,
          subscription_status: "canceled",
          status: "canceled",
        });
      }

      // Invalidar cache e refetch
      queryClient.invalidateQueries({ queryKey: ['business-subscription', business?.id] });
      setTimeout(() => {
        refetchSubscription();
      }, 100);

      alert("Assinatura cancelada com sucesso!");
    } catch (err) {
      console.error("Erro ao cancelar assinatura:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao cancelar assinatura";
      setCancelError(errorMessage);
    } finally {
      setIsCanceling(false);
    }
  }, [subscription, business?.id, queryClient, refetchSubscription]);

  const tabs = [
    { label: "Enviar selos", href: "/estabelecimento" },
    { label: "Dados", href: "/estabelecimento/dashboard" },
    { label: "Pagamento", href: "/estabelecimento/payment" },
  ];

  // Verificar status da subscription
  const isSubscriptionActive = subscription && subscription.status === "complete";
  const isSubscriptionPending = subscription && subscription.status === "open";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TabNavigation tabs={tabs} />
      <div className="flex flex-1">
        <div className="w-full px-6 py-8 sm:px-10 sm:py-8">

          {isLoadingSubscription ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-neutral-600">Carregando informações da assinatura...</p>
            </div>
          ) : isSubscriptionActive ? (
            <div className="max-w-2xl mx-auto">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h2 className="text-lg font-semibold text-green-800 mb-2">
                  Assinatura Ativa
                </h2>
                <p className="text-green-700 mb-4">
                  Sua assinatura está ativa e funcionando corretamente.
                </p>
                {subscription && (
                  <div className="text-sm text-green-600 space-y-1 mb-4">
                    <p>
                      <span className="font-medium">Status do pagamento:</span> {subscription.payment_status}
                    </p>
                    {subscription.subscription_status && (
                      <p>
                        <span className="font-medium">Status da assinatura:</span> {subscription.subscription_status}
                      </p>
                    )}
                  </div>
                )}
                {cancelError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {cancelError}
                  </div>
                )}
                <Button
                  variant="secondary"
                  onClick={handleCancelSubscription}
                  loading={isCanceling}
                  disabled={isCanceling || !subscription?.stripe_subscription_id}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isCanceling ? "Cancelando..." : "Cancelar Assinatura"}
                </Button>
              </div>
            </div>
          ) : isSubscriptionPending ? (
            <div className="max-w-2xl mx-auto">
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                  Aguardando Confirmação de Pagamento
                </h2>
                <p className="text-yellow-700 mb-4">
                  Sua assinatura está aguardando confirmação do pagamento. Você será notificado assim que o pagamento for confirmado.
                </p>
                {subscription && (
                  <div className="text-sm text-yellow-600 space-y-1">
                    <p>
                      <span className="font-medium">Status:</span> {subscription.status}
                    </p>
                    <p>
                      <span className="font-medium">Status do pagamento:</span> {subscription.payment_status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : !isStripeConfigured ? (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Stripe não está configurado.
              </p>
            </div>
          ) : (
            <div id="checkout" className="max-w-2xl">
              <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

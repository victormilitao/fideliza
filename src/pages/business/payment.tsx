import { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Header } from "@/pages/landing/header";
import { TabNavigation } from "@/components/business/tab-navigation";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// TODO: Substituir por um priceId real do Stripe
const DEFAULT_PRICE_ID = "price_1SWf6iDypeQ6bJI1ejk6ekQR";

export const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    // Só verifica o session_id se ele existir na URL (retorno do Stripe)
    if (sessionId) {
      setIsLoading(true);
      setError(null);
      // Verificar o status da sessão
      api
        .stripeSessionStatus(sessionId)
        .then(({ data, error }) => {
          if (error || !data) {
            console.error("Error getting session status:", error);
            setError("Erro ao verificar status do pagamento");
            return;
          }

          if (data.status === "complete") {
            setStatus("complete");
            setCustomerEmail(data.customer_email || "");
          } else if (data.status === "open") {
            // Sessão ainda aberta, limpar session_id da URL e mostrar checkout
            navigate("/estabelecimento/payment", { replace: true });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [searchParams, navigate]);

  const fetchClientSecret = useCallback(async () => {
    try {
      setError(null);
      console.log("Fetching client secret...");

      // TODO: Obter o priceId de algum lugar (props, contexto, etc.)
      const priceId = DEFAULT_PRICE_ID;

      if (!priceId) {
        throw new Error(
          "Price ID não configurado. Configure o DEFAULT_PRICE_ID."
        );
      }

      const { data, error } = await api.stripeRequest(priceId);

      if (error) {
        console.error("Error from API:", error);
        throw error;
      }

      if (!data || !data.clientSecret) {
        console.error("Invalid response:", data);
        throw new Error(
          "Resposta inválida da API: clientSecret não encontrado"
        );
      }

      console.log("Client secret received successfully");
      console.dir(data);
      return data.clientSecret;
    } catch (error) {
      console.error("Error in fetchClientSecret:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao criar sessão de pagamento";
      setError(errorMessage);
      throw error;
    }
  }, []);

  const options = { fetchClientSecret };

  const tabs = [
    { label: "Enviar selos", href: "/estabelecimento" },
    { label: "Dados", href: "/estabelecimento/dashboard" },
    { label: "Pagamento", href: "/estabelecimento/payment" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <TabNavigation tabs={tabs} />
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <p className="text-neutral-700">
              Verificando status do pagamento...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "complete") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <TabNavigation tabs={tabs} />
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <p className="text-primary-600 mb-4">
              Pagamento realizado com sucesso!
              {customerEmail && (
                <>
                  <br />
                  Um email de confirmação será enviado para {customerEmail}.
                </>
              )}
            </p>
            <button
              onClick={() => navigate("/estabelecimento")}
              className="text-primary-600 underline"
            >
              Voltar para o início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TabNavigation tabs={tabs} />
      <div className="flex flex-1">
        <div className="w-full px-6 py-8 sm:px-10 sm:py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  window.location.reload();
                }}
                className="mt-2 text-red-600 underline text-sm"
              >
                Tentar novamente
              </button>
            </div>
          )}

          <div id="checkout" className="max-w-2xl">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

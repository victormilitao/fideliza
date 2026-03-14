import { LogoutButton } from "@/components/logout-button";
import { SupportButton } from "@/components/support";
import { useAuthStore } from "@/store/useAuthStore";
import { APP_NAME } from "@/constants/app";
import Link from "next/link";

export const Header = () => {
  const { session } = useAuthStore();

  return (
    <header className="w-full">
      <div className="flex justify-between items-center px-8 py-5 lg:px-10 lg:py-8">
        <h1 className="text-xl sm:text-[2rem] font-bold text-primary-600">
          <Link href="/store">{APP_NAME}</Link>
        </h1>
        <div className="hidden sm:flex sm:items-center sm:gap-2">
          {!session && (
            <h1 className="text-base font-bold text-primary-600">
              <Link href="/login">Acessar minha conta</Link>
            </h1>
          )}
          {session && <SupportButton />}
          {session && <LogoutButton />}
        </div>
      </div>
    </header>
  );
};

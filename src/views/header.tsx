import { LogoutButton } from "@/components/logout-button";
import { SupportButton } from "@/components/support";
import { useAuthStore } from "@/store/useAuthStore";
import { APP_NAME } from "@/constants/app";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";

export const Header = () => {
  const { session } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useLogout();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full">
      <div className="flex justify-between items-center px-8 py-5 lg:px-10 lg:py-8">
        <h1 className="text-xl sm:text-[2rem] font-bold text-primary-600">
          <Link href="/store">{APP_NAME}</Link>
        </h1>

        {/* Desktop menu */}
        <div className="hidden sm:flex sm:items-center sm:gap-4">
          {!session && (
            <h1 className="text-base font-bold text-primary-600">
              <Link href="/login">Acessar minha conta</Link>
            </h1>
          )}
          {session && (
            <button
              onClick={() => router.push("/store/settings")}
              className="flex items-center gap-1 text-sm font-bold text-primary-600 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          )}
          {session && <SupportButton />}
          {session && <LogoutButton />}
        </div>

        {/* Mobile hamburger menu */}
        {session && (
          <div className="sm:hidden relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-neutral-700" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-[0px_0px_30px_0px_rgba(0,0,0,0.1)] py-3 px-4 z-50 min-w-[160px]">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/store/settings");
                  }}
                  className="block w-full text-left text-sm font-bold text-primary-600 py-2 cursor-pointer"
                >
                  Configurações
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-left text-sm font-bold text-primary-600 py-2 cursor-pointer"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

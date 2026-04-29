import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@assets/581735181_17852990877576365_1252896578201900588_n_1777147104021.jpg";

const primaryLinks = [
  { href: "/", label: "Início" },
  { href: "/jogos", label: "Jogos" },
  { href: "/resultados", label: "Resultados" },
  { href: "/equipe", label: "Equipe" },
  { href: "/contato", label: "Contato" },
];

const moreLinks = [
  { href: "/sobre", label: "Sobre o Projeto" },
  { href: "/missao", label: "Missão, Visão e Valores" },
  { href: "/metodologia", label: "Metodologia" },
  { href: "/impacto", label: "Impacto Social" },
  { href: "/pibex", label: "PIBEX" },
  { href: "/pic", label: "PIC" },
  { href: "/producao", label: "Produção Acadêmica" },
  { href: "/futuro", label: "Futuro do Projeto" },
];

const allLinks = [...primaryLinks, ...moreLinks];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center gap-2.5">
          <img src={logo} alt="Arbogame" className="h-9 w-9 rounded-lg object-cover ring-1 ring-border" />
          <div className="leading-tight">
            <span className="block font-bold tracking-tight">Arbogame</span>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-muted-foreground">
              UnDF · PIBEX · PIC
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-1">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover-elevate ${
                location === link.href ? "text-primary" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium text-foreground/70">
                Mais
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64">
              {moreLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex gap-1">
            <Link href="/ranking">🏆 Ranking</Link>
          </Button>
          <Link href="/dashboard" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="gap-1">
              📊 Dashboard
            </Button>
          </Link>
          <AuthModal />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Alternar menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="container mx-auto border-t bg-background px-4 py-4 lg:hidden">
          <div className="flex flex-col space-y-2">
            <Link
              href="/ranking"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 text-sm transition-colors text-foreground/70 hover:bg-muted"
            >
              🏆 Ranking
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 text-sm transition-colors text-foreground/70 hover:bg-muted"
            >
              📊 Dashboard
            </Link>
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  location === link.href
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground/70 hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

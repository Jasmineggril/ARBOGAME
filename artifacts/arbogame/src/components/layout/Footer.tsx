import { Link } from "wouter";
import { Mail, Instagram } from "lucide-react";
import logo from "@assets/581735181_17852990877576365_1252896578201900588_n_1777147104021.jpg";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-muted/30 py-12">
      <div className="container mx-auto max-w-screen-2xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Arbogame" className="h-10 w-10 rounded-lg object-cover ring-1 ring-border" />
              <div>
                <p className="text-base font-bold tracking-tight">Arbogame</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  UnDF · Universidade do Distrito Federal
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Projeto de pesquisa e extensão que combate as arboviroses (dengue, zika e chikungunya)
              por meio de jogos educativos. Integra Iniciação Científica (PIC) e Programa de
              Bolsas de Extensão (PIBEX) sob orientação do Prof. Antonio Augusto.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Programas</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pibex" className="hover:text-foreground">PIBEX · Extensão</Link></li>
              <li><Link href="/pic" className="hover:text-foreground">PIC · Pesquisa</Link></li>
              <li><Link href="/producao" className="hover:text-foreground">Produção Acadêmica</Link></li>
              <li><Link href="/metodologia" className="hover:text-foreground">Metodologia</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">O Projeto</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sobre" className="hover:text-foreground">Sobre</Link></li>
              <li><Link href="/equipe" className="hover:text-foreground">Equipe</Link></li>
              <li><Link href="/futuro" className="hover:text-foreground">Futuro</Link></li>
              <li><Link href="/admin" className="hover:text-foreground">Área administrativa</Link></li>
            </ul>
            <h3 className="mt-6 text-sm font-semibold tracking-tight">Contato</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:arbogame@undf.edu.br"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                  data-testid="link-footer-email"
                >
                  <Mail className="h-3.5 w-3.5" /> arbogame@undf.edu.br
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/arbogameundf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                  data-testid="link-footer-instagram"
                >
                  <Instagram className="h-3.5 w-3.5" /> @arbogameundf
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-2 border-t pt-8 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Arbogame · UnDF.</p>
          <p>Pesquisa, extensão e tecnologia a serviço da saúde pública.</p>
        </div>
      </div>
    </footer>
  );
}

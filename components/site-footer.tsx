import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer
      className="relative z-10 border-t border-zinc-800/80 px-5 sm:px-6 py-12 sm:py-16 bg-[#08080a]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div>
            <div className="logo-shimmer logo-glow text-2xl font-black tracking-tight mb-3">
              MRC Bypass
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Plataforma completa de licenciamento para produtos digitais, com auth
              em tempo real e painel de gestão.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-4">Produto</h4>
            <ul className="flex flex-col gap-2 text-sm text-zinc-400">
              <li><a href="#features"  className="hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#showcases" className="hover:text-white transition-colors">Showcases</a></li>
              <li><a href="#pricing"   className="hover:text-white transition-colors">Produtos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-4">Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-zinc-400">
              <li><Link href="/login" className="inline-flex items-center gap-1 hover:text-white transition-colors">Dashboard <ArrowUpRight className="h-3 w-3" /></Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-4">Suporte</h4>
            <ul className="flex flex-col gap-2 text-sm text-zinc-400">
              <li><a href="https://discord.gg/ZCWxPCyc7B" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800/80 pt-6 text-[11px] text-zinc-500">
          <span>© 2026 MRC Bypass. Todos os direitos reservados.</span>
          <span className="uppercase tracking-widest">Auth System v1.0</span>
        </div>
      </div>
    </footer>
  )
}

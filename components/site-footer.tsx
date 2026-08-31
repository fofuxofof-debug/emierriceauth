import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer
      className="relative z-10 border-t border-slate-200 px-5 sm:px-6 py-12 sm:py-16 bg-white text-slate-600"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div>
            <div className="logo-shimmer logo-glow text-2xl font-black tracking-tight mb-3 text-slate-950">
              MRC <span className="text-blue-600 font-bold">Bypass</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Plataforma completa de licenciamento para produtos digitais, com auth
              em tempo real e painel de gestão.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">Produto</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              <li><a href="#features"  className="hover:text-blue-600 transition-colors">Recursos</a></li>
              <li><a href="#showcases" className="hover:text-blue-600 transition-colors">Showcases</a></li>
              <li><a href="#pricing"   className="hover:text-blue-600 transition-colors">Produtos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              <li><Link href="/login" className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors">Dashboard <ArrowUpRight className="h-3 w-3" /></Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">Suporte</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              <li><a href="https://discord.gg/sswR4rK4r" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Central de Ajuda</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-6 text-[11px] text-slate-400">
          <span>© 2026 MRC Bypass. Todos os direitos reservados.</span>
          <span className="uppercase tracking-widest text-blue-600 font-medium">Auth System v1.0</span>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Mi Sitio
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              Acerca de
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contacto
            </Link>
            <Link href="/tasks" className="hover:text-primary transition-colors">
              Prueba BD
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

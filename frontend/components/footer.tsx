export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Mi Sitio</h3>
            <p className="text-muted-foreground">Tu descripción o mensaje principal aquí.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="/" className="hover:text-foreground transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-foreground transition-colors">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-foreground transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <p className="text-muted-foreground">
              email@ejemplo.com
              <br />
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 Mi Sitio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default function Hero() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Tu Proyecto Web</h1>
        <p className="text-xl text-muted-foreground mb-8 text-pretty">
          Una base sólida para construir tu presencia en línea. Personaliza este contenido según tus necesidades.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Comenzar
          </button>
          <button className="border border-input px-8 py-3 rounded-lg font-medium hover:bg-accent transition-colors">
            Saber más
          </button>
        </div>
      </div>
    </section>
  )
}

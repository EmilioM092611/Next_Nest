import Header from "@/components/header"
import Footer from "@/components/footer"
import Hero from "@/components/hero"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Bienvenido a tu sitio web</h2>
            <p className="text-lg text-center text-muted-foreground">
              Esta es una página base que puedes personalizar según tus necesidades.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

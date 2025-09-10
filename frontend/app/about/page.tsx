import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Acerca de nosotros</h1>
          <div className="prose prose-lg max-w-none">
            <p>Esta es la página "Acerca de". Aquí puedes contar la historia de tu proyecto, empresa o sitio web.</p>
            <p>
              Personaliza este contenido con tu información real, misión, visión, y todo lo que quieras compartir con
              tus visitantes.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

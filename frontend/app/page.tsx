"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header"
import Footer from "@/components/footer"
import Hero from "@/components/hero"

export default function HomePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Verificando...");
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Test de conexión con el backend
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/saludo");
        if (response.ok) {
          const data = await response.text();
          setConnectionStatus(data);
          setIsConnected(true);
        } else {
          setConnectionStatus("❌ Error de conexión");
          setIsConnected(false);
        }
      } catch (error) {
        setConnectionStatus("❌ Backend no disponible");
        setIsConnected(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Sección original */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Bienvenido a tu sitio web</h2>
            <p className="text-lg text-center text-muted-foreground">
              Esta es una página base que puedes personalizar según tus necesidades.
            </p>
          </div>
        </section>

        {/* Nueva sección de test de conexión */}
        <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Estado del Backend</h3>
              <div className="flex items-center justify-center space-x-3">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    isConnected === null ? 'bg-yellow-400 animate-pulse' :
                    isConnected ? 'bg-green-400' : 'bg-red-400'
                  }`}
                ></div>
                <span className={`font-medium ${
                  isConnected === null ? 'text-yellow-600' :
                  isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {connectionStatus}
                </span>
              </div>
              {isConnected && (
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
                  Frontend (Puerto 3002) ↔ Backend (Puerto 3000)
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
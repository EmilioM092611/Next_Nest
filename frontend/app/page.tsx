"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mensaje, setMensaje] = useState("Cargando...");

  useEffect(() => {
    fetch("http://localhost:3000/api/saludo")
      .then((res) => res.text())
      .then((data) => setMensaje(data))
      .catch(() => setMensaje("❌ Error conectando con Nest"));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{mensaje}</h1>
    </main>
  );
}

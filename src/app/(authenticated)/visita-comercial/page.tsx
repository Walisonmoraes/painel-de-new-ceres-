"use client"

import { VisitaComercialForm } from "@/components/visita-comercial/visita-comercial-form"

export default function VisitaComercialPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visita Comercial</h1>
      </div>

      <VisitaComercialForm />
    </div>
  )
}

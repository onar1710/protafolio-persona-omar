import React, { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";

export default function DevSearchModal({ onClose, labels }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 sm:p-12 text-center flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2 ring-8 ring-primary/5">
        <SearchIcon className="text-primary w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">{labels?.title || "Búsqueda Rápida"}</h3>
        <p className="text-foreground/60 max-w-sm mx-auto leading-relaxed">
          {labels?.description || "Usa la búsqueda para encontrar contenido rápidamente en el sitio. Escribe para empezar a buscar."}
        </p>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-md">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/50 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-12 pr-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            autoFocus
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
            onClick={onClose}
            className="px-8 py-3 bg-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all text-sm font-semibold active:scale-95"
        >
            {labels?.gotIt || "Entendido"}
        </button>
      </div>
    </div>
  );
}

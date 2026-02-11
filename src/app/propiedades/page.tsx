import { Suspense } from "react";

import { PropertiesSearch } from "@/components/templates";

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando propiedades...</div>}>
      <PropertiesSearch />
    </Suspense>
  );
}

import "@payloadcms/next/css";

import { RootLayout } from "@payloadcms/next/layouts";

import configPromise from "@payload-config";

import { importMap } from "./importMap.js";
import { payloadServerFunction } from "./serverFunctions";

import type { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={payloadServerFunction}
    >
      {children}
    </RootLayout>
  );
}

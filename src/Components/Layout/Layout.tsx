import React, { ReactNode } from "react";
import { NavBar } from "../NavBar";

export type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    // TODO: Add dengan Header
    <main>
      <NavBar />
      {children}
    </main>
  );
}

import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      {children}
    </div>
  );
}
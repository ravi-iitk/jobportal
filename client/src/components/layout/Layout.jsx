import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        <Navbar onToggle={() => setSidebarOpen((open) => !open)} isOpen={sidebarOpen} />
        <main className="pt-0 px-3 md:px-5 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden app-surface">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8 scrollbar-thin">
          {children}
        </main>
        </div>
      </div>
      <Toaster />
    </AuthGuard>
  );
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          <a href="/admin/dashboard" className="block py-2.5 px-4 rounded hover:bg-gray-800">
            Dashboard
          </a>
          <a href="/admin/email" className="block py-2.5 px-4 rounded hover:bg-gray-800">
            Email Management
          </a>
          <a href="/admin/complaints" className="block py-2.5 px-4 rounded hover:bg-gray-800">
            Customer Complaints
          </a>
          <a href="/admin/errors" className="block py-2.5 px-4 rounded hover:bg-gray-800">
            Error Management
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
} 
// app/admin/dashboard/page.tsx
import React from "react";
import AdminDashboard from "@/components/modules/admin/dashboard/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  // Server-side session kontrolü
  const session = await getServerSession(authOptions);

  // Eğer giriş yoksa veya role ADMIN değilse login sayfasına yönlendir
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <div>
      <AdminDashboard />
    </div>
  );
}

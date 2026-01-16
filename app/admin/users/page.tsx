import React from "react";
import AdminUsers from "@/components/modules/admin/users/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  // Eğer giriş yoksa veya role ADMIN değilse login sayfasına yönlendir
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <div>
      <AdminUsers />
    </div>
  );
}

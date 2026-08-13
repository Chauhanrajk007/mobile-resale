export const dynamic = 'force-dynamic';

import { getAuthUser } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  await dbConnect();
  const user = await getAuthUser();
  if (!user || user.role !== 'admin') redirect('/login');
  return <AdminDashboard />;
}

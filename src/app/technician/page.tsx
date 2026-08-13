export const dynamic = 'force-dynamic';

import { getAuthUser } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import { redirect } from 'next/navigation';
import TechDashboard from '@/components/technician/TechDashboard';

export default async function TechnicianPage() {
  await dbConnect();
  const user = await getAuthUser();
  if (!user || user.role !== 'technician') redirect('/login');
  return <TechDashboard />;
}

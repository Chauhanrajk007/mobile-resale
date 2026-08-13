export const dynamic = 'force-dynamic';

import { dbConnect } from '@/lib/db';
import Booking from '@/models/Booking';
import InvoiceView from '@/components/invoice/InvoiceView';
import { notFound } from 'next/navigation';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const booking = await Booking.findById(id)
    .populate('customer', 'name email phone')
    .populate('technician', 'name technicianId')
    .lean();
    
  if (!booking) notFound();
  
  return <InvoiceView booking={JSON.parse(JSON.stringify(booking))} />;
}

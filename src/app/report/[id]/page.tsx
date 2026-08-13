export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import Inspection from "@/models/Inspection";
import ReportView from "@/components/report/ReportView";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await dbConnect();
  const inspection = await Inspection.findOne({ inspectionId: id }).lean();

  if (!inspection) {
    notFound();
  }

  // Pass plain object
  const data = JSON.parse(JSON.stringify(inspection));

  return <ReportView inspection={data} />;
}

import { dbConnect } from "@/lib/db";
import Inspection from "@/models/Inspection";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    const inspection = await Inspection.findOne({ inspectionId: id })
      .populate("technician", "name email technicianId");
    
    if (!inspection || inspection.status !== "completed") {
      return Response.json({ error: "Report not found or not completed" }, { status: 404 });
    }
    
    return Response.json({ inspection });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

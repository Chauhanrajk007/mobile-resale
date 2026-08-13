import { dbConnect } from "@/lib/db";
import Inspection from "@/models/Inspection";
import { requireRoles } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    await requireRoles(["admin", "technician"]);
    
    const { id } = await params;
    
    const inspection = await Inspection.findById(id);
    
    if (!inspection) {
      return Response.json({ error: "Inspection not found" }, { status: 404 });
    }
    
    if (inspection.status !== "in_progress") {
      return Response.json({ error: "Inspection is not in-progress" }, { status: 400 });
    }
    
    let overallResult = "conditional";
    const testResults = inspection.tests || [];
    
    if (testResults.length > 0) {
      const hasFail = testResults.some((t: any) => t.result === "fail");
      const allPass = testResults.every((t: any) => t.result === "pass");
      
      if (hasFail) overallResult = "fail";
      else if (allPass) overallResult = "pass";
      else overallResult = "conditional";
    }
    
    inspection.status = "completed";
    inspection.completedAt = new Date();
    inspection.overallResult = overallResult;
    
    await inspection.save();
    
    return Response.json({ inspection });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

import { dbConnect } from "@/lib/db";
import Inspection from "@/models/Inspection";
import { requireRoles } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    await requireRoles(["admin", "technician"]);
    
    const { id } = await params;
    
    const inspection = await Inspection.findById(id).populate("technician", "name email technicianId");
    
    if (!inspection) {
      return Response.json({ error: "Inspection not found" }, { status: 404 });
    }
    
    return Response.json({ inspection });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    await requireRoles(["admin", "technician"]);
    
    const { id } = await params;
    const body = await request.json();
    
    const inspection = await Inspection.findById(id);
    
    if (!inspection) {
      return Response.json({ error: "Inspection not found" }, { status: 404 });
    }
    
    if (inspection.status !== "in_progress") {
      return Response.json({ error: "Only in-progress inspections can be updated" }, { status: 400 });
    }
    
    if (body.tests !== undefined) inspection.tests = body.tests;
    if (body.physicalCondition !== undefined) inspection.physicalCondition = body.physicalCondition;
    if (body.phone !== undefined) inspection.phone = body.phone;
    if (body.deviceInfo !== undefined) inspection.deviceInfo = body.deviceInfo;
    if (body.comments !== undefined) inspection.comments = body.comments;
    if (body.location !== undefined) inspection.location = body.location;
    if (body.photos !== undefined) inspection.photos = body.photos;
    
    await inspection.save();
    
    return Response.json({ inspection });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    await requireRoles(["admin"]);
    
    const { id } = await params;
    
    const inspection = await Inspection.findByIdAndDelete(id);
    
    if (!inspection) {
      return Response.json({ error: "Inspection not found" }, { status: 404 });
    }
    
    return Response.json({ success: true, message: "Inspection deleted" });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { requireRoles } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    await requireRoles(["admin"]);
    
    const { id } = await params;
    const technician = await User.findOne({ _id: id, role: "technician" });
    
    if (!technician) {
      return Response.json({ error: "Technician not found" }, { status: 404 });
    }
    
    return Response.json({ technician });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    await requireRoles(["admin"]);
    
    const { id } = await params;
    const body = await request.json();
    
    const technician = await User.findOne({ _id: id, role: "technician" });
    
    if (!technician) {
      return Response.json({ error: "Technician not found" }, { status: 404 });
    }
    
    if (body.name !== undefined) technician.name = body.name;
    if (body.phone !== undefined) technician.phone = body.phone;
    if (body.active !== undefined) technician.active = body.active;
    
    await technician.save();
    
    return Response.json({ technician });
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
    
    const technician = await User.findOne({ _id: id, role: "technician" });
    
    if (!technician) {
      return Response.json({ error: "Technician not found" }, { status: 404 });
    }
    
    technician.active = false;
    await technician.save();
    
    return Response.json({ success: true, message: "Technician deactivated" });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

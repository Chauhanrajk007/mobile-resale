import { dbConnect } from "@/lib/db";
import PhoneModel from "@/models/PhoneModel";
import { requireRoles } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    await requireRoles(["admin"]);
    
    const { id } = await params;
    const body = await request.json();
    
    const phone = await PhoneModel.findById(id);
    if (!phone) {
      return Response.json({ error: "Phone model not found" }, { status: 404 });
    }
    
    if (body.brand !== undefined) phone.brand = body.brand;
    if (body.model !== undefined) phone.model = body.model;
    if (body.variants !== undefined) phone.variants = body.variants;
    if (body.active !== undefined) phone.active = body.active;
    
    await phone.save();
    
    return Response.json({ phone });
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
    
    const phone = await PhoneModel.findById(id);
    if (!phone) {
      return Response.json({ error: "Phone model not found" }, { status: 404 });
    }
    
    phone.active = false;
    await phone.save();
    
    return Response.json({ success: true, message: "Phone model deactivated" });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

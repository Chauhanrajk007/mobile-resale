import { dbConnect } from "@/lib/db";
import Inspection from "@/models/Inspection";
import { requireRoles } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    await requireRoles(["admin", "technician"]);

    const { id } = await params;
    const { photos } = await request.json();

    if (!Array.isArray(photos)) {
      return Response.json({ error: "photos must be an array" }, { status: 400 });
    }

    const inspection = await Inspection.findById(id);
    if (!inspection) {
      return Response.json({ error: "Inspection not found" }, { status: 404 });
    }

    inspection.photos = photos;
    await inspection.save();

    return Response.json({ success: true });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : error.message === "Unauthorized" ? 401 : 500;
    return Response.json({ error: error.message }, { status });
  }
}

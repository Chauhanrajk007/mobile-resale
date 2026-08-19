import { dbConnect } from "@/lib/db";
import Inspection from "@/models/Inspection";
import { requireRoles, getAuthUser } from "@/lib/auth";
import { ALL_TEST_ITEMS } from "@/lib/constants";
import { inspectionNumber } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const status = searchParams.get("status");
    const technician = searchParams.get("technician");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    
    if (authUser.role === "technician") {
      query.technician = authUser._id;
    } else if (technician) {
      query.technician = technician;
    }

    if (status) query.status = status;

    if (q) {
      query.$or = [
        { inspectionId: { $regex: q, $options: "i" } },
        { "phone.imei": { $regex: q, $options: "i" } },
      ];
    }

    const inspections = await Inspection.find(query)
      .populate("technician", "name email technicianId")
      .sort({ createdAt: -1 });

    return Response.json({ inspections });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const authUser = await requireRoles(["admin", "technician"]);
    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    
    const count = await Inspection.countDocuments();
    const id = inspectionNumber(count + 1);
    
    const initialTests = ALL_TEST_ITEMS.map((test) => ({
      ...test,
      result: "not_tested" as const,
      comment: "",
    }));

    const inspection = await Inspection.create({
      ...body,
      inspectionId: id,
      technician: authUser._id,
      tests: initialTests,
      status: "in_progress",
    });

    return Response.json({ inspectionId: inspection.inspectionId, _id: String(inspection._id), inspection }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

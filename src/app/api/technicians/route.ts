import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { requireRoles } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await dbConnect();
    await requireRoles(["admin"]);
    
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    let query: any = { role: "technician" };
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { technicianId: { $regex: q, $options: "i" } },
      ];
    }

    const technicians = await User.find(query).sort({ createdAt: -1 });
    return Response.json({ technicians });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    await requireRoles(["admin"]);

    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const technician = await User.create({
      name,
      email,
      phone,
      passwordHash: password, // Pre-save hook hashes this
      role: "technician",
    });

    return Response.json({ technician }, { status: 201 });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { requireRoles } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, email, phone, password, role } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const requestedRole = role || "customer";
    if (requestedRole === "technician" || requestedRole === "admin") {
      await requireRoles(["admin"]);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password, // Pre-save hook will hash this
      role: requestedRole,
    });

    return Response.json({ user }, { status: 201 });
  } catch (error: any) {
    // If requireRoles throws, we return 403 or 401 depending on the error message
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

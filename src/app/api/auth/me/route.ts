import { dbConnect } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    
    if (!authUser || !authUser.active) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return Response.json({ user: authUser });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    
    if (!authUser || !authUser.active) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailNotifications } = await request.json();
    const user = await User.findById(authUser._id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (emailNotifications !== undefined) {
      user.emailNotifications = emailNotifications;
    }

    await user.save();
    return Response.json({ user });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

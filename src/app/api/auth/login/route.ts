import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim(), active: true });
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    let isMatch = await user.comparePassword(password);

    // Self-heal: if the stored password is NOT bcrypt (e.g. plaintext inserted
    // directly in the DB via Compass), compare directly and upgrade it to a hash.
    if (!isMatch && typeof user.passwordHash === "string" && !user.passwordHash.startsWith("$2")) {
      isMatch = user.passwordHash === password;
      if (isMatch) {
        const bcrypt = await import("bcryptjs");
        user.passwordHash = await bcrypt.hash(password, 10);
      }
    }

    if (!isMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ _id: user._id });
    await setAuthCookie(token);

    return Response.json({ user });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

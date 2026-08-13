import { dbConnect } from "@/lib/db";
import PhoneModel from "@/models/PhoneModel";
import { requireRoles } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const distinct = searchParams.get("distinct");

    if (distinct === "brand") {
      const brands = await PhoneModel.distinct("brand", { active: true });
      // Sort alphabetically
      brands.sort();
      return Response.json({ brands });
    }
    
    const query: any = { active: true };
    if (brand) {
      query.brand = brand;
    }
    
    const phones = await PhoneModel.find(query).sort({ brand: 1, model: 1 });
    return Response.json({ phones });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    await requireRoles(["admin"]);
    
    const { brand, model, variants } = await request.json();
    
    if (!brand || !model) {
      return Response.json({ error: "Brand and model are required" }, { status: 400 });
    }
    
    const phone = await PhoneModel.create({ brand, model, variants: variants || [] });
    
    return Response.json({ phone }, { status: 201 });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}

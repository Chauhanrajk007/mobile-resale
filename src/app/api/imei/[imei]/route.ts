import { validateIMEI, lookupIMEI } from "@/lib/imei";

export async function GET(request: Request, { params }: { params: Promise<{ imei: string }> }) {
  try {
    const { imei } = await params;
    
    if (!validateIMEI(imei)) {
      return Response.json({ error: "Invalid IMEI number" }, { status: 400 });
    }
    
    const data = await lookupIMEI(imei);
    return Response.json({ data });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

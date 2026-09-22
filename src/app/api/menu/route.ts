import { getMenu } from "@/server/menu/queries";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json(
      { dishes: await getMenu() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error("Public menu query failed.");
    return Response.json(
      { error: "Menu temporarily unavailable." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

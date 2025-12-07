import axios from "axios";

export const revalidate = 3600;

export async function GET() {
  const res = await fetch(
    "https://v6.exchangerate-api.com/v6/a3e6620b7f3ef27bda26dc11/latest/USD"
  );

  if (!res.ok) {
    return new Response("Failed to fetch rates", { status: 500 });
  }

  const data = await res.json();

  return Response.json({ data });
}

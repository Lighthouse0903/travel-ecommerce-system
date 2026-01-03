import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tours/${params.id}`,
    {
      method: "PATCH",
      body: formData,
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  revalidateTag("tours"); // Home / list
  revalidateTag(`tour-${params.id}`); // Detail

  return NextResponse.json(data);
}

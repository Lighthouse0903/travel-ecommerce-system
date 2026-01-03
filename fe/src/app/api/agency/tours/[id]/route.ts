import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await req.formData();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tours/${id}`, {
    method: "PATCH",
    body: formData,
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  revalidateTag("tours"); // Home / list
  revalidateTag(`tour-${id}`); // Detail

  return NextResponse.json(data);
}

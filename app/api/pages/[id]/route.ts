import { NextResponse } from "next/server";
import { deletePage } from "@/lib/storage";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: Props) {
  const { id } = await params;
  const deleted = await deletePage(id);

  if (!deleted) {
    return NextResponse.json({ error: "Page not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

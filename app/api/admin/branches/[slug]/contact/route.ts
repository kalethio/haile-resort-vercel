// app/api/admin/branches/[slug]/contact/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { slug } = await params; // ✅ Await params
    const body = await req.json();
    const { phone, email, address, socials } = body;

    // Find branch ID
    const branch = await prisma.branch.findFirst({
      where: { slug: slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Upsert contact
    const contact = await prisma.contact.upsert({
      where: { branchId: branch.id },
      update: {
        phone: phone || null,
        email: email || null,
        address: address || null,
        socials: socials || null,
      },
      create: {
        phone: phone || null,
        email: email || null,
        address: address || null,
        socials: socials || null,
        branchId: branch.id,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Contact update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

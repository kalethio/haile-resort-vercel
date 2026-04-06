// app/api/admin/branches/[slug]/accommodations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

// Default accommodations data
export const DEFAULT_ACCOMMODATIONS = [
  {
    title: "Restaurant",
    description:
      "Our resort has eight food and beverage outlets serving both local and international cuisine.",
    image: "/uploads/accommodations/restaurant.jpg",
  },
  {
    title: "Spa - Beauty & Health",
    description: "Rejuvenate yourself after an exhausting work schedule.",
    image: "/uploads/accommodations/beauty.jpg",
  },
  {
    title: "Conference Room",
    description:
      "Halls facilities including sound system, stationery materials (notebook, pen, flip chart & stand) and LCD Projector.",
    image: "/uploads/accommodations/conference.jpg",
  },
  {
    title: "Swimming Pool",
    description: "Make swimming a part of your lifestyle",
    image: "/uploads/accommodations/swimming.jpg",
  },
  {
    title: "Multi-purpose Halls",
    description:
      "multi-purpose halls that are outfitted with modern meeting equipment and supplies allowing variety of setups including meetings, workshops or weddings. Venue occupancy is based on the standard set up.",
    image: "/uploads/accommodations/halls.jpg",
  },
];

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params;

    const branch = await prisma.branch.findFirst({
      where: { slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const accommodations = await prisma.accommodation.findMany({
      where: { branchId: branch.id },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(accommodations);
  } catch (error) {
    console.error("Accommodations fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const accommodations = body.accommodations || [];

    const branch = await prisma.branch.findFirst({
      where: { slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Delete all existing accommodations
    await prisma.accommodation.deleteMany({
      where: { branchId: branch.id },
    });

    // Create new accommodations
    const createdAccommodations = await Promise.all(
      accommodations.map((item: any) =>
        prisma.accommodation.create({
          data: {
            title: item.title,
            description: item.description || null,
            image: item.image || null,
            branchId: branch.id,
          },
        })
      )
    );

    return NextResponse.json(createdAccommodations);
  } catch (error) {
    console.error("Accommodations update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

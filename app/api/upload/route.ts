// import { put, del } from "@vercel/blob";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     const blob = await put(file.name, file, {
//       access: "public",
//     });

//     return NextResponse.json({
//       success: true,
//       url: blob.url,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const { url } = await request.json();

//     if (!url) {
//       return NextResponse.json({ error: "URL is required" }, { status: 400 });
//     }

//     await del(url);

//     return NextResponse.json({
//       success: true,
//       message: "File deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return NextResponse.json(
//       { error: "Failed to delete file" },
//       { status: 500 }
//     );
//   }
// }

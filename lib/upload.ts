// app/lib/upload.ts
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
  fileId?: string;
}

export class FileUploader {
  private uploadDir: string;
  public publicUrl: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    this.publicUrl = "/uploads";
  }

  async uploadFile(
    file: File,
    subfolder: string = "general"
  ): Promise<UploadResult> {
    try {
      // Validation
      if (!file.type.startsWith("image/")) {
        return { success: false, error: "Only image files are allowed" };
      }

      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: "File size must be less than 5MB" };
      }

      // Generate automatic filename
      const timestamp = Date.now();
      const uuid = uuidv4().slice(0, 8);
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeName = file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 50);

      const filename = `${timestamp}-${uuid}-${safeName}.${fileExtension}`;
      const folderPath = path.join(this.uploadDir, subfolder);
      const filePath = path.join(folderPath, filename);

      // Ensure directory exists
      await fs.mkdir(folderPath, { recursive: true });

      // Write file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      // Return public URL (automatic path)
      const publicUrl = `${this.publicUrl}/${subfolder}/${filename}`;

      return {
        success: true,
        url: publicUrl,
        filename,
        fileId: filename,
      };
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false, error: "Failed to upload file" };
    }
  }

  async deleteFile(url: string): Promise<boolean> {
    try {
      // Extract filename and subfolder from URL
      const urlParts = url.split("/");
      const filename = urlParts.pop();
      const subfolder = urlParts.pop() || "general";

      if (!filename) {
        console.error("Invalid URL:", url);
        return false;
      }

      const filePath = path.join(this.uploadDir, subfolder, filename);

      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`✅ Deleted file: ${filePath}`);
        return true;
      } catch (error) {
        console.error(`❌ File not found: ${filePath}`, error);
        return false;
      }
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    }
  }
}

export const fileUploader = new FileUploader();

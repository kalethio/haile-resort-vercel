// app/admin/3roomAndPrice/[slug]/page.tsx
import BranchManagement from "../components/BranchManagement";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BranchPage({ params }: PageProps) {
  const { slug } = await params; // ← AWAIT params

  return <BranchManagement branchSlug={slug} />;
}

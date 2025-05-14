"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

export default function BiographyDetailPage() {
  const { id } = useParams();

  // Dynamically import the section component based on the `id`
  const SectionComponent = dynamic(() => import(`./${id}.tsx`).catch(() => null));

  // Render the section component if it exists, otherwise fallback
  return SectionComponent ? (
    <SectionComponent />
  ) : (
    <div className="text-white p-10">Page not found.</div>
  );
}

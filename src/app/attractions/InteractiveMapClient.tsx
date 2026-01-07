"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("../../../public/components/InteractiveMaps"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[800px] w-full animate-pulse rounded-3xl bg-gray-100" />
    ),
  },
);

export default function InteractiveMapClient() {
  return <InteractiveMap />;
}

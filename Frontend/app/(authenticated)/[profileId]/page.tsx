import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const resolvedParams = await params;
  return <div>{resolvedParams.profileId}</div>;
}

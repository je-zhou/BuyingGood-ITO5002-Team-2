import React from "react";

export default function Page({ params }: { params: { profileId: string } }) {
  return <div>{params.profileId}</div>;
}

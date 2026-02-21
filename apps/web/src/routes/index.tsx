import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { orpc } from "@/utils/orpc";
import { MintlifyBackground } from "@/components/MintlifyBackground";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());

  return (
    <div className="relative  overflow-x-hidden">
      <MintlifyBackground />

      <h1>DevJams Blog</h1>
    </div>
  );
}

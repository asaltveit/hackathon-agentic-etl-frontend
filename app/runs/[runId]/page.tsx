export default function RunPage({
  params,
}: {
  params: { runId: string };
}) {
  return (
    <div>
      <h1>Run: {params.runId}</h1>
    </div>
  );
}


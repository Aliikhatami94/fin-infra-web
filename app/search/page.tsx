export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const params = await searchParams
  const q = (params?.q ?? "").toString()
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold">Search</h1>
      <p className="text-muted-foreground">Results for: <span className="font-medium">{q || "(empty)"}</span></p>
      <div className="rounded-lg border p-6 text-sm text-muted-foreground bg-muted/10">
        <p>This is a minimal search stub. Implement real results here.</p>
      </div>
    </div>
  )
}

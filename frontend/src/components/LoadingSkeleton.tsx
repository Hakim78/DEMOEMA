export function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#ffffff10] animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-5 w-48 bg-[#ffffff10] rounded-lg" />
            <div className="h-4 w-20 bg-[#ffffff08] rounded" />
          </div>
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-28 bg-[#ffffff08] rounded-full" />
            <div className="h-6 w-24 bg-[#ffffff08] rounded-full" />
          </div>
        </div>
        <div className="h-10 w-12 bg-[#ffffff10] rounded-lg ml-4" />
      </div>
      <div className="mt-5 pt-4 border-t border-[#ffffff08] flex justify-between items-center">
        <div className="flex gap-6">
          <div>
            <div className="h-3 w-20 bg-[#ffffff08] rounded mb-1.5" />
            <div className="h-4 w-28 bg-[#ffffff10] rounded" />
          </div>
          <div>
            <div className="h-3 w-16 bg-[#ffffff08] rounded mb-1.5" />
            <div className="h-4 w-24 bg-[#ffffff10] rounded" />
          </div>
        </div>
        <div className="h-9 w-36 bg-[#ffffff08] rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonKPI() {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#ffffff08] to-[#ffffff02] border border-[#ffffff10] animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#ffffff10]" />
        <div className="w-12 h-5 rounded-full bg-[#ffffff08]" />
      </div>
      <div className="h-7 w-20 bg-[#ffffff10] rounded-lg mb-2" />
      <div className="h-3 w-32 bg-[#ffffff08] rounded" />
    </div>
  );
}

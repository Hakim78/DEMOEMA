export function SkeletonCard() {
  return (
    <div className="p-8 rounded-[3rem] bg-black/40 border border-white/10 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-7 w-56 bg-white/5 rounded-2xl" />
            <div className="h-5 w-24 bg-white/[0.03] rounded-xl" />
          </div>
          <div className="flex gap-3 mt-4">
            <div className="h-8 w-32 bg-white/[0.03] rounded-2xl" />
            <div className="h-8 w-28 bg-white/[0.03] rounded-2xl" />
          </div>
        </div>
        <div className="h-14 w-14 bg-white/5 rounded-2xl ml-6" />
      </div>
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
        <div className="flex gap-8">
          <div>
            <div className="h-4 w-24 bg-white/[0.03] rounded-lg mb-2" />
            <div className="h-5 w-32 bg-white/5 rounded-xl" />
          </div>
          <div>
            <div className="h-4 w-20 bg-white/[0.03] rounded-lg mb-2" />
            <div className="h-5 w-28 bg-white/5 rounded-xl" />
          </div>
        </div>
        <div className="h-12 w-48 bg-white/5 rounded-[1.5rem]" />
      </div>
    </div>
  );
}

export function SkeletonKPI() {
  return (
    <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/10 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/5" />
        <div className="w-16 h-6 rounded-full bg-white/[0.03]" />
      </div>
      <div className="h-10 w-28 bg-white/5 rounded-2xl mb-3" />
      <div className="h-4 w-40 bg-white/[0.03] rounded-xl" />
    </div>
  );
}

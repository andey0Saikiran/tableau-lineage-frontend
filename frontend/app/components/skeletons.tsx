export function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-8">
      <div className="relative rounded-[30px] border-2 border-dashed border-[#94a3b8]/40 bg-white/85 backdrop-blur-xl p-14">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] rounded-full animate-pulse" />
          <div className="space-y-3">
            <div className="h-8 bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] rounded-lg w-3/4 mx-auto animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] rounded-lg w-1/2 mx-auto animate-pulse" />
          </div>
          <div className="flex gap-4 justify-center">
            <div className="h-12 bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] rounded-xl w-32 animate-pulse" />
            <div className="h-12 bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] rounded-xl w-40 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <section className="max-w-5xl mx-auto px-6 mt-12 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] rounded w-24 animate-pulse" />
                <div className="w-8 h-8 bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] rounded-full animate-pulse" />
              </div>
              <div className="h-10 bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] rounded w-20 animate-pulse" />
              <div className="h-1 bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div className="flex-1 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Chart/Table Area Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-80">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-56 bg-gray-100 rounded w-full"></div>
          </div>
          {/* List Area Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          {/* Side Panel Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-64">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-100 rounded w-full"></div>
              <div className="h-24 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

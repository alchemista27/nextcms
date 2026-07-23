import { formatDate } from "@/lib/utils";
import EditNoteIcon from "@mui/icons-material/EditNote";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

interface ActivityLogProps {
  activities: any[];
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      </div>
      
      <div className="p-5">
        {activities.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-4">No recent activity.</div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {activities.map((activity, index) => (
              <div key={`${activity.id}-${index}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-[#00704A] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-2 md:left-1/2 md:-translate-x-1/2 z-10">
                  {/* Just use a generic icon for now */}
                  <EditNoteIcon style={{ fontSize: 14 }} />
                </div>
                
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-gray-100 bg-gray-50 shadow-sm ml-10 md:ml-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#00704A] uppercase">
                      {activity.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(activity.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-1">
                    Updated <span className="font-medium">"{activity.title}"</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

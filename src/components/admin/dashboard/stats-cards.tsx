import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Link from "next/link";

interface StatsCardsProps {
  stats: any;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Posts",
      value: stats.posts,
      icon: <ArticleOutlinedIcon fontSize="large" />,
      href: "/admin/posts",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Pages",
      value: stats.pages,
      icon: <DescriptionOutlinedIcon fontSize="large" />,
      href: "/admin/pages",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Media Files",
      value: stats.media,
      icon: <PermMediaOutlinedIcon fontSize="large" />,
      href: "/admin/media",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Registered Users",
      value: stats.users,
      icon: <GroupOutlinedIcon fontSize="large" />,
      href: "/admin/users",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Link key={card.label} href={card.href} className="block group">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between transition-shadow hover:shadow-md">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 group-hover:text-[#00704A] transition-colors">
                {card.value}
              </h3>
            </div>
            <div className={`p-4 rounded-full ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

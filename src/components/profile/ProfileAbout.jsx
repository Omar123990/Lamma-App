import { Mail, User, Cake } from "lucide-react";
import { format } from "date-fns";

export default function ProfileAbout({ userInfo }) {
  const formatDateSafe = (dateString) => {
    if (!dateString) return "Not Specified";
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? format(date, "MMMM d, yyyy")
      : "Not Specified";
  };

  const details = [
    {
      icon: <Mail className="text-blue-500" size={24} />,
      label: "Email",
      value: userInfo?.email || "No Email",
    },
    {
      icon: <User className="text-purple-500" size={24} />,
      label: "Gender",
      value: userInfo?.gender || "Not Specified",
    },
    {
      icon: <Cake className="text-pink-500" size={24} />,
      label: "Date of Birth",
      value: formatDateSafe(userInfo?.dateOfBirth),
    },
  ];

  return (
    <div className="bg-white/20 dark:bg-[#0f0f11]/40 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/40 dark:border-white/10 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {details.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl hover:bg-white/30 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-white/40 dark:hover:border-white/10"
          >
            <div className="p-3 bg-white/40 dark:bg-black/40 border border-white/30 dark:border-white/5 rounded-full mb-3">
              {item.icon}
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Card, CardBody, CardHeader } from "@heroui/react";
import { Mail, Calendar, User } from "lucide-react";

export default function ProfileAbout({ userInfo }) {
  return (
    <Card className="w-full bg-white/5 border border-white/10 backdrop-blur-md p-2">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          <h3 className="text-xl font-bold text-white mb-4">About</h3>
      </CardHeader>
      <CardBody className="px-4 pb-4 gap-4">
          
          <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><Mail size={22} /></div>
              <div><p className="text-xs text-gray-400">Email</p><p className="text-white font-medium">{userInfo?.email}</p></div>
          </div>

          <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400"><Calendar size={22} /></div>
              <div><p className="text-xs text-gray-400">Date of Birth</p><p className="text-white font-medium">{userInfo?.dateOfBirth ? userInfo.dateOfBirth.split('T')[0] : "Not specified"}</p></div>
          </div>

          <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400"><User size={22} /></div>
              <div><p className="text-xs text-gray-400">Gender</p><p className="text-white font-medium capitalize">{userInfo?.gender || "Not specified"}</p></div>
          </div>

      </CardBody>
    </Card>
  );
}
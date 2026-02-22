import { useNavigate, Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { Home, ArrowLeft, MapPinOff } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-appearance-in">
      <Helmet>
        <title>Page Not Found | Lamma</title>
      </Helmet>

      <div className="max-w-md w-full text-center relative z-10 p-8 rounded-[3rem] bg-white/40 dark:bg-[#0f0f11]/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_20px_60px_rgba(147,51,234,0.15)] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="flex justify-center mb-6">
          <div className="relative p-4 bg-purple-100 dark:bg-purple-500/20 rounded-full text-purple-600 dark:text-purple-400">
            <MapPinOff size={48} strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full"></div>
          </div>
        </div>

        <h1 className="text-7xl font-black mb-2 bg-linear-to-tr from-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Looks like you're lost!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onPress={() => navigate(-1)}
            variant="flat"
            color="default"
            startContent={<ArrowLeft size={18} />}
            className="w-full sm:w-auto font-bold bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200"
          >
            Go Back
          </Button>

          <Button
            as={Link}
            to="/"
            color="secondary"
            startContent={<Home size={18} />}
            className="w-full sm:w-auto font-bold bg-linear-to-tr from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 text-white border-none"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

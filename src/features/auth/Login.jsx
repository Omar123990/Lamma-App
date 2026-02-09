import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Input, Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../../context/AuthContext";

const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z.string()
    .min(1, "Password is required"),
});

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Checking credentials...");

    try {
      await loginUser(data);

      toast.dismiss(loadingToast);
      toast.success("Welcome back! 🚀", {
        duration: 3000,
        style: {
          backgroundImage: 'linear-gradient(to right, #9333ea, #db2777)',
          color: '#fff',
          fontWeight: 'bold',
          border: '1px solid rgba(255,255,255,0.2)',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#9333ea',
        }
      });

      navigate("/");

    } catch (error) {
      toast.dismiss(loadingToast);

      const errorMsg = typeof error === 'string' ? error : "Invalid email or password";
      toast.error(errorMsg + " ❌");

      setError("root", { message: errorMsg });
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

      <CardHeader className="flex flex-col gap-1 items-center justify-center pt-8 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-wider">Welcome Back 👋</h1>
        <p className="text-gray-400 text-sm">Please enter your details to sign in</p>
      </CardHeader>

      <CardBody className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

          {errors.root && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center font-medium animate-pulse">
              {errors.root.message}
            </div>
          )}

          <Input
            {...register("email")}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            variant="bordered"
            startContent={<Mail className="text-gray-400 pointer-events-none" size={20} />}
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white",
              label: "text-gray-300",
            }}
          />

          <div className="flex flex-col gap-2">
            <Input
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              label="Password"
              variant="bordered"
              placeholder="********"
              startContent={<Lock className="text-gray-400 pointer-events-none" size={20} />}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? <EyeOff className="text-2xl text-gray-400 pointer-events-none" /> : <Eye className="text-2xl text-gray-400 pointer-events-none" />}
                </button>
              }
              type={isVisible ? "text" : "password"}
              classNames={{
                inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
                input: "text-white",
                label: "text-gray-300",
              }}
            />

            <div className="flex justify-end">
              <Link href="#" size="sm" className="text-purple-300 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full bg-linear-to-r from-purple-600 to-pink-600 font-bold text-white shadow-lg shadow-purple-900/20"
            size="lg"
          >
            {isSubmitting ? "Signing in..." : "Log In"}
          </Button>

          <div className="flex justify-center gap-2 mt-4 text-sm text-gray-400">
            <span>Don't have an account?</span>
            <Link as={RouterLink} to="/register" className="text-pink-400 font-semibold cursor-pointer">
              Sign up
            </Link>
          </div>

        </form>
      </CardBody>
    </Card>
  );
}
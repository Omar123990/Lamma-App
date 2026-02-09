import { useState, useContext } from "react"; 
import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Input, Button, Card, CardBody, CardHeader, Link, RadioGroup, Radio } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff, User, Calendar } from "lucide-react";
import toast from "react-hot-toast";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../../context/AuthContext"; 

const registerSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should contain letters and spaces only"),
  
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format"),

  birthDate: z.string()
    .min(1, "Date of Birth is required")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      return date <= eighteenYearsAgo;
    }, { message: "You must be at least 18 years old" }),

  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select your gender" })
  }),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, 
      "Must include: 1 Uppercase, 1 Lowercase, 1 Number, 1 Symbol"),
  
  confirmPassword: z.string()
    .min(1, "Please confirm your password")

}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  
  const navigate = useNavigate();
  const { registerUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Creating your account...");
    
    try {
      const apiData = {
        name: data.name,
        email: data.email,
        password: data.password,
        rePassword: data.confirmPassword, 
        dateOfBirth: data.birthDate,      
        gender: data.gender
      };

      await registerUser(apiData);
      
      toast.dismiss(loadingToast);
      toast.success("Account created! 🎉 Please login.", {
        duration: 4000,
        style: {
          backgroundImage: 'linear-gradient(to right, #9333ea, #db2777)',
          color: '#fff',
          fontWeight: 'bold',
          border: '1px solid rgba(255,255,255,0.2)',
        },
        iconTheme: { primary: '#fff', secondary: '#db2777' },
      });
      
      navigate("/login");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(typeof error === 'string' ? error : "Something went wrong");
    }
  };

  return (
    <Card className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl my-10">
      <CardHeader className="flex flex-col gap-1 items-center justify-center pt-8 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-wider">Create Account 🚀</h1>
        <p className="text-gray-400 text-sm">Join the community today</p>
      </CardHeader>

      <CardBody className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          <Input
            {...register("name")}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            label="Full Name"
            placeholder="John Doe"
            variant="bordered"
            startContent={<User className="text-gray-400" size={20} />}
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white",
              label: "text-gray-300",
            }}
          />

          <Input
            {...register("email")}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            variant="bordered"
            startContent={<Mail className="text-gray-400" size={20} />}
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white",
              label: "text-gray-300",
            }}
          />

          <Input
            {...register("birthDate")}
            isInvalid={!!errors.birthDate}
            errorMessage={errors.birthDate?.message}
            type="date"
            label="Date of Birth"
            placeholder=" "
            variant="bordered"
            startContent={<Calendar className="text-gray-400" size={20} />}
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white [color-scheme:dark]",
              label: "text-gray-300",
            }}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Gender"
                orientation="horizontal"
                color="secondary"
                value={field.value}
                onValueChange={field.onChange}
                isInvalid={!!errors.gender}
                errorMessage={errors.gender?.message}
                classNames={{ label: "text-gray-300 text-sm", wrapper: "gap-6 mt-2" }}
              >
                <Radio value="male" classNames={{ label: "text-white" }}>Male</Radio>
                <Radio value="female" classNames={{ label: "text-white" }}>Female</Radio>
              </RadioGroup>
            )}
          />

          <Input
            {...register("password")}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            label="Password"
            variant="bordered"
            placeholder="********"
            startContent={<Lock className="text-gray-400" size={20} />}
            endContent={
              <button type="button" onClick={() => setIsVisiblePass(!isVisiblePass)}>
                {isVisiblePass ? <EyeOff className="text-gray-400" /> : <Eye className="text-gray-400" />}
              </button>
            }
            type={isVisiblePass ? "text" : "password"}
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white",
              label: "text-gray-300",
            }}
          />

          <Input
            {...register("confirmPassword")}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            label="Confirm Password"
            variant="bordered"
            placeholder="********"
            startContent={<Lock className="text-gray-400" size={20} />}
            endContent={
              <button type="button" onClick={() => setIsVisibleConfirm(!isVisibleConfirm)}>
                {isVisibleConfirm ? <EyeOff className="text-gray-400" /> : <Eye className="text-gray-400" />}
              </button>
            }
            type={isVisibleConfirm ? "text" : "password"}
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white",
              label: "text-gray-300",
            }}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full bg-linear-to-r from-pink-600 to-purple-600 font-bold text-white shadow-lg mt-4"
            size="lg"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>

          <div className="flex justify-center gap-2 mt-2 text-sm text-gray-400">
            <span>Already have an account?</span>
            <Link as={RouterLink} to="/login" className="text-pink-400 font-semibold cursor-pointer">
              Login
            </Link>
          </div>

        </form>
      </CardBody>
    </Card>
  );
}
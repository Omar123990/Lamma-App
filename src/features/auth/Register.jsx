import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Input, Button, Card, CardBody, CardHeader, Link, RadioGroup, Radio } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff, User, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../../services/authAPI";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").regex(/^[a-zA-Z\s]+$/, "Letters only"),
  email: z.string().email("Invalid email format"),
  birthDate: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return date <= eighteenYearsAgo;
  }, { message: "You must be at least 18 years old" }),
  gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Select gender" }) }),
  password: z.string().min(8, "Min 8 chars").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "Weak password"),
  confirmPassword: z.string().min(1, "Confirm password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(registerSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signupUser,

    onSuccess: (data) => {
      toast.success("Account created successfully! 🎉");
      navigate("/login");
    },

    onError: (error) => {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
    }
  });

  const onSubmit = (data) => {
    const apiData = {
      name: data.name,
      email: data.email,
      password: data.password,
      rePassword: data.confirmPassword,
      dateOfBirth: data.birthDate,
      gender: data.gender
    };
    mutate(apiData);
    console.log(data);
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
            variant="bordered"
            startContent={<User className="text-gray-400" size={20} />}
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white",
              label: "text-gray-300"
            }}
          />

          <Input
            {...register("email")}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            label="Email Address"
            variant="bordered"
            type="email"
            startContent={<Mail className="text-gray-400" size={20} />}
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white",
              label: "text-gray-300"
            }}
          />

          <Input
            {...register("birthDate")}
            type="date"
            isInvalid={!!errors.birthDate}
            errorMessage={errors.birthDate?.message}
            label="Date of Birth"
            variant="bordered"
            startContent={<Calendar className="text-gray-400" size={20} />}
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white [color-scheme:dark]",
              label: "text-gray-300"
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
                classNames={{ label: "text-gray-300 text-sm ml-1" }}
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
            type={isVisiblePass ? "text" : "password"}
            variant="bordered"
            startContent={<Lock className="text-gray-400" size={20} />}
            endContent={
              <button type="button" onClick={() => setIsVisiblePass(!isVisiblePass)}>
                {isVisiblePass ? <EyeOff className="text-gray-400" /> : <Eye className="text-gray-400" />}
              </button>
            }
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white",
              label: "text-gray-300"
            }}
          />

          <Input
            {...register("confirmPassword")}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            label="Confirm Password"
            type={isVisibleConfirm ? "text" : "password"}
            variant="bordered"
            startContent={<Lock className="text-gray-400" size={20} />}
            endContent={
              <button type="button" onClick={() => setIsVisibleConfirm(!isVisibleConfirm)}>
                {isVisibleConfirm ? <EyeOff className="text-gray-400" /> : <Eye className="text-gray-400" />}
              </button>
            }
            classNames={{
              inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-purple-500",
              input: "text-white",
              label: "text-gray-300"
            }}
          />

          <Button
            type="submit"
            isLoading={isPending}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 font-bold text-white shadow-lg mt-4"
            size="lg"
          >
            {isPending ? "Creating Account..." : "Sign Up Now 🚀"}
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
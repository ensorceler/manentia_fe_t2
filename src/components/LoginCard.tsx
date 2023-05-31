"use client";
import { Button } from "@/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/Card";
import { Input } from "@/ui/Input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "@/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/ui/Alert";
import { CheckIcon, Terminal } from "lucide-react";
import AlertModal from "./AlertModal";
import { Toaster, toast } from "react-hot-toast";
import { setCookieToken } from "@/utils/serverAction";

const loginSchema = z.object({
  username: z.string().min(1, { message: "username is required" }),
  password: z.string().min(1, { message: "password is required" }),
});

const loginUser = async (url: string, { arg }: any) => {
  try {
    const res = await axios.post("https://dummyjson.com/auth/login", {
      username: arg.username,
      password: arg.password,
    });
    return res;
  } catch (err: any) {
    return err;
  }
};

const LoginCard = () => {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation("api/login", loginUser);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    // login request
    const result = await trigger(data);

    if (result?.status === 200) {
      toast.success("Logged In, Redirecting to Products Page!");
      setCookieToken(result?.data?.token);
      setTimeout(() => {
        router.push("/products");
      }, 3000);
    } else {
      console.log("not logged in");
      toast.error("Wrong Credentials, Try again!!!");
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Credentials from dummyjson</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="email"
                placeholder="Enter your username"
                {...register("username")}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="password">Password </Label>
              <Input
                id="password"
                placeholder="Enter your password"
                {...register("password")}
              />
            </div>
            <Button>
              {isMutating ? (
                <LoaderIcon className="text-white h-6 w-6 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {showModal && (
        <AlertModal>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <CheckIcon className="text-green-500" />
              <p className="text-center">Successfully Logged-In</p>
            </div>
            <p className="text-center">
              you are going to be redirected to Products Page
            </p>
          </div>
        </AlertModal>
      )}
      <Toaster />
    </div>
  );
};

export default LoginCard;

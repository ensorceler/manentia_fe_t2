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
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "@/ui/icons";
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

  const [loginState, setLoginState] = useState({
    username: "",
    password: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const fillCredentials = () => {
    setLoginState({
      username: "vcholdcroftg",
      password: "mSPzYZfR",
    });
  };

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
          <CardDescription>
            <Button
              onClick={fillCredentials}
              variant="secondary"
              className="py-0 text-sm px-3 rounded-lg active:scale-95"
            >
              <p className="text-xs">Use me to fill the credentials</p>
            </Button>
          </CardDescription>
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
                value={loginState.username}
                onChange={(e) => {
                  setLoginState((p) => ({ ...p, username: e.target.value }));
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="password">Password </Label>
              <Input
                id="password"
                placeholder="Enter your password"
                {...register("password")}
                value={loginState.password}
                onChange={(e) => {
                  setLoginState((p) => ({ ...p, password: e.target.value }));
                }}
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
      <Toaster />
    </div>
  );
};

export default LoginCard;

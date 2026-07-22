"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
  confirmPassword: z.string().min(1, { message: "Password is required" }),
})
.refine((data) => data.password === data.confirmPassword,{
  message:"Passwords don't match",
  path:["confirmPassword"]
});

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      email: "",
      password: "",
      confirmPassword:"",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
      },
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      <Card className="bg-[#F8F5EF] border-[3.5px] border-[#412D15] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),6px_6px_0px_0px_#412D15] rounded-[24px] overflow-hidden p-0 w-full hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#412D15] transition-all duration-300">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-10 flex flex-col justify-center">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-3xl font-extrabold text-[#1F150C] tracking-tight leading-none">
                    Let&apos;s get started
                  </h1>
                  <p className="text-[#6B5C4C] text-sm font-semibold text-balance mt-2">
                    Create your account
                  </p>
                </div>
                
                {/* Name */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-y-1">
                        <FormLabel className="font-extrabold text-sm text-[#1F150C] tracking-tight">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Rohan Raj"
                            {...field}
                            className="h-10 bg-[#F5F1E8] border-2 border-[#412D15]/30 focus:border-[#412D15] rounded-xl text-[#1F150C] placeholder:text-[#6B5C4C]/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-[#412D15]/20 focus-visible:ring-offset-0 transition-all duration-200 w-full px-3.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Email */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-y-1">
                        <FormLabel className="font-extrabold text-sm text-[#1F150C] tracking-tight">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                            className="h-10 bg-[#F5F1E8] border-2 border-[#412D15]/30 focus:border-[#412D15] rounded-xl text-[#1F150C] placeholder:text-[#6B5C4C]/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-[#412D15]/20 focus-visible:ring-offset-0 transition-all duration-200 w-full px-3.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-y-1">
                        <FormLabel className="font-extrabold text-sm text-[#1F150C] tracking-tight">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                            className="h-10 bg-[#F5F1E8] border-2 border-[#412D15]/30 focus:border-[#412D15] rounded-xl text-[#1F150C] placeholder:text-[#6B5C4C]/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-[#412D15]/20 focus-visible:ring-offset-0 transition-all duration-200 w-full px-3.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-y-1">
                        <FormLabel className="font-extrabold text-sm text-[#1F150C] tracking-tight">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                            className="h-10 bg-[#F5F1E8] border-2 border-[#412D15]/30 focus:border-[#412D15] rounded-xl text-[#1F150C] placeholder:text-[#6B5C4C]/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-[#412D15]/20 focus-visible:ring-offset-0 transition-all duration-200 w-full px-3.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Error Banner */}
                {!!error && (
                  <Alert className="bg-[#B54747]/10 border-2 border-[#B54747]/30 text-[#B54747] font-semibold rounded-xl flex items-center gap-x-2">
                    <OctagonAlertIcon className="h-4 w-4 shrink-0 !text-[#B54747]" />
                    <AlertTitle className="m-0 leading-none">{error}</AlertTitle>
                  </Alert>
                )}

                <Button 
                  disabled={pending}
                  type="submit" 
                  className="w-full bg-[#412D15] hover:bg-[#523d24] text-[#F5F1E8] border-2 border-[#412D15] shadow-[2.5px_2.5px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] rounded-xl font-bold transition-all duration-150 cursor-pointer h-10 flex items-center justify-center text-sm"
                >
                  Sign up
                </Button>

                <div className="after:border-[#412D15]/15 relative text-center text-xs font-extrabold uppercase tracking-wider after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t my-1 select-none">
                  <span className="bg-[#F8F5EF] text-[#6B5C4C] relative z-10 px-3">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    disabled={pending}
                    onClick={() => onSocial("google")}
                    variant="outline" 
                    type="button"
                    className="w-full bg-[#F5F1E8] hover:bg-[#D8D1BE] text-[#1F150C] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] rounded-xl font-bold transition-all duration-150 cursor-pointer h-10 flex items-center justify-center gap-x-2 text-sm"
                  >
                    <FaGoogle className="size-4 text-[#1F150C]" />
                    Google
                  </Button>
                  <Button 
                    disabled={pending}
                    onClick={() => onSocial("github")}
                    variant="outline" 
                    type="button" 
                    className="w-full bg-[#F5F1E8] hover:bg-[#D8D1BE] text-[#1F150C] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] rounded-xl font-bold transition-all duration-150 cursor-pointer h-10 flex items-center justify-center gap-x-2 text-sm"
                  >
                    <FaGithub className="size-4 text-[#1F150C]" />
                    GitHub
                  </Button>
                </div>
                
                <div className="text-center text-sm font-semibold text-[#6B5C4C]">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="font-extrabold text-[#412D15] hover:underline decoration-2 decoration-[#412D15] underline-offset-4 transition-all duration-150"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-[#F5F1E8] to-[#E1DCC9] border-l-[3.5px] border-[#412D15] relative hidden md:flex flex-col gap-y-5 items-center justify-center p-8 select-none">
            <div className="absolute inset-0 bg-[#412D15]/5 pointer-events-none" />
            <img 
              src="/logo.svg" 
              alt="Vanni AI Logo" 
              className="h-[104px] w-[104px] hover:scale-105 transition-transform duration-300 drop-shadow-[4px_4px_0px_#412D15] border-[3px] border-[#412D15] rounded-full p-2 bg-[#F8F5EF]" 
            />
            <p className="text-3xl font-extrabold text-[#1F150C] tracking-tight leading-none">
              Vanni.AI
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-[#6B5C4C] text-xs font-semibold text-center mt-1.5 select-none leading-relaxed *:[a]:text-[#1F150C] *:[a]:font-bold *:[a]:underline *:[a]:underline-offset-4 *:[a]:decoration-[#412D15]/30 *:[a]:hover:decoration-[#412D15] *:[a]:transition-colors">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
};

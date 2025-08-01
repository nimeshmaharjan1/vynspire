"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth/use-auth.store";
import type { authSuccessResponseType } from "@/types/response.types";
import { loginSchema, type loginSchemaType } from "./_schema";
import { login } from "./_service";

function LoginPage() {
	const loginForm = useForm<loginSchemaType>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const router = useRouter();
	const loginMutation = useMutation<
		authSuccessResponseType,
		AxiosError<{
			error?: string;
		}>,
		loginSchemaType
	>({
		mutationFn: (payload: loginSchemaType) => login(payload),
		onSuccess: (data) => {
			useAuthStore.getState().login(data.token, data.user);
			router.replace("/");
		},
	});
	return (
		<div className={cn("flex flex-col gap-6")}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...loginForm}>
						<form
							onSubmit={loginForm.handleSubmit((values) =>
								loginMutation.mutate(values),
							)}
						>
							<div className="grid gap-6">
								<div className="grid gap-6">
									{loginMutation.isError && (
										<Alert variant="destructive">
											<AlertCircleIcon />
											<AlertTitle>
												{loginMutation.error?.response?.data?.error}
											</AlertTitle>
										</Alert>
									)}
									<div className="grid gap-3">
										<FormField
											control={loginForm.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															placeholder="m@example.com"
															type="email"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-3">
										<FormField
											control={loginForm.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<div className="flex items-center">
														<FormLabel>Password</FormLabel>
														<a
															href="#"
															className="ml-auto text-sm underline-offset-4 hover:underline"
														>
															Forgot your password?
														</a>
													</div>
													<FormControl>
														<PasswordInput placeholder="*********" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<Button
										loading={loginMutation.isPending}
										type="submit"
										className="w-full"
									>
										Login
									</Button>
								</div>
								<div className="text-center text-sm">
									Don&apos;t have an account?{" "}
									<Link
										href="register"
										className="underline underline-offset-4"
									>
										Sign up
									</Link>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
				and <a href="#">Privacy Policy</a>.
			</div>
		</div>
	);
}
export default LoginPage;

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { registerSchema, type registerSchemaType } from "./_schema";
import { register } from "./_service";

function RegisterPage() {
	const form = useForm<registerSchemaType>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			user_name: "",
		},
	});
	const router = useRouter();
	const registerMutation = useMutation<
		authSuccessResponseType,
		AxiosError<{
			error?: string;
		}>,
		registerSchemaType
	>({
		mutationFn: (payload) => register(payload),
		onSuccess: (data) => {
			toast.success("Registration successful logging you in");
			useAuthStore.getState().login(data.token, data.user);
			router.replace("/");
		},
	});
	return (
		<div className={cn("flex flex-col gap-6")}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Create an Account</CardTitle>
					<CardDescription>Enter your details below to sign up</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit((values) =>
								registerMutation.mutate(values),
							)}
						>
							<div className="grid gap-6">
								<div className="grid gap-6">
									{registerMutation.isError && (
										<Alert variant="destructive">
											<AlertCircleIcon />
											<AlertTitle>
												{registerMutation.error?.response?.data?.error}
											</AlertTitle>
										</Alert>
									)}
									<div className="grid gap-3">
										<FormField
											control={form.control}
											name="user_name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Full Name</FormLabel>
													<FormControl>
														<Input placeholder="John Doe" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-3">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															id="email"
															type="email"
															placeholder="m@example.com"
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
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password</FormLabel>
													<FormControl>
														<PasswordInput id="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<Button
										disabled={registerMutation.isPending}
										type="submit"
										className="w-full"
									>
										{registerMutation.isPending && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										Sign Up
									</Button>
								</div>
								<div className="text-center text-sm">
									Already have an account?{" "}
									<Link href="login" className="underline underline-offset-4">
										Log In
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
export default RegisterPage;

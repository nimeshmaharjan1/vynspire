import type { Metadata } from "next";
import type { FC, PropsWithChildren } from "react";

export const metadata: Metadata = {
	title: "Login | Vynspire AI",
};

const LoginLayout: FC<PropsWithChildren> = (props) => {
	return props.children;
};

export default LoginLayout;

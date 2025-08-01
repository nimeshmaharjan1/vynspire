import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const { email, password, user_name } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required." },
				{ status: 400 },
			);
		}

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists." },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				user_name,
			},
		});

		const token = jwt.sign(
			{ userId: user.id, email: user.email, user_name: user.user_name },
			process.env.JWT_SECRET ?? "",
			{ expiresIn: "7d" },
		);
		(user as any).password = undefined;
		return NextResponse.json({ token, user }, { status: 201 });
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

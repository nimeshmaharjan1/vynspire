import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required." },
				{ status: 400 },
			);
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return NextResponse.json(
				{ error: "Invalid credentials." },
				{ status: 401 },
			);
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET ?? "", {
			expiresIn: "7d",
		});

		return NextResponse.json({ token, user }, { status: 200 });
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

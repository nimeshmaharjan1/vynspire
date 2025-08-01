import bcrypt from "bcrypt";
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

		// Check if the user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists." },
				{ status: 400 },
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user in the database
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		return NextResponse.json(user, { status: 201 });
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.error();
	}
}

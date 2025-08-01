import jwt from "jsonwebtoken";

export function getUserFromToken(req: Request) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader) return null;

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");
		return decoded as { userId: string };
	} catch {
		return null;
	}
}

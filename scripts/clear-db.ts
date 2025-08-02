// scripts/clear-db.ts

import { prisma } from "@/lib/prisma";

async function main() {
	await prisma.post.deleteMany({});
	await prisma.user.deleteMany({});
	console.log("Database cleared.");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});

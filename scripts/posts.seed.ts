import { prisma } from "@/lib/prisma";

async function main() {
	const authorId = "cmdu5tivf0003p93g4uip3gxe"; // replace with valid userId

	// 1. Delete all existing posts
	await prisma.post.deleteMany();

	// 2. Seed 50 new posts
	const sampleContent = `<h1 class="heading-node">Why TypeScript?</h1> <p class="text-node">TypeScript enhances JavaScript by adding static typing, giving developers the power to catch errors at compile time rather than during runtime. This early feedback loop makes codebases more predictable, easier to refactor, and significantly more maintainable over time. Teams that adopt TypeScript often find that it improves both onboarding for new developers and long-term scalability for growing applications.</p> <h2 class="heading-node">Mastering Advanced Patterns</h2> <p class="text-node">As projects evolve, developers often encounter complex data structures, conditional logic, and patterns that are difficult to model with plain JavaScript. TypeScript offers powerful features that address these challenges head-on.</p> <p class="text-node">One such feature is <strong>discriminated unions</strong>, which are ideal for modeling related object types that differ in structure but share a common field. For example, when handling API responses that vary based on a status field, discriminated unions make it easier to narrow types and handle edge cases safely.</p> <p class="text-node"><strong>Mapped types</strong> provide a mechanism for creating new types based on existing ones. They enable developers to apply transformations across properties—such as making all fields optional or readonly—without duplicating the shape manually.</p> <p class="text-node"><strong>Conditional types</strong> introduce logic into type definitions, allowing types to change based on input. This is extremely useful for generic libraries, where you want flexible APIs that still offer precise type safety depending on how they're used.</p> <p class="text-node">By mastering these advanced features, developers gain confidence in the reliability of their code. Combined with intelligent tooling and strong editor support, TypeScript becomes more than just a type system—it becomes a development experience that promotes clarity, scalability, and long-term success.</p>`;

	const categories = ["Development", "Programming", "Design", "Security"];
	const tagsList = [
		["React", "Next.js"],
		["TypeScript", "JavaScript"],
		["Tailwind", "UI/UX"],
		["API", "Security"],
	];

	const posts = Array.from({ length: 50 }, (_, i) => ({
		title: `Post ${i + 1}`,
		excerpt: `This is a summary of post ${i + 1} about web development concepts.`,
		content: sampleContent,
		category: categories[i % categories.length],
		tags: tagsList[i % tagsList.length],
		readTime: `${3 + (i % 5)} min read`,
		image: `https://placehold.co/600x400?text=Post+${i + 1}`,
		authorId,
		published: true,
		publishedAt: new Date(),
	}));

	await prisma.post.createMany({ data: posts });

	console.log("✅ Cleared existing posts and seeded 50 new ones.");
}

main()
	.catch((e) => {
		console.error("❌ Seed failed:", e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());

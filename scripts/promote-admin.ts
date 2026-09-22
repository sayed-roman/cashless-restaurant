import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function promote() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !email.includes("@"))
    throw new Error("Usage: npm run admin:promote -- your-email");
  const user = await db.user.findUnique({ where: { email } });
  if (!user)
    throw new Error("Register this account first, then run the command again.");
  await db.user.update({ where: { id: user.id }, data: { role: "admin" } });
  console.log("Administrator role granted to the existing account.");
}
promote()
  .catch(() => {
    console.error(
      "Promotion failed. Check the account email and database connection.",
    );
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());

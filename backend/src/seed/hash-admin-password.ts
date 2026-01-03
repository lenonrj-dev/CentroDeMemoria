import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2];
  if (!password) {
    // eslint-disable-next-line no-console
    console.log("Uso: npm run hash -- <senha>");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  // eslint-disable-next-line no-console
  console.log(hash);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});


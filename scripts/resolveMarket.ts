import { resolveMarket } from "@/lib/resolveMarket";


const main = async () => {

    await resolveMarket();
}

// Execute the function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
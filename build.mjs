// Builds index.html (the Vercel page) from src/rd.html with the logo and starter data embedded.
import { readFileSync, writeFileSync } from "node:fs";
import { SEED_PRODUCTS } from "./api/_seed.js";

const src = readFileSync("src/rd.html", "utf8");
const logo = readFileSync("src/assets/pos360-logo-white-only.png").toString("base64");
const body = src
  .replace("__LOGO__", "data:image/png;base64," + logo)
  .replace("__SEED__", JSON.stringify(SEED_PRODUCTS));
new Function(body.split("<script>")[1].split("</script>")[0]); // syntax check

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Product R&amp;D Board</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
${body}
</body>
</html>
`;
writeFileSync("index.html", page);
console.log("Built index.html");

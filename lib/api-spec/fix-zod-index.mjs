import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(__dirname, "..", "api-zod", "src", "index.ts");

const content = readFileSync(indexPath, "utf8");
const fixed = content
  .split("\n")
  .filter((line) => !line.includes('"./generated/types"'))
  .join("\n");

if (content !== fixed) {
  writeFileSync(indexPath, fixed);
  console.log("Patched api-zod index.ts to drop generated/types re-export");
}

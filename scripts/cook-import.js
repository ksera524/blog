const fs = require("fs");
const path = require("path");
const { getProvider } = require("./recipes");

function usage() {
  console.log("Usage: npm run cook:import -- <recipe-url>");
}

function sanitizeFilename(value) {
  return value
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniquePath(baseDir, filename) {
  let attempt = 0;
  let output = path.join(baseDir, filename);
  while (fs.existsSync(output)) {
    attempt += 1;
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    output = path.join(baseDir, `${name}-${attempt}${ext}`);
  }
  return output;
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; cook-import/1.0)"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }
  return response.text();
}

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((arg) => !arg.startsWith("--"));
  if (!url) {
    usage();
    process.exit(1);
  }

  const provider = getProvider(url);
  if (!provider) {
    console.error("Unsupported recipe site.");
    process.exit(1);
  }

  const html = await fetchHtml(url);
  const { title, description, ingredients, steps } = provider.parse(html);

  if (!title || !ingredients?.length || !steps?.length) {
    console.error("Failed to extract recipe data.");
    process.exit(1);
  }

  const slug = sanitizeFilename(title) || `recipe-${Date.now()}`;
  const outputDir = path.join(process.cwd(), "content", "cook");
  fs.mkdirSync(outputDir, { recursive: true });

  const filePath = uniquePath(outputDir, `${slug}.md`);
  const now = new Date().toISOString();

  const frontMatter = [
    "---",
    `title: "${title.replace(/"/g, "\\\"")}"`,
    `date: ${now}`,
    "draft: true",
    "description: \"\"",
    "categories: [\"レシピ\"]",
    `tags: [${ingredients.map((item) => `\"${item.replace(/"/g, "\\\"")}\"`).join(", ")}]`,
    `source: \"${url}\"`,
    "---",
    ""
  ].join("\n");

  const body = [
    description ? `> ${description}` : "",
    "",
    "## 材料",
    "",
    ...ingredients.map((item) => `- ${item}`),
    "",
    "## 手順",
    "",
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    `参照: ${url}`,
    ""
  ].join("\n");

  fs.writeFileSync(filePath, `${frontMatter}\n${body}`, "utf8");
  console.log(`Cook draft created: ${filePath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

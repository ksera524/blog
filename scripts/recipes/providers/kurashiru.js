const cheerio = require("cheerio");

function canHandle(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "www.kurashiru.com";
  } catch {
    return false;
  }
}

function extractRecipeFromJsonLd(html) {
  const scriptRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const matches = html.matchAll(scriptRegex);
  for (const match of matches) {
    const raw = match[1].trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const candidates = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of candidates) {
        const typeValue = item["@type"];
        const types = Array.isArray(typeValue) ? typeValue : [typeValue];
        if (types.includes("Recipe")) return item;
      }
    } catch {
      continue;
    }
  }
  return null;
}

function normalizeInstructions(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((step) => {
        if (typeof step === "string") return step;
        if (step.text) return step.text;
        if (step.itemListElement) {
          return normalizeInstructions(step.itemListElement).join("\n");
        }
        return "";
      })
      .flatMap((value) => value.split("\n"))
      .map((value) => value.trim())
      .filter(Boolean);
  }
  if (typeof raw === "string") return [raw.trim()].filter(Boolean);
  if (raw.itemListElement) return normalizeInstructions(raw.itemListElement);
  return [];
}

function parse(html) {
  const recipeJson = extractRecipeFromJsonLd(html);
  if (recipeJson) {
    const title = recipeJson.name?.trim();
    const description = recipeJson.description?.trim() || "";
    const ingredients = (recipeJson.recipeIngredient || [])
      .map((item) => String(item).trim())
      .filter(Boolean);
    const steps = normalizeInstructions(recipeJson.recipeInstructions);
    if (title && ingredients.length && steps.length) {
      return { title, description, ingredients, steps };
    }
  }

  const $ = cheerio.load(html);
  const rawTitle = $("h1").first().text().trim();
  const title = rawTitle.replace(/\s*レシピ・作り方$/, "").trim();

  const ingredients = [];
  $("h2").each((_, el) => {
    const heading = $(el).text().trim();
    if (!heading.includes("材料")) return;
    const list = $(el).nextAll("ul,ol").first();
    list.find("li").each((__, li) => {
      const text = $(li).text().replace(/\s+/g, " ").trim();
      if (text) ingredients.push(text);
    });
  });

  const steps = [];
  $("h2").each((_, el) => {
    const heading = $(el).text().trim();
    if (!heading.includes("手順")) return;
    const list = $(el).nextAll("ol,ul").first();
    list.find("li").each((__, li) => {
      const text = $(li).text().replace(/\s+/g, " ").trim();
      if (text) steps.push(text);
    });
  });

  return { title, description: "", ingredients, steps };
}

module.exports = {
  canHandle,
  parse
};

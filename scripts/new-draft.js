const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const title = args.find((arg) => !arg.startsWith("--")) || "Untitled";
const sectionArg = args.find((arg) => arg.startsWith("--section="));
const section = sectionArg ? sectionArg.split("=")[1] : "tech";

const now = new Date();
const iso = now.toISOString();
const timestamp = iso.replace(/[-:]/g, "").slice(0, 13).replace("T", "-");

function slugify(value) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return cleaned || `draft-${timestamp}`;
}

const slug = slugify(title);
const dir = path.join(process.cwd(), "content", section);
const filePath = path.join(dir, `${slug}.md`);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

const template = `---
title: "${title}"
date: ${iso}
draft: true
description: ""
categories: []
tags: []
---

`;

fs.writeFileSync(filePath, template, "utf8");
console.log(`Draft created: ${filePath}`);

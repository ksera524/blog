function stripHtml(input) {
  return String(input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = class {
  data() {
    return {
      permalink: "/search.json",
      eleventyExcludeFromCollections: true
    };
  }

  render(data) {
    const items = data.collections?.tech || [];

    const payload = items.map((post) => ({
      id: post.url,
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: post.date,
      categories: post.data.categories || [],
      tags: post.data.tags || [],
      section: post.data.section || "",
      content: stripHtml(post.templateContent)
    }));

    return JSON.stringify(payload);
  }
};

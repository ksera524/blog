(() => {
  const roots = Array.from(document.querySelectorAll("[data-search-root]"));
  if (!roots.length) return;

  const indexUrl = "/search.json";
  const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  function uniqueValues(values) {
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "ja"));
  }

  function selectedValues(container, selector) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(selector))
      .filter((inputItem) => inputItem.checked)
      .map((inputItem) => inputItem.value);
  }

  function applyCategoryFilter(items, categories) {
    if (!categories.length) return items;
    return items.filter((item) =>
      categories.every((category) =>
        (item.categories || []).includes(category)
      )
    );
  }

  function applyTagFilter(items, tags) {
    if (!tags.length) return items;
    return items.filter((item) =>
      tags.every((tag) => (item.tags || []).includes(tag))
    );
  }

  function applySectionFilter(items, sections) {
    if (!sections.length) return items;
    return items.filter((item) => sections.includes(item.section));
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return dateFormatter.format(date);
  }

  function renderResults(container, items) {
    const { summaryEl, resultsEl } = container;
    const visible = items.slice(0, 30);
    summaryEl.textContent = `検索結果: ${items.length}件`;
    resultsEl.innerHTML = "";

    if (!visible.length) {
      const empty = document.createElement("p");
      empty.textContent = "該当する記事がありません。";
      resultsEl.appendChild(empty);
      return;
    }

    visible.forEach((item) => {
      const article = document.createElement("article");
      article.className = "post-card";

      const meta = document.createElement("p");
      meta.className = "post-card__meta";
      meta.textContent = formatDate(item.date);

      const title = document.createElement("h2");
      title.className = "post-card__title";
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = item.title;
      title.appendChild(link);

      const summary = document.createElement("p");
      summary.className = "post-card__summary";
      summary.textContent = item.description || "";

      article.appendChild(meta);
      article.appendChild(title);
      if (item.description) article.appendChild(summary);

      resultsEl.appendChild(article);
    });
  }

  function updateUrl(query, sections, categories, tags) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (sections.length) params.set("sec", sections.join(","));
    if (categories.length) params.set("cat", categories.join(","));
    if (tags.length) params.set("tag", tags.join(","));
    const queryString = params.toString();
    const url = queryString ? `${location.pathname}?${queryString}` : location.pathname;
    history.replaceState(null, "", url);
  }

  function renderCheckboxes(container, values, selected, dataAttr) {
    if (!container) return;
    container.innerHTML = "";
    values.forEach((value) => {
      const label = document.createElement("label");
      label.className = "chip";
      const inputItem = document.createElement("input");
      inputItem.type = "checkbox";
      inputItem.value = value;
      inputItem.checked = selected.includes(value);
      inputItem.setAttribute(dataAttr, "");
      const span = document.createElement("span");
      span.textContent = value;
      label.appendChild(inputItem);
      label.appendChild(span);
      container.appendChild(label);
    });
  }

  if (!window.MiniSearch) {
    roots.forEach((root) => {
      const summaryEl = root.querySelector("[data-search-summary]");
      if (summaryEl) summaryEl.textContent = "検索ライブラリが読み込めませんでした。";
    });
    return;
  }

  fetch(indexUrl)
    .then((response) => response.json())
    .then((documents) => {
      const miniSearch = new window.MiniSearch({
        fields: ["title", "description", "content", "categories", "tags"],
        storeFields: ["title", "description", "date", "url", "categories"]
      });
      miniSearch.addAll(documents);
      const documentMap = new Map(documents.map((doc) => [doc.id, doc]));

      const params = new URLSearchParams(location.search);
      const initialQuery = params.get("q") || "";
      const initialSections = (params.get("sec") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const initialCategories = (params.get("cat") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const initialTags = (params.get("tag") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const allSections = uniqueValues(documents.map((doc) => doc.section).filter(Boolean));
      const defaultSections = initialSections.length ? initialSections : allSections;

      roots.forEach((root) => {
        const input = root.querySelector("[data-search-input]");
        const sectionOptions = root.querySelector("[data-search-section-options]");
        const categoryOptions = root.querySelector("[data-search-category-options]");
        const tagOptions = root.querySelector("[data-search-tag-options]");
        const resultsEl = root.querySelector("[data-search-results]");
        const summaryEl = root.querySelector("[data-search-summary]");

        if (!resultsEl || !summaryEl) return;

        if (input) input.value = initialQuery;
        renderCheckboxes(sectionOptions, allSections, defaultSections, "data-search-section");

        const runSearch = () => {
          const query = input ? input.value.trim() : "";
          const selectedSections = selectedValues(sectionOptions, "[data-search-section]");
          const availableDocs = applySectionFilter(documents, selectedSections);
          const availableCategories = uniqueValues(
            availableDocs.flatMap((doc) => doc.categories || [])
          );

          const selectedCategories = selectedValues(
            categoryOptions,
            "[data-search-category]"
          ).filter((value) => availableCategories.includes(value));

          renderCheckboxes(
            categoryOptions,
            availableCategories,
            selectedCategories,
            "data-search-category"
          );

          const categoryFilteredDocs = applyCategoryFilter(
            availableDocs,
            selectedCategories
          );
          const availableTags = uniqueValues(
            categoryFilteredDocs.flatMap((doc) => doc.tags || [])
          );

          const selectedTags = selectedValues(tagOptions, "[data-search-tag]").filter(
            (value) => availableTags.includes(value)
          );

          renderCheckboxes(
            tagOptions,
            availableTags,
            selectedTags,
            "data-search-tag"
          );

          const rawResults = query
            ? miniSearch.search(query, { prefix: true })
            : documents.map((doc) => ({ ...doc, score: 1 }));

          const normalized = rawResults.map((result) =>
            documentMap.get(result.id) || result
          );

          const filtered = applyTagFilter(
            applyCategoryFilter(
              applySectionFilter(normalized, selectedSections),
              selectedCategories
            ),
            selectedTags
          ).sort((a, b) => new Date(b.date) - new Date(a.date));

          updateUrl(query, selectedSections, selectedCategories, selectedTags);
          renderResults({ summaryEl, resultsEl }, filtered);
        };

        if (input) input.addEventListener("input", runSearch);
        if (sectionOptions) sectionOptions.addEventListener("change", runSearch);
        if (categoryOptions) categoryOptions.addEventListener("change", runSearch);
        if (tagOptions) tagOptions.addEventListener("change", runSearch);

        runSearch();
      });
    })
    .catch(() => {
      roots.forEach((root) => {
        const summaryEl = root.querySelector("[data-search-summary]");
        if (summaryEl) summaryEl.textContent = "検索インデックスの読み込みに失敗しました。";
      });
    });
})();

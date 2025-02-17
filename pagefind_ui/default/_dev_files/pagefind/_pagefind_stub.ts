// This is a Pagefind testing stub that needs to be updated if coupled_search is changed

import type PagefindExports from "../../../../pagefind_web_js/types/index.js";

const asyncSleep = async (ms = 100) => {
  return new Promise((r) => setTimeout(r, ms));
};

const get_a_word = () => {
  const words = [
    "cat",
    "antelope",
    "human",
    "question",
    "slow",
    "glass",
    "being",
    "sun",
    "single",
    "settle",
    "ghost",
    "paradise",
    "young",
    "rock",
    "treat",
  ];
  return words[Math.floor(Math.random() * words.length)];
};

const get_locations = () => {
  const locs: number[] = [];
  for (let i = 0; i < Math.ceil(Math.random() * 10); i += 1) {
    locs.push(Math.ceil(Math.random() * 10));
  }

  return locs;
};

const get_subs = (term, title, url, words) => {
  const subs: PagefindSubResult[] = [];

  if (/r/.test(term) || !/d/.test(term)) {
    subs.push({
      title,
      url,
      locations: [1, 2, 3],
      excerpt: words.slice(0, 4).join(" "),
    });
  }

  if (/d/.test(term)) {
    const sub_count = Math.ceil(Math.random() * 10);
    const sub_locs: number[][] = [];
    for (let i = 0; i < sub_count; i += 1) {
      sub_locs.push(get_locations());
    }
    const sub_counts = sub_locs.map((s) => s.length);

    for (let i = 1; i <= sub_count; i += 1) {
      const locs = sub_locs[i - 1];
      subs.push({
        title: `${i}/${sub_count}: ${get_a_word()} ${get_a_word()} ${get_a_word()}`,
        url: `${url}#${get_a_word()}-${i}`,
        locations: locs,
        excerpt:
          words
            .slice(
              Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 10) + 10
            )
            .join(" ") + ` [${locs.length} hit/s — within ${sub_counts}]`,
      });
    }
  }

  return subs;
};

const stub_results = (term): PagefindSearchResult[] => {
  const results: PagefindSearchResult[] = [];
  const num_results = Math.floor(Math.random() * 20) + 1;

  for (let i = 0; i < num_results; i += 1) {
    let url = `/${get_a_word()}/`;
    let title = `${get_a_word()} ${term} ${get_a_word()}`;

    let words = new Array(30).fill("").map((_) => get_a_word());
    let content = words.join(" ");
    words[Math.floor(Math.random() * 15)] = `<mark>${term}</mark>`;
    words[Math.floor(Math.random() * 15) + 14] = `<mark>${term}</mark>`;
    let excerpt = words.join(" ");

    results.push({
      id: Math.random().toString(),
      score: Math.random(),
      words: [1, 2, 3], // TODO: Make these valid positions
      data: async (): Promise<PagefindSearchFragment> => {
        await asyncSleep(Math.floor(Math.random() * 2000));
        return {
          url,
          content,
          excerpt,
          word_count: 30,
          locations: [7],
          filters: {
            color: [get_a_word()],
          },
          meta: {
            title,
            image: `https://placekitten.com/${Math.floor(
              Math.random() * 1000
            )}/${Math.floor(Math.random() * 1000)}`,
          },
          anchors: [
            {
              element: "h2",
              id: "heading",
              location: 5,
            },
          ],
          sub_results: get_subs(term, title, url, words),
        };
      },
    });
  }

  return results;
};

const num = (max) => Math.floor(Math.random() * max);
const stubbed_filters = (max) => {
  return {
    color: {
      Red: num(max),
      Blue: num(max),
      Green: num(max),
      "Amb&#39;er": num(max),
    },
    type: {
      Blog: num(max),
      Docs: num(max),
    },
  };
};

class Pagefind {
  searchID: number;

  constructor() {
    this.searchID = 0;
  }

  async sleep(ms = 100) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async loadFragment(term, block) {
    await this.sleep(Math.floor(Math.random() * 2000));

    return block;
  }

  async debouncedSearch(
    term: string | null,
    options: PagefindSearchOptions,
    debounceTimeoutMs = 300
  ) {
    const thisSearchID = ++this.searchID;
    await asyncSleep(debounceTimeoutMs);

    if (thisSearchID !== this.searchID) {
      return null;
    }

    const searchResult = await this.search(term, options);
    if (thisSearchID !== this.searchID) {
      return null;
    }
    return searchResult;
  }

  async search(term: string | null, options: PagefindSearchOptions) {
    await this.sleep(Math.floor(Math.random() * 2000));
    if (term && /y$/i.test(term)) {
      return {
        suggestion: "Hrrrrrm",
        matched: "bah",
        results: [],
      };
    }

    if (options?.filters) {
      term += ` ${Object.entries(options.filters)
        .map(([f, v]) => `[${f}:${v.toString()}]`)
        .join(" ")}`;
    }

    return {
      suggestion: "some suggestion",
      matched: "some match info",
      results: stub_results(term),
      filters: stubbed_filters(3),
      totalFilters: stubbed_filters(3),
      unfilteredTotalCount: 10,
    };
  }

  async filters() {
    await this.sleep(Math.floor(Math.random() * 2000));
    return stubbed_filters(2000);
  }
}

const pagefind = new Pagefind();

export const options = async () => {};
export const search = async (
  term: string | null,
  options: PagefindSearchOptions
) => await pagefind.search(term, options);
export const debouncedSearch = async (
  term: string | null,
  options: PagefindSearchOptions,
  debounceTimeoutMs
) => await pagefind.debouncedSearch(term, options, debounceTimeoutMs);
export const preload = async () => {};
export const filters = async () => await pagefind.filters();

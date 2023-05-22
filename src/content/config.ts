import { z, defineCollection } from "astro:content";

// zodで各項目のバリデーションを設定
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string().max(100).min(1), // titleは1文字以上100文字以下
    tags: z.array(z.string()).max(5).min(1), // タグは1つ以上5個まで
    date: z.string().regex(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])$/), // yyyy-mm-dd形式
  }),
});

// `blog` という名前で上記のコレクション定義を登録
export const collections = {
  blog: blogCollection,
};

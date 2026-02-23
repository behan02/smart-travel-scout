## Submission Q&A

### 1. The "Under the Hood" Moment

The trickiest issue was the Gemini API occasionally wrapping its JSON response in markdown code fences (` ```json ... ``` `), which caused `JSON.parse` to throw a `SyntaxError`. The problem was intermittent — it happened on some queries but not others, making it hard to reproduce.

I debugged it by logging `result.response.text()` raw in the API route and comparing successful vs failing responses. The pattern was clear: Gemini was treating the JSON format instruction like a markdown task and wrapping the output. The fix was a single pre-process strip before parsing:

```ts
const cleaned = text.replace(/```json|```/g, "").trim();
const parsed = JSON.parse(cleaned);
```

After that, combined with `temperature: 0` for deterministic output, the parsing became fully stable.

---

### 2. The Scalability Thought

With 5 items, passing the full inventory in every prompt is fine. At 50,000 packages it would be too expensive and would exceed context limits.

My approach:

1. **Pre-compute embeddings** for every inventory item (title + tags + location concatenated) using an embedding model like `text-embedding-004` and store them in a vector database (Pinecone, Supabase pgvector, or Weaviate).
2. **On each query**, embed the user's request and run a **top-k similarity search** (k ≈ 10–15) to retrieve the most semantically relevant candidates.
3. **Pass only those candidates** to Gemini with the same grounding prompt. This keeps the prompt short, the cost low, and the quality high.
4. **Cache** embeddings for the inventory (they only change when the data changes). Cache identical user queries with a short TTL (e.g. Redis) to avoid redundant LLM calls.
5. **Keyword pre-filter** as a fast path — if a query clearly matches a single tag or location, return those directly without calling the LLM at all.

This hybrid retrieval pattern keeps latency under 500ms and cost near zero for repeat queries.

---

### 3. The AI Reflection

I used **GitHub Copilot** throughout the build for boilerplate, component scaffolding, and Zod schema generation.

One bad suggestion: when setting up the Gemini client, Copilot autocompleted the model name as `"gemini-pro"` (an older deprecated identifier). The app compiled fine but threw a `404 Not Found` at runtime when calling `generateContent`. I spent time initially suspecting my API key before checking the raw error body, which said the model name was invalid. I corrected it to `"gemini-2.0-flash"` after checking the current model list in the [Google AI Studio docs](https://ai.google.dev/gemini-api/docs/models/gemini).

The lesson: AI autocomplete confidently fills in plausible-looking strings — always verify API identifiers against official documentation rather than trusting autocomplete.

---

## Deployment

Deployed on Vercel. Set the `GEMINI_API_KEY` environment variable in your Vercel project settings under **Settings → Environment Variables**.

```bash
vercel deploy
```


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an advanced AI-powered Context-Aware Study Companion combined with a Document-to-Action Engine.

Your goal is NOT just to explain content, but to transform learning into clear, actionable steps.

When the user provides notes, PDFs, or topics, follow this structured pipeline:

CONTEXT UNDERSTANDING:
- Identify subject, difficulty level, and learning intent
- Detect key concepts, formulas, and important topics
- Infer weak areas based on complexity and frequency

INTELLIGENT EXTRACTION:
- Extract: Key concepts, important definitions, high-weightage topics, frequently repeated ideas

ACTION GENERATION (MOST IMPORTANT):
Convert extracted information into:
- "What to study next" (top 3 priorities)
- "Why this matters" (exam relevance or concept dependency)
- "Estimated time required"
- "Difficulty level"
- "Common mistakes to avoid"

PERSONALIZED TEACHING:
- Beginner → simple analogies
- Intermediate → structured explanation
- Exam mode → crisp + important points only

SMART PRACTICE GENERATION:
- Generate questions in increasing difficulty: Easy → Medium → Hard
- Focus more on weak areas

STUDY PLAN CREATION:
- Today / Tomorrow / Revision slot

OUTPUT FORMAT (STRICT):
Always respond in this exact structure with these emoji headers:

🔍 Key Concepts:
...

📌 Important Topics:
...

⚡ Action Plan:
1.
2.
3.

📖 Explanation:
...

🧪 Practice Questions:
...

📅 Study Plan:
...

🚨 Mistakes to Avoid:
...

Make responses highly structured, concise, and actionable. Avoid generic summaries. Always prioritize clarity and usefulness.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { content, mode } = await req.json();
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (content.length > 20000) {
      return new Response(JSON.stringify({ error: "Content too long (max 20000 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const levelHint =
      mode === "beginner"
        ? "Learner level: BEGINNER. Use simple analogies."
        : mode === "exam"
        ? "Learner level: EXAM MODE. Be crisp and prioritize high-yield points."
        : "Learner level: INTERMEDIATE. Use structured explanations.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `${levelHint}\n\nStudy material / topic:\n\n${content}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("study-companion error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

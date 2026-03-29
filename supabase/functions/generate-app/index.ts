import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert frontend developer. Generate a complete, modern, responsive single-page website using pure HTML, CSS, and JavaScript based on the user's idea.

CRITICAL RULES:
- Return ONLY the complete HTML code. No explanations, no markdown, no code fences.
- The HTML must be a single self-contained file with inline CSS in a <style> tag and inline JS in a <script> tag.
- Use modern CSS (flexbox, grid, custom properties, gradients, shadows).
- Make it visually stunning with a professional color scheme, smooth animations, and clean typography.
- Include multiple sections: hero, features, about, testimonials, footer etc. as appropriate.
- Add hover effects, transitions, and micro-interactions.
- Make it fully responsive with media queries.
- Use Google Fonts via CDN link.
- Add realistic placeholder content (not lorem ipsum).
- The design should look like a real production website.
- Start directly with <!DOCTYPE html> - no other text before or after.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let code = data.choices?.[0]?.message?.content || "";
    
    // Clean up code fences if present
    if (code.startsWith("```html")) code = code.slice(7);
    else if (code.startsWith("```")) code = code.slice(3);
    if (code.endsWith("```")) code = code.slice(0, -3);
    code = code.trim();

    return new Response(JSON.stringify({ code }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-app error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

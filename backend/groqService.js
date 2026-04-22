import Groq from "groq-sdk";

function buildPrompts(metrics) {
  const systemPrompt =
    "You are a developer productivity coach. Your job is to interpret a developer's metrics and give them 2 practical, specific next steps. Be direct, warm, and specific. Do not be generic. Keep interpretation under 60 words. Each next step should be one clear sentence.";

  const userPrompt = `Developer: ${metrics.developer_name}
Team: ${metrics.team_name}
Month: ${metrics.month}
Pattern: ${metrics.pattern_hint}

Metrics:
- Cycle Time: ${metrics.avg_cycle_time_days} days
- Lead Time: ${metrics.avg_lead_time_days} days
- PR Throughput: ${metrics.merged_prs} PRs merged
- Deployment Frequency: ${metrics.prod_deployments} deployments
- Bug Rate: ${metrics.bug_rate_pct * 100}%

Give a short interpretation of what is likely happening for this developer, then give exactly 2 next steps.

Respond in this exact JSON format only, no extra text:
{
  "interpretation": "...",
  "nextSteps": ["step 1", "step 2"]
}`;

  return { systemPrompt, userPrompt };
}

export async function generateInsight(metrics) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    throw new Error("GROQ_API_KEY is missing. Add it in the root .env file.");
  }

  const groq = new Groq({ apiKey });
  const { systemPrompt, userPrompt } = buildPrompts(metrics);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const rawText = completion.choices?.[0]?.message?.content?.trim();
  if (!rawText) {
    throw new Error("Groq returned an empty response.");
  }

  const parsed = JSON.parse(rawText);
  if (
    typeof parsed.interpretation !== "string" ||
    !Array.isArray(parsed.nextSteps) ||
    parsed.nextSteps.length !== 2
  ) {
    throw new Error("Groq response did not match expected JSON structure.");
  }

  return {
    interpretation: parsed.interpretation,
    nextSteps: parsed.nextSteps,
  };
}

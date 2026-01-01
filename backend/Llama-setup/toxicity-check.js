import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BASE_PROMPT = `
You are a strict content moderation classifier.

Evaluate the input text for the following categories:
- hate speech
- threats
- harassment or bullying
- slurs
- profanity
- sexual aggression
- discrimination
- self-harm encouragement

Scoring rules:
- 0-20: clearly safe
- 21-40: mild or contextual language
- 41-60: borderline violation
- 61-80: clear violation
- 81-100: severe or explicit violation

Consider context (quoting, reporting, academic use) when scoring.

Return JSON only:
{
  "score": number (0-100),
  "reason": short category-based reason (max 12 words)
}
`;

const HATE_PROMPT = `
You classify profanity, obscene language, and vulgar expressions.

Include:
- curse words and explicit language
- slurs when used only as profanity (not discriminatory)
- sexual or obscene expressions

Exclude:
- hate speech or discrimination (handled separately)
- harassment with a clear target (handled separately)
- mild or colloquial expressions used non-aggressively
- quoted or reported profanity without endorsement

Scoring rules:
- 0-20: no profanity or very mild usage
- 21-40: mild or casual profanity
- 41-60: frequent or aggressive profanity
- 61-80: explicit or obscene profanity
- 81-100: excessive, graphic, or sexually explicit language

Consider frequency, intensity, and tone.
Context may reduce severity.

Return JSON only:
{
  "score": number (0-100),
  "reason": short standardized reason (max 12 words)
}
`;

const PROFANITY_PROMPT = `
You classify ONLY hate speech and discrimination
directed at protected classes or identities.

Protected classes include (but are not limited to):
race, ethnicity, nationality, religion, caste,
gender, sexual orientation, disability, serious disease.

Include:
- demeaning or dehumanizing language
- calls for exclusion, violence, or harm
- discriminatory statements or stereotypes
- slurs targeting protected classes

Exclude:
- harassment without protected-class targeting
- profanity without discriminatory intent
- neutral discussion, reporting, or academic context
- reclaimed slurs without hostile intent

Scoring rules:
- 0-20: clearly safe or neutral
- 21-40: contextual or ambiguous reference
- 41-60: borderline discriminatory language
- 61-80: clear hate speech or discrimination
- 81-100: severe, explicit, or violent hate speech

Consider context, intent, and whether the content targets
a protected class.

Return JSON only:
{
  "score": number (0-100),
  "reason": short standardized reason (max 12 words)
}
`;

const HARASSMENT_PROMPT = `
You classify ONLY harassment, bullying, insults, and personal attacks
directed at an individual or group.

Include:
- name-calling
- insults
- bullying
- mocking or shaming language
- demeaning personal attacks
- repeated aggressive targeting

Exclude:
- hate speech or discrimination (handled elsewhere)
- profanity without a target
- neutral disagreement or criticism
- quoted or reported harassment without endorsement

Scoring rules:
- 0-20: clearly safe or neutral
- 21-40: mild or indirect harassment
- 41-60: borderline or contextual harassment
- 61-80: clear harassment or bullying
- 81-100: severe, sustained, or threatening harassment

Consider context, sarcasm, and whether the attack is targeted.

Return JSON only:
{
  "score": number (0-100),
  "reason": short standardized reason (max 12 words)
}
`;

const threshold = 60;

const severityOrder = ["hate", "harassment", "general", "profanity"];

const weight = {
  general: 0.5,
  hate: 0.2,
  harassment: 0.2,
  profanity: 0.1,
};

function safeParseJSON(content) {
  try {
    return JSON.parse(content);
  } catch {
    return { score: 0, reason: "parse_error" };
  }
}

async function classify(prompt, text) {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text },
      ],
      temperature: 0,
      response_format: { type: "json_object" }
    });    

    return safeParseJSON(response.choices[0].message.content);
  } catch {
    return { score: 0, reason: "model_error" };
  }
}

async function checkToxicity(text) {
  const [general, hate, harassment, profanity] = await Promise.all([
    classify(BASE_PROMPT, text),
    classify(HATE_PROMPT, text),
    classify(HARASSMENT_PROMPT, text),
    classify(PROFANITY_PROMPT, text),
  ]);

  const results = { general, hate, harassment, profanity };

  const finalScore = Math.round(
    Object.entries(results).reduce((sum, [key, val]) => {
      const score = typeof val?.score === "number" ? val.score : 0;
      return sum + score * weight[key];
    }, 0)
  );

  let topCategory = severityOrder.find(
    (key) => results[key]?.score >= threshold
  );

  if (!topCategory) {
    [topCategory] = Object.entries(results).reduce(
      (max, curr) =>
        curr[1]?.score > max[1]?.score ? curr : max,
      ["general", { score: -1 }]
    );
  }

  const status =
    finalScore >= threshold
      ? "rejected"
      : finalScore >= 30
      ? "pending"
      : "approved";

  return {
    score: finalScore,
    status,
    topCategory,
    reason: results[topCategory]?.reason ?? "no_violation",
    reviewedBy: "AI",
    checkedAt: new Date(),
  };
}

export default checkToxicity;

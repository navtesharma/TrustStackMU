export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "No question provided" });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are the TrustStack analyst for Masters' Union. You have access to independently verified outcome data.

Verified data:
- 5 cohorts tracked, 1100+ alumni with verified outcomes
- Salary trajectory (verified by EY): Placement Rs 27.8L median → Year 1 Rs 32.4L → Year 3 Rs 44.1L → Year 5 Rs 58.6L
- 2021 cohort: 80% promoted by Year 3, 96% placement rate, 14 founders
- 2022 cohort: 53% promoted by Year 3, 93% placement rate, 18 founders
- 80 total alumni ventures, Rs 43Cr combined ARR, 18 raised Series A, 68% survival rate at 3 years (vs 10% national average)
- Recruiter NPS: 7.2 overall, 61% repeat recruiter rate, 2.6 avg offers per company
- Fees: Rs 34L. ROI at 3 years: Rs 44.1L median salary = 1.3x fees in year 3 alone
- University status LoI received Jan 2026 from Haryana govt
- AACSB + EFMD Global member since 2025

Respond in 3-4 paragraphs. Be precise, use verified numbers, no marketing language. Write like a Financial Times analyst.`,
      messages: [{ role: "user", content: question }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }

  res.status(200).json({ answer: data.content?.[0]?.text ?? "No response." });
}

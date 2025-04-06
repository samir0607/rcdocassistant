type Classification = "simple" | "complex";

function classifyQuery(query: string): Classification {
  const tokens = query.trim().split(/\s+/);
  const tokenCount = tokens.length;

  const namedEntities = tokens.filter((word, index) =>
    index > 0 && /^[A-Z][a-zA-Z0-9]*$/.test(word)
  );
  const entityCount = namedEntities.length;

  const unique = new Set(tokens.map(t => t.toLowerCase()));
  const diversity = unique.size / tokens.length;

  let score = 0;
  if (tokenCount > 12) score++;
  if (entityCount > 2) score++;
  if (diversity > 0.65) score++;

  return score >= 2 ? "complex" : "simple";
}

function expandTerms(input: string): string {
  const expansions: Record<string, string> = {
    "notifs": "notifications",
    "pls": "please",
    "plz": "please",
    "vs": "versus",
    "setup": "set up",
    "config": "configure",
    "oauth": "OAuth"
  };

  return input
    .split(" ")
    .map(token => expansions[token.toLowerCase()] || token)
    .join(" ");
}

function normalize(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9\s]/g, "") // remove extra punctuation
    .replace(/\s+/g, " ")           // trim whitespace
    .trim();
}

function ensureContext(input: string): string {
  if (!/Rocket\.Chat/i.test(input)) {
    return input + " in Rocket.Chat";
  }
  return input;
}

function formatAsQuestion(input: string): string {
  input = input.charAt(0).toUpperCase() + input.slice(1);
  return input.endsWith("?") ? input : input + "?";
}

function preprocessQuery(query: string): string {
  let cleaned = normalize(query);
  cleaned = expandTerms(cleaned);
  cleaned = ensureContext(cleaned);
  return formatAsQuestion(cleaned);
}

function processQuery(query: string): { classification: Classification; rewrittenQuery: string } {
  return {
    classification: classifyQuery(query),
    rewrittenQuery: preprocessQuery(query)
  };
}

// Example Usage
const testQueries = [
  "setup oauth??",
  "notifs pls",
  "compare livechat vs omnichannel for rc",
  "How do I configure LDAP for SSO integration?"
];

for (const q of testQueries) {
  const result = processQuery(q);
  console.log(`Raw: ${q}`);
  console.log(`↪ Classification: ${result.classification}`);
  console.log(`↪ Rewritten: ${result.rewrittenQuery}`);
  console.log("------");
}

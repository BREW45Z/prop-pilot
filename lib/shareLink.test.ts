import { buildShareQuery, parseShareLink } from "./shareLink";

function expectEqual(
  actual: string | null,
  expected: string | null,
  testName: string,
) {
  if (actual !== expected) {
    throw new Error(`${testName} failed. Expected ${expected}, got ${actual}`);
  }
}

// 1. Risk round-trip: build a link, parse it back, values should match.
const riskQuery = buildShareQuery("risk", {
  account: "50000",
  risk: "1",
  sl: "50",
  pip: "10",
});
const riskParsed = parseShareLink(`?${riskQuery}`);

expectEqual(riskParsed.tool, "risk", "Risk round-trip tool");
expectEqual(riskParsed.account, "50000", "Risk round-trip account");
expectEqual(riskParsed.risk, "1", "Risk round-trip risk");
expectEqual(riskParsed.sl, "50", "Risk round-trip stop loss");
expectEqual(riskParsed.pip, "10", "Risk round-trip pip value");

// 2. Drawdown round-trip, including a negative P/L value.
const drawdownQuery = buildShareQuery("drawdown", {
  balance: "50000",
  limit: "5",
  pl: "-200",
  open: "100",
});
const drawdownParsed = parseShareLink(`?${drawdownQuery}`);

expectEqual(drawdownParsed.tool, "drawdown", "Drawdown round-trip tool");
expectEqual(drawdownParsed.balance, "50000", "Drawdown round-trip balance");
expectEqual(drawdownParsed.limit, "5", "Drawdown round-trip limit");
expectEqual(drawdownParsed.pl, "-200", "Drawdown round-trip P/L");
expectEqual(drawdownParsed.open, "100", "Drawdown round-trip open risk");

// 3. Malformed and missing params are ignored (become null).
const junk = parseShareLink("?tool=risk&account=abc&risk=&sl=50");
expectEqual(junk.account, null, "Non-numeric account rejected");
expectEqual(junk.risk, null, "Empty risk rejected");
expectEqual(junk.sl, "50", "Valid value still accepted alongside junk");
expectEqual(junk.pip, null, "Missing pip is null");

// 4. Invalid or missing tool becomes null (no forced report jump).
expectEqual(parseShareLink("?tool=hack").tool, null, "Invalid tool rejected");
expectEqual(parseShareLink("").tool, null, "Empty search string tool is null");

console.log("All share link tests passed.");

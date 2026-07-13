// Shareable-link helpers for the Risk and Daily Drawdown calculators.
// These are pure functions (no window, no state) so they are easy to test.
// They format values that already come from the calculator; they never
// calculate new values.

export type ShareTool = "risk" | "drawdown";

export type RiskShareValues = {
  account: string;
  risk: string;
  sl: string;
  pip: string;
};

export type DrawdownShareValues = {
  balance: string;
  limit: string;
  pl: string;
  open: string;
};

// Parsed result. `tool` is null when the link has no valid tool. Each value is
// a clean numeric string, or null when the param was missing/malformed.
export type ParsedShareLink = {
  tool: ShareTool | null;
  account: string | null;
  risk: string | null;
  sl: string | null;
  pip: string | null;
  balance: string | null;
  limit: string | null;
  pl: string | null;
  open: string | null;
};

function isShareTool(value: string | null): value is ShareTool {
  return value === "risk" || value === "drawdown";
}

// Builds the query string (without a leading "?") for a share link.
export function buildShareQuery(
  tool: ShareTool,
  values: RiskShareValues | DrawdownShareValues,
): string {
  const params = new URLSearchParams();
  params.set("tool", tool);

  if (tool === "risk") {
    const risk = values as RiskShareValues;
    params.set("account", risk.account);
    params.set("risk", risk.risk);
    params.set("sl", risk.sl);
    params.set("pip", risk.pip);
  } else {
    const drawdown = values as DrawdownShareValues;
    params.set("balance", drawdown.balance);
    params.set("limit", drawdown.limit);
    params.set("pl", drawdown.pl);
    params.set("open", drawdown.open);
  }

  return params.toString();
}

// Parses a location search string (e.g. "?tool=risk&account=50000") into clean
// values. Malformed or missing params become null; nothing is trusted blindly.
export function parseShareLink(searchString: string): ParsedShareLink {
  const params = new URLSearchParams(searchString);

  const readNumber = (key: string): string | null => {
    const raw = params.get(key);
    if (raw === null || raw.trim() === "" || Number.isNaN(Number(raw))) {
      return null;
    }
    return raw;
  };

  const tool = params.get("tool");

  return {
    tool: isShareTool(tool) ? tool : null,
    account: readNumber("account"),
    risk: readNumber("risk"),
    sl: readNumber("sl"),
    pip: readNumber("pip"),
    balance: readNumber("balance"),
    limit: readNumber("limit"),
    pl: readNumber("pl"),
    open: readNumber("open"),
  };
}

import "server-only"



/** Where `?next=` lands when it is missing or untrustworthy. */
const FALLBACK_PATH = "/account";
/** Long enough for any real route, short enough to bound the check. */
const MAX_NEXT_LENGTH = 512;


/**
 * `redirect()` with an attacker-supplied string is an open redirect, and here
 * it fires immediately after a successful sign-in — the moment a phishing
 * landing page is most believable. Only same-origin absolute paths survive.
 *
 * `//evil.com` and `/\evil.com` are the two a naive `startsWith("/")` lets
 * through: browsers normalise both to an external origin.
 */

export function safeNextPath(raw: unknown): string {
    if (typeof raw !== "string") return FALLBACK_PATH; // also rejects string[]
    if (raw.length > MAX_NEXT_LENGTH) return FALLBACK_PATH;
    if (!raw.startsWith("/")) return FALLBACK_PATH;
    if (raw.startsWith("//") || raw.startsWith("/\\")) return FALLBACK_PATH;
    // Control characters — header splitting and request smuggling.
    if (/[\u0000-\u001f\u007f]/.test(raw)) return FALLBACK_PATH;
    return raw;
}
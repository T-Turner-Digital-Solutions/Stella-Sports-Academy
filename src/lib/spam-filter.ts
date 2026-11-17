/**
 * Heuristic spam classifier for the public Contact form, aimed at the
 * unsolicited SEO/web-marketing pitches that slip past the honeypot
 * (a human filling the form out by hand, not a bot). Never flags on a
 * single keyword match — a real parent, sponsor, or partner can mention
 * "SEO" or "marketing" in a genuine message without being quarantined.
 * Flagging requires matches from at least two *distinct* categories below,
 * since real spam of this kind combines a service pitch with a sales
 * call-to-action and/or a mass-outreach template structure, while a
 * one-off mention of a single topic does not.
 */

type Category = {
  key: string;
  label: string;
  phrases: string[];
};

const CATEGORIES: Category[] = [
  {
    key: "seo-marketing-pitch",
    label: "SEO/marketing service pitch",
    phrases: [
      "backend analysis of your website",
      "seo analysis",
      "search engine optimization",
      "search engine optimisation",
      "improve your website's seo",
      "improve the seo",
      "improving the seo",
      "online visibility",
      "website visibility",
      "not appearing on google",
      "not showing up on google",
      "boost your google ranking",
      "rank higher on google",
      "backlink",
      "link building",
      "digital marketing services",
      "website audit",
      "redesign your website",
      "web design services",
      "increase your website traffic",
      "grow your online presence",
      "generate more business",
      "generate more leads",
      "lead generation services",
    ],
  },
  {
    key: "sales-cta",
    label: "Unsolicited sales call-to-action",
    phrases: [
      "send us your preferred time",
      "send your updated contact number",
      "schedule a call",
      "book a free consultation",
      "let us know a good time to call",
      "reply with your contact number",
      "we will get in touch with you to explain",
      "happy to assist you with improving",
      "give us a call back",
      "hop on a quick call",
    ],
  },
  {
    key: "mass-outreach-structure",
    label: "Mass-outreach template structure",
    phrases: [
      "we recently ran",
      "we noticed that your website",
      "we noticed your website",
      "our team would be happy to assist",
      "best website experience",
      "we understand that your website was created to attract",
      "we came across your website",
      "after reviewing your website",
    ],
  },
];

export type SpamClassification = {
  isSpam: boolean;
  reason: string | null;
  score: number;
};

/** Classifies a Contact form message. Only the message body is scanned —
 * name/email aren't used as signals, since spoofing those is trivial and
 * penalizing on them risks false positives on real inquiries. */
export function classifyContactSubmission(message: string): SpamClassification {
  const text = message.toLowerCase();

  const matchedCategories = CATEGORIES.filter((category) =>
    category.phrases.some((phrase) => text.includes(phrase))
  );

  if (matchedCategories.length < 2) {
    return { isSpam: false, reason: null, score: matchedCategories.length };
  }

  const reason = `Matched ${matchedCategories.length} spam signal categories: ${matchedCategories
    .map((c) => c.label)
    .join(", ")}.`;

  return { isSpam: true, reason, score: matchedCategories.length };
}

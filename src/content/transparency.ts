export type PublicDocument = {
  title: string;
  category:
    | "Governance"
    | "Financial"
    | "IRS Filing"
    | "Policy"
    | "Grant & Foundation";
  fileUrl: string;
  datePublished: string;
};

// Intentionally empty. Only documents explicitly approved for public release
// belong here — nothing is published without that approval. Add entries once
// PDFs are uploaded (Phase 2 document vault) or hosted and approved.
export const publicDocuments: PublicDocument[] = [];

export type MeetingMinutesRecord = {
  year: number;
  meetings: {
    title: string;
    date: string;
    fileUrl: string | null;
  }[];
};

// Intentionally empty until the board approves specific minutes for public
// release. Internal board records are never auto-published here.
export const publicMeetingMinutes: MeetingMinutesRecord[] = [];

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { MinutesEditor } from "@/components/board/MinutesEditor";
import { MigrationPendingNotice } from "@/components/board/MigrationPendingNotice";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { findBoardMeetingById } from "@/lib/board-meetings";
import { getOrCreateDraft, listMinutesHistory, type BoardMeetingMinutes, type MinutesHistoryEntry } from "@/lib/board-meeting-minutes";
import { MigrationNotAppliedError } from "@/lib/migration-guard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Meeting Minutes" };

export default async function MeetingMinutesPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) notFound();

  const { id } = await params;
  const session = await getCurrentAdminSession();
  if (!session) notFound();

  const meeting = await findBoardMeetingById(id);
  if (!meeting) notFound();

  const heroDescription = `${meeting.title} — ${new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "America/Chicago",
  }).format(new Date(meeting.scheduled_at))}`;

  let data: { minutes: BoardMeetingMinutes; history: MinutesHistoryEntry[] } | null = null;
  let unavailable = false;
  try {
    const minutes = await getOrCreateDraft(id, session.id);
    if (!minutes) notFound();
    const history = await listMinutesHistory(minutes.id);
    data = { minutes, history };
  } catch (error) {
    if (!(error instanceof MigrationNotAppliedError)) throw error;
    unavailable = true;
  }

  return (
    <Container>
      <PortalPageHero title="Meeting Minutes" description={heroDescription} />
      <div className="mt-6">
        {unavailable || !data ? (
          <MigrationPendingNotice feature="Meeting Minutes" />
        ) : (
          <MinutesEditor
            meetingId={id}
            minutes={data.minutes}
            history={data.history}
            isOwner={session.role === "owner"}
            filedDocumentUrl={data.minutes.filed_document_id ? `/board/documents/${data.minutes.filed_document_id}` : null}
          />
        )}
      </div>
    </Container>
  );
}

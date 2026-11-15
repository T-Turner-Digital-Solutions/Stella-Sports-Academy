import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { MinutesEditor } from "@/components/board/MinutesEditor";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { findBoardMeetingById } from "@/lib/board-meetings";
import { getOrCreateDraft, listMinutesHistory } from "@/lib/board-meeting-minutes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Meeting Minutes" };

export default async function MeetingMinutesPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) notFound();

  const { id } = await params;
  const session = await getCurrentAdminSession();
  if (!session) notFound();

  const meeting = await findBoardMeetingById(id);
  if (!meeting) notFound();

  const minutes = await getOrCreateDraft(id, session.id);
  if (!minutes) notFound();
  const history = await listMinutesHistory(minutes.id);

  return (
    <Container>
      <PortalPageHero
        title="Meeting Minutes"
        description={`${meeting.title} — ${new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
          timeZone: "America/Chicago",
        }).format(new Date(meeting.scheduled_at))}`}
      />
      <div className="mt-6">
        <MinutesEditor
          meetingId={id}
          minutes={minutes}
          history={history}
          isOwner={session.role === "owner"}
          filedDocumentUrl={minutes.filed_document_id ? `/board/documents/${minutes.filed_document_id}` : null}
        />
      </div>
    </Container>
  );
}

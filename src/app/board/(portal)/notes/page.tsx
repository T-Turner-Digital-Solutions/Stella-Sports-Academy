import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { NotesBoard } from "@/components/board/NotesBoard";
import { MigrationPendingNotice } from "@/components/board/MigrationPendingNotice";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listNotesForUser, type BoardNote } from "@/lib/board-notes";
import { listAdminUsers } from "@/lib/admin-users";
import { listAllBoardMeetingsForUser } from "@/lib/board-meetings";
import { MigrationNotAppliedError } from "@/lib/migration-guard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Notes" };

export default async function BoardNotesPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const isOwner = session?.role === "owner";

  let notes: BoardNote[] = [];
  let notesUnavailable = false;
  if (dbReady && session) {
    try {
      notes = await listNotesForUser(session.id);
    } catch (error) {
      if (!(error instanceof MigrationNotAppliedError)) throw error;
      notesUnavailable = true;
    }
  }
  const allMembers = dbReady ? await listAdminUsers() : [];
  const members = allMembers.filter((m) => m.active && m.id !== session?.id).map((m) => ({ id: m.id, name: m.name }));
  let allMeetings: Awaited<ReturnType<typeof listAllBoardMeetingsForUser>> = [];
  if (dbReady && session) {
    try {
      allMeetings = await listAllBoardMeetingsForUser(session.id, isOwner);
    } catch (error) {
      if (!(error instanceof MigrationNotAppliedError)) throw error;
      // Meeting-attach list is a convenience here, not primary data — fall
      // back to an empty list so notes (the actual point of this page)
      // still load instead of crashing.
    }
  }
  const meetings = allMeetings.map((m) => ({ id: m.id, title: m.title }));

  return (
    <Container>
      <PortalPageHero
        title="My Notes"
        description="Private by default — share a note with specific board members, or attach it to a meeting, only if you choose to."
      />
      <div className="mt-6">
        {notesUnavailable ? (
          <MigrationPendingNotice feature="My Notes" />
        ) : (
          <NotesBoard notes={notes} members={members} meetings={meetings} currentUserId={session?.id ?? ""} />
        )}
      </div>
    </Container>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { NotesBoard } from "@/components/board/NotesBoard";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listNotesForUser } from "@/lib/board-notes";
import { listAdminUsers } from "@/lib/admin-users";
import { listAllBoardMeetingsForUser } from "@/lib/board-meetings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Notes" };

export default async function BoardNotesPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const isOwner = session?.role === "owner";

  const notes = dbReady && session ? await listNotesForUser(session.id) : [];
  const allMembers = dbReady ? await listAdminUsers() : [];
  const members = allMembers.filter((m) => m.active && m.id !== session?.id).map((m) => ({ id: m.id, name: m.name }));
  const allMeetings = dbReady && session ? await listAllBoardMeetingsForUser(session.id, isOwner) : [];
  const meetings = allMeetings.map((m) => ({ id: m.id, title: m.title }));

  return (
    <Container>
      <PortalPageHero
        title="My Notes"
        description="Private by default — share a note with specific board members, or attach it to a meeting, only if you choose to."
      />
      <div className="mt-6">
        <NotesBoard notes={notes} members={members} meetings={meetings} currentUserId={session?.id ?? ""} />
      </div>
    </Container>
  );
}

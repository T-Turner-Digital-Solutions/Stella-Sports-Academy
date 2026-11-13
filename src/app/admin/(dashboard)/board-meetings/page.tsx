import type { Metadata } from "next";
import { Video } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { listAllBoardMeetings } from "@/lib/board-meetings";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { BoardMeetingForm } from "@/components/admin/BoardMeetingForm";
import { BoardMeetingsList } from "@/components/admin/BoardMeetingsList";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Board Meetings" };

export default async function AdminBoardMeetingsPage() {
  const dbReady = isDatabaseConfigured();
  const meetings = dbReady ? await listAllBoardMeetings() : [];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Board Meetings</h1>
      <p className="mt-1 text-sm text-ink/60">
        Scheduled Zoom meetings board members see on their private dashboard.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {!dbReady ? (
          <DbNotConfigured />
        ) : (
          <>
            <BoardMeetingForm />
            {meetings.length === 0 ? (
              <EmptyState icon={Video} title="No Meetings Scheduled" description="Meetings you schedule will appear here and on the board dashboard." />
            ) : (
              <BoardMeetingsList meetings={meetings} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

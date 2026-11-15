import { redirect } from "next/navigation";

// Meeting management now lives entirely in the board portal
// (/board/meetings), with invitee selection, editing, cancellation, and
// notifications all in one place — this avoids maintaining two separate
// meeting-management UIs with diverging capabilities.
export default function AdminBoardMeetingsPage() {
  redirect("/board/meetings");
}

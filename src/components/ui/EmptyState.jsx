import { RiInboxLine } from "react-icons/ri";

export default function EmptyState({ icon: Icon = RiInboxLine, message }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-text-muted">
      <Icon size={28} />
      <p className="text-sm">{message}</p>
    </div>
  );
}

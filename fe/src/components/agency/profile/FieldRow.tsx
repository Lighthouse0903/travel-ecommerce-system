interface FildRowProps {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}

const FieldRow: React.FC<FildRowProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="shrink-0">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm break-all">{value ?? "—"}</p>
      </div>
    </div>
  );
};
export default FieldRow;

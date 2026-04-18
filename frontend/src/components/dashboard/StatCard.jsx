function StatCard({ label, value, subtext, tone = "default" }) {
  return (
    <div className={`statCard ${tone}`}>
      <p className="statLabel">{label}</p>
      <p className="statValue">{value}</p>
      <p className="statSubtext">{subtext}</p>
    </div>
  );
}

export default StatCard;
import React from "react";

const statusColors = {
  new: "gray",
  processing: "orange",
  approved: "green",
  rejected: "red",
  pending: "blue",
};

export default function StatusBadge({ status }) {
  const color = statusColors[status?.toLowerCase()] || "gray";

  return (
    <span
      style={{
        backgroundColor: color,
        color: "white",
        padding: "0.2rem 0.6rem",
        borderRadius: 4,
        fontWeight: "bold",
        textTransform: "capitalize",
        fontSize: "0.8rem",
      }}
    >
      {status || "Unknown"}
    </span>
  );
}

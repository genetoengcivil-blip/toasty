"use client";

import { useState, useEffect } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="page-skeleton" style={{ opacity: 1, transition: "opacity 0.3s" }}>
      <div className="page-skeleton-logo" />
      <div className="page-skeleton-text" />
      <div className="page-skeleton-text" style={{ width: "100px" }} />
    </div>
  );
}

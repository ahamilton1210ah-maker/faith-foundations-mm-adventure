"use client";

import { useEffect, useState } from "react";

export default function Parent() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("faithTreeCompleted");
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  const count = completed.length;
  const percentage = Math.round((count / 180) * 100);

  let tree = "🌱";
  let message = "Your faith is taking root!";

  if (count >= 180) {
    tree = "🌳🏆";
    message = "Your Faith Tree is fully grown!";
  } else if (count >= 120) {
    tree = "🌳🌳🌳";
    message = "Your Faith Tree is growing strong!";
  } else if (count >= 60) {
    tree = "🌳";
    message = "Look how much your Faith Tree has grown!";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px 20px",
        textAlign: "center",
        background: "#f8f5ed",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>👩‍🏫 Parent Dashboard</h1>

      <h2>Faith Foundations: The M&M Adventure</h2>

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          margin: "25px auto",
          maxWidth: "600px",
          boxShadow: "0 4px 15px rgba(0,0,0,.12)",
        }}
      >
        <div style={{ fontSize: "70px", margin: "15px" }}>
          {tree}
        </div>

        <h2>{message}</h2>

        <p style={{ fontSize: "22px" }}>
          <strong>{count}</strong> / 180 lessons completed
        </p>

        <div
          style={{
            width: "100%",
            height: "25px",
            background: "#ddd",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: "#315c48",
              transition: "width .5s",
            }}
          />
        </div>

        <p style={{ fontSize: "18px", marginTop: "12px" }}>
          {percentage}% Complete
        </p>
      </div>

      <div
        style={{
          background: "#fff4df",
          borderRadius: "20px",
          padding: "25px",
          margin: "20px auto",
          maxWidth: "600px",
        }}
      >
        <h2>📚 Course Progress</h2>

        <p>📖 Bible Lessons: {count} / 180</p>

        <p>
          📝 Midterm Review:{" "}
          {count >= 90 ? "Ready!" : "Complete more lessons first"}
        </p>

        <p>
          🏆 Final Review:{" "}
          {count >= 180 ? "Ready!" : "Complete all 180 lessons"}
        </p>
      </div>

      <p style={{ marginTop: "30px", fontSize: "18px" }}>
        🌳 Every lesson helps your Faith Tree grow!
      </p>
    </main>
  );
}

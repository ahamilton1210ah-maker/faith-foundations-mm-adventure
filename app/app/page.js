"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("faithTreeCompleted");
      if (saved) {
        setCompleted(JSON.parse(saved));
      }
    } catch {
      setCompleted([]);
    }
  }, []);

  const completedCount = completed.length;
  const percentage = Math.round((completedCount / 180) * 100);

  let tree = "🌱";

  if (completedCount >= 30) tree = "🌿";
  if (completedCount >= 60) tree = "🌳";
  if (completedCount >= 90) tree = "🌳🌳";
  if (completedCount >= 120) tree = "🌳🌳🌳";
  if (completedCount >= 150) tree = "🌲🌳🌲";
  if (completedCount >= 180) tree = "🌲🌳🌲🌳🌲";

  let message = "Start your Bible adventure!";
  
  if (completedCount > 0 && completedCount < 60) {
    message = "Your faith is taking root! 🌱";
  } else if (completedCount >= 60 && completedCount < 120) {
    message = "Look how much your Faith Tree has grown! 🌳";
  } else if (completedCount >= 120 && completedCount < 180) {
    message = "Your Faith Tree is almost fully grown! 🌲";
  } else if (completedCount === 180) {
    message = "🏆 Your Faith Tree is fully grown!";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f1e8",
        padding: "25px 15px 50px",
        fontFamily: "Arial, sans-serif",
        color: "#24313a"
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto"
        }}
      >

        {/* HEADER */}
        <section
          style={{
            background: "#315c48",
            color: "white",
            borderRadius: "24px",
            padding: "30px 20px",
            textAlign: "center",
            marginBottom: "20px"
          }}
        >
          <div style={{ fontSize: "55px" }}>🌳</div>

          <h1 style={{ margin: "5px 0", fontSize: "32px" }}>
            Faith Foundations
          </h1>

          <h2 style={{ margin: "5px 0", fontSize: "22px" }}>
            The M&M Adventure
          </h2>

          <p style={{ fontSize: "17px", marginTop: "15px" }}>
            Every child's faith matters. 💚
          </p>
        </section>

        {/* TODAY'S ADVENTURE */}
        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "22px",
            marginBottom: "18px",
            textAlign: "center",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
          }}
        >
          <h2>📖 Today's Bible Adventure</h2>

          <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
            Keep growing your faith one Bible lesson at a time!
          </p>

          <button
            onClick={() => {
              window.location.href = "/Lessons";
            }}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: "#315c48",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            ▶️ Continue Today's Lesson
          </button>
        </section>

        {/* FAITH TREE */}
        <section
          style={{
            background: "#fffaf0",
            borderRadius: "20px",
            padding: "25px 20px",
            marginBottom: "18px",
            textAlign: "center"
          }}
        >
          <h2>🌳 Your Faith Tree</h2>

          <div
            style={{
              fontSize: "55px",
              margin: "15px 0"
            }}
          >
            {tree}
          </div>

          <h3 style={{ fontSize: "20px" }}>
            {message}
          </h3>

          <p style={{ fontSize: "18px" }}>
            Completed: <strong>{completedCount}</strong> / 180 days
          </p>

          {/* PROGRESS BAR */}
          <div
            style={{
              width: "100%",
              height: "20px",
              background: "#ddd",
              borderRadius: "20px",
              overflow: "hidden",
              marginTop: "15px"
            }}
          >
            <div
              style={{
                width: `${percentage}%`,
                height: "100%",
                background: "#6b9f68",
                transition: "width 0.4s"
              }}
            />
          </div>

          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            {percentage}% Complete
          </p>
        </section>

        {/* QUICK ACCESS */}
        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "18px"
          }}
        >
          <h2>⭐ Adventure Center</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "15px"
            }}
          >
            <button
              onClick={() => {
                window.location.href = "/Lessons";
              }}
              style={buttonStyle("#315c48")}
            >
              📚
              <br />
              Bible Lessons
            </button>

            <button
              onClick={() => {
                window.location.href = "/Midterm";
              }}
              style={buttonStyle("#6b7fa3")}
            >
              📝
              <br />
              Midterm Review
            </button>

            <button
              onClick={() => {
                window.location.href = "/Final";
              }}
              style={buttonStyle("#8a6f45")}
            >
              🏆
              <br />
              Final Review
            </button>

            <button
              onClick={() => {
                window.location.href = "/parent";
              }}
              style={buttonStyle("#777")}
            >
              👩‍🏫
              <br />
              Parent Dashboard
            </button>
          </div>
        </section>

        {/* ENCOURAGEMENT */}
        <section
          style={{
            background: "#eef7e9",
            borderRadius: "20px",
            padding: "22px",
            textAlign: "center"
          }}
        >
          <h2>💚 Keep Growing!</h2>

          <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
            Every lesson you complete helps your Faith Tree grow.
          </p>

          <p
            style={{
              fontSize: "17px",
              fontWeight: "bold"
            }}
          >
            🌱 Learn • Pray • Grow • Shine 🌟
          </p>
        </section>

      </div>
    </main>
  );
}

function buttonStyle(background) {
  return {
    padding: "18px 10px",
    border: "none",
    borderRadius: "14px",
    background,
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    minHeight: "90px"
  };
}

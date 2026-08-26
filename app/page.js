"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    function loadProgress() {
      try {
        const saved = localStorage.getItem(
          "faithTreeCompleted"
        );

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setCompleted(parsed);
          }
        }
      } catch {
        setCompleted([]);
      }
    }

    loadProgress();

    function syncProgress() {
      loadProgress();
    }

    window.addEventListener(
      "faithTreeProgressUpdated",
      syncProgress
    );

    window.addEventListener(
      "storage",
      syncProgress
    );

    return () => {
      window.removeEventListener(
        "faithTreeProgressUpdated",
        syncProgress
      );

      window.removeEventListener(
        "storage",
        syncProgress
      );
    };
  }, []);

  const count = completed.length;

  const percentage = Math.round(
    (count / 180) * 100
  );

  let tree = "🌱";
  let treeMessage =
    "Your faith is taking root!";

  if (count >= 180) {
    tree = "🌲🌳🌲🌳🌲";
    treeMessage =
      "🏆 Your Faith Tree is fully grown!";
  } else if (count >= 150) {
    tree = "🌲🌳🌲🌳";
    treeMessage =
      "Your Faith Tree is almost fully grown! ⭐";
  } else if (count >= 120) {
    tree = "🌲🌳🌲";
    treeMessage =
      "Your Faith Tree is growing strong!";
  } else if (count >= 90) {
    tree = "🌳🌳🌳";
    treeMessage =
      "You're halfway through your adventure!";
  } else if (count >= 60) {
    tree = "🌳";
    treeMessage =
      "Look how much your Faith Tree has grown!";
  } else if (count >= 30) {
    tree = "🌿";
    treeMessage =
      "Your faith is growing!";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f1e8",
        padding: "30px 20px 60px",
        fontFamily: "Arial, sans-serif",
        color: "#24313a",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <header
          style={{
            textAlign: "center",
            padding: "20px 10px",
          }}
        >
          <div
            style={{
              fontSize: "75px",
            }}
          >
            🌳
          </div>

          <h1
            style={{
              color: "#315c48",
              fontSize: "38px",
              margin: "5px 0",
            }}
          >
            Faith Foundations
          </h1>

          <h2
            style={{
              fontSize: "24px",
              margin: "5px 0 12px",
            }}
          >
            The M&M Adventure
          </h2>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
            }}
          >
            Growing in God's Word — one day at a time!
          </p>
        </header>

        {/* STUDENT BUTTON */}

        <section
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "30px 25px",
            marginTop: "20px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,.10)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "60px",
            }}
          >
            📖
          </div>

          <h2
            style={{
              color: "#315c48",
              marginBottom: "10px",
            }}
          >
            Student
          </h2>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.6",
            }}
          >
            Ready for today's Bible adventure?
            <br />
            Continue learning and help your Faith
            Tree grow!
          </p>

          <button
            onClick={() => {
              window.location.href = "/Lessons";
            }}
            style={{
              width: "100%",
              padding: "18px",
              marginTop: "12px",
              border: "none",
              borderRadius: "16px",
              background: "#6b9e5b",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🌱 Start Today's Lesson
          </button>
        </section>

        {/* PROGRESS */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginTop: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            <span>🌳 Faith Progress</span>

            <span>
              {count} / 180
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "16px",
              background: "#e4e4e4",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${percentage}%`,
                height: "100%",
                background: "#6b9e5b",
                borderRadius: "20px",
                transition: "width .4s ease",
              }}
            />
          </div>

          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "0",
            }}
          >
            {percentage}% complete
          </p>
        </section>

        {/* FAITH TREE */}

        <section
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "25px",
            marginTop: "20px",
            textAlign: "center",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <div
            style={{
              fontSize: "65px",
              marginBottom: "10px",
            }}
          >
            {tree}
          </div>

          <h2
            style={{
              color: "#315c48",
            }}
          >
            {treeMessage}
          </h2>

          <p
            style={{
              fontSize: "16px",
            }}
          >
            Every completed lesson helps your
            Faith Tree grow!
          </p>
        </section>

        {/* PARENT BUTTON */}

        <section
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => {
              window.location.href = "/parent";
            }}
            style={{
              padding: "13px 22px",
              border: "none",
              borderRadius: "12px",
              background: "#315c48",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔐 Parent Dashboard
          </button>

          <p
            style={{
              fontSize: "13px",
              color: "#777",
              marginTop: "8px",
            }}
          >
            Parent access only
          </p>
        </section>

        <footer
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          Faith Foundations: The M&M Adventure
        </footer>
      </div>
    </main>
  );
}

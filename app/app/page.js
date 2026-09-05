"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "faithTreeCompleted";
const TOTAL_LESSONS = 180;

const FAITH_BADGES = [
  ["🌱", "Faith Seed", 1],
  ["🌱", "First Steps", 10],
  ["🌿", "Growing Strong", 25],
  ["🌳", "Faith Builder", 50],
  ["🏆", "Halfway Hero", 90],
  ["⭐", "Faith Champion", 135],
  ["🏆", "Faith Foundations Champion", 180],
];

export default function Home() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    function loadProgress() {
      try {
        const saved =
          localStorage.getItem(STORAGE_KEY);

        if (!saved) {
          setCompleted([]);
          return;
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
          setCompleted([]);
          return;
        }

        const clean = [
          ...new Set(
            parsed
              .map(Number)
              .filter(
                (day) =>
                  Number.isInteger(day) &&
                  day >= 1 &&
                  day <= TOTAL_LESSONS
              )
          ),
        ].sort((a, b) => a - b);

        setCompleted(clean);
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
    (count / TOTAL_LESSONS) * 100
  );

  /*
   * FIND NEXT LESSON
   */

  let nextLesson = 1;

  for (
    let day = 1;
    day <= TOTAL_LESSONS;
    day++
  ) {
    if (!completed.includes(day)) {
      nextLesson = day;
      break;
    }
  }

  if (count >= TOTAL_LESSONS) {
    nextLesson = TOTAL_LESSONS;
  }

  function startTodayLesson() {
    window.location.href =
      `/Lessons?day=${nextLesson}`;
  }

  /*
   * FAITH TREE
   *
   * IMPORTANT:
   * Tree milestones match the badge milestones exactly:
   *
   * 1   = Faith Seed
   * 10  = First Steps
   * 25  = Growing Strong
   * 50  = Faith Builder
   * 90  = Halfway Hero
   * 135 = Faith Champion
   * 180 = Faith Foundations Champion
   */

  let tree = "🌰";
  let treeMessage =
    "Your faith journey is just beginning!";

  if (count >= 180) {
    tree = "🌲🌳🌲🌳🌲";
    treeMessage =
      "🏆 Your Faith Tree is fully grown!";
  } else if (count >= 135) {
    tree = "🌲🌳🌲🌳";
    treeMessage =
      "⭐ Your Faith Tree is growing beautifully!";
  } else if (count >= 90) {
    tree = "🌳🌳";
    treeMessage =
      "🏆 You're halfway through your adventure!";
  } else if (count >= 50) {
    tree = "🌳";
    treeMessage =
      "Your Faith Tree is growing strong!";
  } else if (count >= 25) {
    tree = "🌿";
    treeMessage =
      "Your faith is growing stronger every day!";
  } else if (count >= 10) {
    tree = "🌱";
    treeMessage =
      "You've taken your First Steps in faith!";
  } else if (count >= 1) {
    tree = "🌱";
    treeMessage =
      "Your Faith Seed has been planted!";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f1e8",
        padding: "25px 16px 60px",
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

        {/* LOGO */}

        <header
          style={{
            textAlign: "center",
            padding: "10px 5px 20px",
          }}
        >
          <img
            src="/faith-foundations-logo.png"
            alt="Faith Foundations: The M&M Adventure"
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "auto",
              display: "block",
              margin: "0 auto",
              borderRadius: "20px",
            }}
          />

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              marginTop: "15px",
            }}
          >
            Growing in God's Word — one day at a time!
          </p>
        </header>

        {/* STUDENT */}

        <section
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "30px 25px",
            marginTop: "10px",
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
            onClick={startTodayLesson}
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
            {count >= TOTAL_LESSONS
              ? "🏆 Review Day 180"
              : `🌱 Start Day ${nextLesson}`}
          </button>

          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#777",
            }}
          >
            {count >= TOTAL_LESSONS
              ? "You've completed all 180 lessons!"
              : `Your next lesson is Day ${nextLesson}.`}
          </p>
        </section>

        {/* CURRENT PROGRESS */}

        <section
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "25px",
            marginTop: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              color: "#315c48",
              textAlign: "center",
              marginTop: "0",
            }}
          >
            📚 Your Current Progress
          </h2>

          <div
            style={{
              textAlign: "center",
              fontSize: "34px",
              fontWeight: "bold",
              color: "#315c48",
              margin: "10px 0",
            }}
          >
            {count} / {TOTAL_LESSONS}
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "0",
              color: "#666",
            }}
          >
            Bible lessons completed
          </p>

          <div
            style={{
              width: "100%",
              height: "18px",
              background: "#e4e4e4",
              borderRadius: "20px",
              overflow: "hidden",
              marginTop: "15px",
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
              marginTop: "10px",
            }}
          >
            {percentage}% complete
          </p>
        </section>

        {/* FAITH BADGES */}

        <section
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "25px 20px",
            marginTop: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              color: "#315c48",
              textAlign: "center",
              marginTop: "0",
              marginBottom: "8px",
            }}
          >
            🏅 Faith Badges
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "20px",
            }}
          >
            Keep learning to earn every badge!
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {FAITH_BADGES.map(
              ([icon, name, required]) => {
                const earned =
                  count >= required;

                return (
                  <div
                    key={name}
                    style={{
                      borderRadius: "18px",
                      padding: "18px 10px",
                      textAlign: "center",
                      background: earned
                        ? "#eef6e9"
                        : "#f3f3f3",
                      border: earned
                        ? "2px solid #6b9e5b"
                        : "2px solid #ddd",
                      opacity: earned
                        ? 1
                        : 0.55,
                      transition:
                        "all .3s ease",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "48px",
                        marginBottom: "6px",
                        filter: earned
                          ? "none"
                          : "grayscale(1)",
                      }}
                    >
                      {icon}
                    </div>

                    <div
                      style={{
                        fontWeight: "bold",
                        color: earned
                          ? "#315c48"
                          : "#777",
                        fontSize: "15px",
                      }}
                    >
                      {name}
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        marginTop: "5px",
                        color: "#777",
                      }}
                    >
                      {earned
                        ? "✓ Earned!"
                        : `${required} lessons`}
                    </div>
                  </div>
                );
              }
            )}
          </div>
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
              lineHeight: "1.2",
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

        {/* PARENT DASHBOARD */}

        <section
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => {
              window.location.href =
                "/parent";
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

        {/* FOOTER */}

        <footer
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          <p>
            Faith Foundations: The M&M Adventure
          </p>

          <p>
            Growing in God's Word — one day at a time. 🌱
          </p>
        </footer>

      </div>
    </main>
  );
}

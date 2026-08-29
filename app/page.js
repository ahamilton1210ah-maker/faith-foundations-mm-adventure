"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "faithTreeCompleted";

export default function Home() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    function loadProgress() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            const clean = [
              ...new Set(
                parsed
                  .map(Number)
                  .filter(
                    (day) =>
                      Number.isInteger(day) &&
                      day >= 1 &&
                      day <= 180
                  )
              ),
            ].sort((a, b) => a - b);

            setCompleted(clean);
          } else {
            setCompleted([]);
          }
        } else {
          setCompleted([]);
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

  const remaining = Math.max(180 - count, 0);

  /*
   * FIND NEXT LESSON
   */

  let nextLesson = 1;

  for (let day = 1; day <= 180; day++) {
    if (!completed.includes(day)) {
      nextLesson = day;
      break;
    }
  }

  if (count >= 180) {
    nextLesson = 180;
  }

  function startTodayLesson() {
    window.location.href = `/Lessons?day=${nextLesson}`;
  }

  /*
   * FAITH TREE
   */

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

  /*
   * FAITH BADGES
   */

  const badges = [
    {
      days: 1,
      icon: "🌱",
      name: "Faith Seed",
      message: "You started your Faith Adventure!",
    },
    {
      days: 10,
      icon: "🌿",
      name: "Growing Faith",
      message: "Your faith is beginning to grow!",
    },
    {
      days: 30,
      icon: "🌳",
      name: "Faith Builder",
      message: "30 lessons completed!",
    },
    {
      days: 60,
      icon: "⭐",
      name: "Faith Shining",
      message: "Your faith is shining bright!",
    },
    {
      days: 90,
      icon: "🏆",
      name: "Halfway Hero",
      message: "You've reached the halfway point!",
    },
    {
      days: 120,
      icon: "💚",
      name: "Strong in Faith",
      message: "Your Faith Tree is growing strong!",
    },
    {
      days: 150,
      icon: "👑",
      name: "Faith Champion",
      message: "Only 30 lessons remain!",
    },
    {
      days: 180,
      icon: "🏅",
      name: "Faith Foundations Champion",
      message: "You completed all 180 lessons!",
    },
  ];

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
            {count >= 180
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
            {count >= 180
              ? "You've completed all 180 lessons!"
              : `Your next lesson is Day ${nextLesson}.`}
          </p>
        </section>

        {/* CURRENT PROGRESS */}

        <section
          style={{
            background: "white",
            borderRadius: "22px",
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
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "#315c48",
                }}
              >
                {count}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#777",
                }}
              >
                Completed
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "#315c48",
                }}
              >
                {remaining}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#777",
                }}
              >
                Remaining
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "#315c48",
                }}
              >
                {percentage}%
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#777",
                }}
              >
                Complete
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}

          <div
            style={{
              width: "100%",
              height: "18px",
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
                transition: "width .5s ease",
              }}
            />
          </div>

          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "0",
              marginTop: "12px",
            }}
          >
            {count === 0
              ? "Your adventure is just beginning! 🌱"
              : count === 180
              ? "You did it! All 180 lessons completed! 🎉"
              : `${count} of 180 lessons completed!`}
          </p>
        </section>

        {/* FAITH BADGES */}

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
            🏅 Faith Badges
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: "15px",
              marginBottom: "20px",
            }}
          >
            Keep completing lessons to earn new badges!
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {badges.map((badge) => {
              const earned = count >= badge.days;

              return (
                <div
                  key={badge.days}
                  style={{
                    padding: "18px 10px",
                    borderRadius: "18px",
                    textAlign: "center",
                    background: earned
                      ? "#f7f1d7"
                      : "#f1f1f1",
                    border: earned
                      ? "2px solid #d9c77a"
                      : "2px solid #e2e2e2",
                    opacity: earned ? 1 : 0.5,
                  }}
                >
                  <div
                    style={{
                      fontSize: "42px",
                      filter: earned
                        ? "none"
                        : "grayscale(1)",
                    }}
                  >
                    {earned
                      ? badge.icon
                      : "🔒"}
                  </div>

                  <h3
                    style={{
                      fontSize: "15px",
                      margin:
                        "8px 0 5px",
                      color: "#315c48",
                    }}
                  >
                    {badge.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "12px",
                      margin: "0",
                      color: "#666",
                      lineHeight: "1.4",
                    }}
                  >
                    {earned
                      ? badge.message
                      : `Complete ${badge.days} lessons`}
                  </p>
                </div>
              );
            })}
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

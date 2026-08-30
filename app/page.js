"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "faithTreeCompleted";

/* =========================
   FAITH BADGES
   SAME MILESTONES AS LESSONS
========================= */

const badges = [
  {
    days: 10,
    icon: "🌱",
    name: "First Steps",
    message: "You completed your first 10 Bible lessons!",
  },
  {
    days: 25,
    icon: "🌿",
    name: "Growing Strong",
    message: "Your faith is growing stronger!",
  },
  {
    days: 50,
    icon: "🌳",
    name: "Faith Builder",
    message: "You are building a strong foundation of faith!",
  },
  {
    days: 90,
    icon: "🏆",
    name: "Halfway Hero",
    message: "You're halfway through your adventure!",
  },
  {
    days: 135,
    icon: "⭐",
    name: "Faith Champion",
    message: "Your faith is shining bright!",
  },
  {
    days: 180,
    icon: "🏆",
    name: "Faith Foundations Champion",
    message: "You completed all 180 Bible lessons!",
  },
];

/* =========================
   FAITH TREE
   MUST MATCH LESSONS PAGE
========================= */

function getFaithTree(count) {
  if (count >= 180) {
    return {
      tree: "🏆🌳🏆",
      title: "Faith Foundations Champion!",
      message:
        "Your Faith Tree is fully grown! You completed all 180 lessons!",
      buttonIcon: "🏆",
    };
  }

  if (count >= 135) {
    return {
      tree: "🌲🌳🌲",
      title: "Faith Champion!",
      message:
        "Your faith is shining strong! Keep growing toward 180 lessons!",
      buttonIcon: "🌲",
    };
  }

  if (count >= 90) {
    return {
      tree: "🌳🌳",
      title: "Halfway Hero!",
      message:
        "You are halfway through your Faith Foundations adventure!",
      buttonIcon: "🌳",
    };
  }

  if (count >= 50) {
    return {
      tree: "🌳",
      title: "Faith Builder!",
      message:
        "Your Faith Tree is growing strong!",
      buttonIcon: "🌳",
    };
  }

  if (count >= 25) {
    return {
      tree: "🌿",
      title: "Growing Strong!",
      message:
        "Your faith is growing stronger every day!",
      buttonIcon: "🌿",
    };
  }

  if (count >= 10) {
    return {
      tree: "🌱",
      title: "First Steps!",
      message:
        "You have taken your first big steps in your faith adventure!",
      buttonIcon: "🌱",
    };
  }

  if (count >= 1) {
    return {
      tree: "🌱",
      title: "Faith Is Taking Root!",
      message:
        "You have started growing in God's Word. Keep going!",
      buttonIcon: "🌱",
    };
  }

  return {
    tree: "🌰",
    title: "Ready to Begin?",
    message:
      "Complete your first Bible lesson and begin growing your Faith Tree!",
    buttonIcon: "🌱",
  };
}

/* =========================
   CLEAN SAVED PROGRESS
========================= */

function getSavedCompleted() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return [
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
  } catch {
    return [];
  }
}

/* =========================
   HOME / STUDENT PAGE
========================= */

export default function Home() {
  const [completed, setCompleted] = useState([]);

  /* =========================
     LOAD PROGRESS
  ========================= */

  useEffect(() => {
    function loadProgress() {
      try {
        const saved =
          localStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed =
            JSON.parse(saved);

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

    /* =========================
       SYNC WHEN LESSON COMPLETES
    ========================= */

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

  /* =========================
     PROGRESS
  ========================= */

  const count = completed.length;

  const percentage = Math.round(
    (count / 180) * 100
  );

  const remaining = Math.max(
    180 - count,
    0
  );

  /* =========================
     FIND NEXT LESSON
  ========================= */

  let nextLesson = 1;

  for (
    let day = 1;
    day <= 180;
    day++
  ) {
    if (!completed.includes(day)) {
      nextLesson = day;
      break;
    }
  }

  if (count >= 180) {
    nextLesson = 180;
  }

  /* =========================
     CURRENT FAITH TREE
  ========================= */

  const faithTree =
    getFaithTree(count);

  /* =========================
     START TODAY'S LESSON
  ========================= */

  function startTodayLesson() {
    window.location.href =
      `/Lessons?day=${nextLesson}`;
  }

  /* =========================
     GO TO PARENT DASHBOARD
  ========================= */

  function openParentDashboard() {
    window.location.href =
      "/parent";
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f1e8",
        padding: "25px 16px 60px",
        fontFamily:
          "Arial, sans-serif",
        color: "#24313a",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >

        {/* =====================
            LOGO
        ===================== */}

        <header
          style={{
            textAlign: "center",
            padding:
              "10px 5px 20px",
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
            Growing in God's Word —
            one day at a time!
          </p>
        </header>

        {/* =====================
            STUDENT
        ===================== */}

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

          {/* =====================
              START DAY BUTTON
              TREE ICON NOW MATCHES
              CURRENT MILESTONE
          ===================== */}

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
              : `${faithTree.buttonIcon} Start Day ${nextLesson}`}
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

        {/* =====================
            CURRENT PROGRESS
        ===================== */}

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
              justifyContent:
                "space-around",
              textAlign: "center",
              margin: "20px 0",
            }}
          >

            {/* COMPLETED */}

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

            {/* REMAINING */}

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

            {/* PERCENTAGE */}

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

          {/* =====================
              PROGRESS BAR
          ===================== */}

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
                width:
                  `${percentage}%`,
                height: "100%",
                background: "#6b9e5b",
                borderRadius: "20px",
                transition:
                  "width .5s ease",
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

        {/* =====================
            FAITH BADGES
        ===================== */}

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
            Keep completing lessons to earn
            new badges!
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
              const earned =
                count >= badge.days;

              return (
                <div
                  key={badge.days}
                  style={{
                    padding:
                      "18px 10px",
                    borderRadius:
                      "18px",
                    textAlign: "center",
                    background:
                      earned
                        ? "#f7f1d7"
                        : "#f1f1f1",
                    border:
                      earned
                        ? "2px solid #d9c77a"
                        : "2px solid #e2e2e2",
                    opacity:
                      earned ? 1 : 0.5,
                  }}
                >

                  {/* BADGE ICON */}

                  <div
                    style={{
                      fontSize: "42px",
                      filter:
                        earned
                          ? "none"
                          : "grayscale(1)",
                    }}
                  >
                    {earned
                      ? badge.icon
                      : "🔒"}
                  </div>

                  {/* BADGE NAME */}

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

                  {/* MESSAGE */}

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

                  {/* REQUIREMENT */}

                  <p
                    style={{
                      fontSize: "11px",
                      marginTop: "7px",
                      color: "#888",
                    }}
                  >
                    {badge.days} Lessons
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================
            FAITH TREE
            NOW MATCHES LESSONS
            PAGE EXACTLY
        ===================== */}

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

          {/* TREE */}

          <div
            style={{
              fontSize: "65px",
              marginBottom: "10px",
            }}
          >
            {faithTree.tree}
          </div>

          {/* TREE TITLE */}

          <h2
            style={{
              color: "#315c48",
            }}
          >
            {faithTree.title}
          </h2>

          {/* TREE MESSAGE */}

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            {faithTree.message}
          </p>

          {/* TREE PROGRESS */}

          <div
            style={{
              marginTop: "15px",
              background: "#e9f4ed",
              borderRadius: "15px",
              padding: "15px",
            }}
          >
            <strong>
              🌳 Faith Tree Progress
            </strong>

            <p
              style={{
                margin:
                  "8px 0 0",
              }}
            >
              {count} /
              180 lessons completed
            </p>

            <p
              style={{
                margin:
                  "5px 0 0",
                fontWeight: "bold",
              }}
            >
              {percentage}%
              Complete
            </p>
          </div>

          {/* TREE ENCOURAGEMENT */}

          <p
            style={{
              marginTop: "18px",
              fontSize: "15px",
              color: "#666",
            }}
          >
            Every completed lesson helps your
            Faith Tree grow! 🌱
          </p>
        </section>

        {/* =====================
            PARENT DASHBOARD
        ===================== */}

        <section
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <button
            onClick={
              openParentDashboard
            }
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

        {/* =====================
            FOOTER
        ===================== */}

        <footer
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          <p>
            Faith Foundations:
            The M&M Adventure
          </p>

          <p>
            Growing in God's Word —
            one day at a time. 🌱
          </p>
        </footer>

      </div>
    </main>
  );
}

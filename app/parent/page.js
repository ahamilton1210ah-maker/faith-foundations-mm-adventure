"use client";

import { useEffect, useState } from "react";

/* =========================================================
   SETTINGS
========================================================= */

const PARENT_PASSWORD = "M&M2026";

const STORAGE_KEY = "faithTreeCompleted";
const NOTES_KEY = "faithParentNotes";

const MIDTERM_ATTEMPTS_KEY = "faithMidtermAttempts";
const MIDTERM_PASS_SCORE_KEY = "faithMidtermPassingScore";

const FINAL_ATTEMPTS_KEY = "faithFinalAttempts";
const FINAL_PASS_SCORE_KEY = "faithFinalPassingScore";

const TOTAL_LESSONS = 180;
const PASSING_SCORE = 80;

/* =========================================================
   PARENT DASHBOARD
========================================================= */

export default function Parent() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const [completed, setCompleted] = useState([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const [midtermScore, setMidtermScore] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  const [midtermAttempts, setMidtermAttempts] = useState([]);
  const [finalAttempts, setFinalAttempts] = useState([]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    try {
      const parentAccess =
        sessionStorage.getItem("parentAccess");

      if (parentAccess === "true") {
        setUnlocked(true);
      }
    } catch {
      setUnlocked(false);
    }

    loadNotes();
    loadExamData();
    loadProgress();
  }, []);

  /* =======================================================
     LOAD NOTES
  ======================================================= */

  function loadNotes() {
    try {
      const savedNotes =
        localStorage.getItem(NOTES_KEY);

      if (savedNotes !== null) {
        setNotes(savedNotes);
      }
    } catch {
      setNotes("");
    }
  }

  /* =======================================================
     LOAD PROGRESS
  ======================================================= */

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

  /* =======================================================
     LOAD EXAM DATA
  ======================================================= */

  function getScore(primaryKey, fallbackKey = null) {
    try {
      const keys = fallbackKey
        ? [primaryKey, fallbackKey]
        : [primaryKey];

      for (const key of keys) {
        const saved =
          localStorage.getItem(key);

        if (
          saved !== null &&
          saved !== ""
        ) {
          const numeric = Number(saved);

          if (
            Number.isFinite(numeric) &&
            numeric >= 0 &&
            numeric <= 100
          ) {
            return numeric;
          }
        }
      }
    } catch {
      return null;
    }

    return null;
  }

  function loadExamData() {
    /* ---------------- MIDTERM SCORE ---------------- */

    setMidtermScore(
      getScore(
        MIDTERM_PASS_SCORE_KEY,
        "faithMidtermScore"
      )
    );

    /* ---------------- FINAL SCORE ---------------- */

    setFinalScore(
      getScore(
        FINAL_PASS_SCORE_KEY,
        "faithFinalScore"
      )
    );

    /* ---------------- MIDTERM ATTEMPTS ---------------- */

    try {
      const saved =
        localStorage.getItem(
          MIDTERM_ATTEMPTS_KEY
        );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMidtermAttempts(parsed);
        } else {
          setMidtermAttempts([]);
        }
      } else {
        setMidtermAttempts([]);
      }
    } catch {
      setMidtermAttempts([]);
    }

    /* ---------------- FINAL ATTEMPTS ---------------- */

    try {
      const saved =
        localStorage.getItem(
          FINAL_ATTEMPTS_KEY
        );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setFinalAttempts(parsed);
        } else {
          setFinalAttempts([]);
        }
      } else {
        setFinalAttempts([]);
      }
    } catch {
      setFinalAttempts([]);
    }
  }

  /* =======================================================
     LIVE UPDATES
  ======================================================= */

  useEffect(() => {
    if (!unlocked) return;

    function refreshData() {
      loadProgress();
      loadExamData();
    }

    window.addEventListener(
      "faithTreeProgressUpdated",
      refreshData
    );

    window.addEventListener(
      "storage",
      refreshData
    );

    return () => {
      window.removeEventListener(
        "faithTreeProgressUpdated",
        refreshData
      );

      window.removeEventListener(
        "storage",
        refreshData
      );
    };
  }, [unlocked]);

  /* =======================================================
     LOGIN
  ======================================================= */

  function handleLogin(e) {
    e.preventDefault();

    if (password === PARENT_PASSWORD) {
      sessionStorage.setItem(
        "parentAccess",
        "true"
      );

      setUnlocked(true);
      setPassword("");
      setError("");

      loadProgress();
      loadExamData();
    } else {
      setError(
        "Incorrect parent password. Please try again."
      );
    }
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  function logout() {
    sessionStorage.removeItem(
      "parentAccess"
    );

    setUnlocked(false);
    setPassword("");
    setError("");
  }

  /* =======================================================
     NOTES
  ======================================================= */

  function saveNotes(value) {
    setNotes(value);

    try {
      localStorage.setItem(
        NOTES_KEY,
        value
      );
    } catch {
      // Ignore storage errors
    }
  }

  /* =======================================================
     PROGRESS
  ======================================================= */

  const completedCount =
    completed.length;

  const progressPercent =
    Math.round(
      (completedCount /
        TOTAL_LESSONS) *
        100
    );

  function getNextLesson() {
    for (
      let day = 1;
      day <= TOTAL_LESSONS;
      day++
    ) {
      if (!completed.includes(day)) {
        return day;
      }
    }

    return null;
  }

  const nextLesson =
    getNextLesson();

  /* =======================================================
     BADGES
  ======================================================= */

  const badges = [
    ["🌱", "First Steps", 10],
    ["🌿", "Growing Strong", 25],
    ["🌳", "Faith Builder", 50],
    ["⭐", "Halfway Hero", 90],
    ["🏅", "Faith Champion", 135],
    [
      "🏆",
      "Faith Foundations Champion",
      180,
    ],
  ];

  /* =======================================================
     EXAM STATUS
  ======================================================= */

  const midtermPassed =
    midtermScore !== null &&
    midtermScore >= PASSING_SCORE;

  const midtermNotPassed =
    midtermScore !== null &&
    midtermScore < PASSING_SCORE;

  const finalPassed =
    finalScore !== null &&
    finalScore >= PASSING_SCORE;

  const finalNotPassed =
    finalScore !== null &&
    finalScore < PASSING_SCORE;

  /* =======================================================
     STUDENT LESSON PREVIEW
  ======================================================= */

  function previewLessons() {
    window.location.href =
      "/Lessons?parent=true";
  }

  function openNextLesson() {
    if (!nextLesson) {
      alert(
        "🎉 All 180 lessons are complete!"
      );
      return;
    }

    window.location.href =
      `/Lessons?parent=true&day=${nextLesson}`;
  }

  /* =======================================================
     MIDTERM
     
     ONE BUTTON ONLY
     
     Opens the Midterm page starting at Day 88.
     Parent can move between Days 88–90 from there.
  ======================================================= */

  function openMidterm() {
    window.location.href =
      "/Midterm?parent=true&day=88";
  }

  /* =======================================================
     FINAL
     
     ONE BUTTON ONLY
     
     Opens the Final page starting at Day 177.
     Parent can move between Days 177–180 from there.
  ======================================================= */

  function openFinal() {
    window.location.href =
      "/Final?parent=true&day=177";
  }

  /* =======================================================
     PRINT REPORT
  ======================================================= */

  function printReport() {
    const reportWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=1000"
      );

    if (!reportWindow) {
      alert(
        "Please allow pop-ups so the progress report can open."
      );
      return;
    }

    const completedList =
      completed.length > 0
        ? completed.join(", ")
        : "No lessons completed yet.";

    const earnedBadges =
      badges
        .filter(
          (badge) =>
            completedCount >= badge[2]
        )
        .map(
          (badge) =>
            `${badge[0]} ${badge[1]}`
        )
        .join("<br>") ||
      "No badges earned yet.";

    reportWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <title>
          Faith Foundations Progress Report
        </title>

        <style>

          body {
            font-family: Arial, sans-serif;
            color: #24313a;
            padding: 35px;
          }

          .page {
            max-width: 800px;
            margin: auto;
          }

          h1,
          h2 {
            color: #315c48;
          }

          .center {
            text-align: center;
          }

          .box {
            border: 1px solid #ccc;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
          }

          .line {
            border-bottom: 1px solid #333;
            padding: 8px 0;
          }

          @media print {

            @page {
              margin: 0.5in;
            }

          }

        </style>

      </head>

      <body>

        <div class="page">

          <h1 class="center">
            🌳 Faith Foundations
          </h1>

          <h2 class="center">
            The M&M Adventure
          </h2>

          <h2 class="center">
            Parent Progress Report
          </h2>

          <div class="box">

            <div class="line">
              Student:
            </div>

            <div class="line">
              Date:
              ${new Date().toLocaleDateString()}
            </div>

            <div class="line">
              Lessons Completed:
              ${completedCount} / ${TOTAL_LESSONS}
            </div>

            <div class="line">
              Overall Progress:
              ${progressPercent}%
            </div>

          </div>

          <div class="box">

            <h2>
              🏆 Badges Earned
            </h2>

            <p>
              ${earnedBadges}
            </p>

          </div>

          <div class="box">

            <h2>
              📚 Completed Lessons
            </h2>

            <p>
              ${completedList}
            </p>

          </div>

          <div class="box">

            <h2>
              📝 Midterm
            </h2>

            ${
              midtermScore !== null
                ? `
                  <p>
                    Score:
                    <strong>
                      ${midtermScore}%
                    </strong>
                  </p>

                  <p>
                    ${
                      midtermPassed
                        ? "🎉 PASSED"
                        : "📖 NOT PASSED"
                    }
                  </p>
                `
                : `
                  <p>
                    Midterm not completed yet.
                  </p>
                `
            }

            <p>
              Passing score:
              <strong>80% or higher</strong>
            </p>

          </div>

          <div class="box">

            <h2>
              🏆 Final
            </h2>

            ${
              finalScore !== null
                ? `
                  <p>
                    Score:
                    <strong>
                      ${finalScore}%
                    </strong>
                  </p>

                  <p>
                    ${
                      finalPassed
                        ? "🎉 PASSED"
                        : "📖 NOT PASSED"
                    }
                  </p>
                `
                : `
                  <p>
                    Final not completed yet.
                  </p>
                `
            }

            <p>
              Passing score:
              <strong>80% or higher</strong>
            </p>

          </div>

          <div class="box">

            <h2>
              📓 Parent Notes
            </h2>

            <p>
              ${
                notes
                  ? notes.replace(
                      /\n/g,
                      "<br>"
                    )
                  : "No parent notes."
              }
            </p>

          </div>

        </div>

      </body>

      </html>
    `);

    reportWindow.document.close();

    setTimeout(() => {
      reportWindow.focus();
      reportWindow.print();
    }, 500);
  }

  /* =======================================================
     LOGIN SCREEN
  ======================================================= */

  if (!unlocked) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f8f5ed",
          padding: "40px 15px",
          fontFamily: "Arial, sans-serif",
          color: "#24313a",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "80px auto",
          }}
        >
          <section
            style={{
              background: "white",
              borderRadius: "22px",
              padding: "35px",
              textAlign: "center",
              boxShadow:
                "0 5px 20px rgba(0,0,0,.12)",
            }}
          >
            <div
              style={{
                fontSize: "65px",
              }}
            >
              👩‍🏫🌳
            </div>

            <h1
              style={{
                color: "#315c48",
              }}
            >
              Parent Dashboard
            </h1>

            <p>
              Faith Foundations:
              <br />
              The M&M Adventure
            </p>

            <p
              style={{
                marginTop: "20px",
              }}
            >
              Enter the parent password to continue.
            </p>

            <form
              onSubmit={handleLogin}
            >
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Parent password"
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding: "15px",
                  borderRadius: "12px",
                  border:
                    "2px solid #ccc",
                  fontSize: "18px",
                  marginTop: "15px",
                }}
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "16px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#315c48",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  cursor: "pointer",
                }}
              >
                🔐 Enter Parent Dashboard
              </button>
            </form>

            {error && (
              <p
                style={{
                  marginTop: "15px",
                  color: "#b42318",
                  fontWeight: "bold",
                }}
              >
                {error}
              </p>
            )}

            <button
              onClick={() =>
                (window.location.href = "/")
              }
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                background: "#eee",
                cursor: "pointer",
              }}
            >
              ← Back to Home
            </button>
          </section>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN DASHBOARD
  ======================================================= */

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f5ed",
        padding: "30px 15px 60px",
        fontFamily: "Arial, sans-serif",
        color: "#24313a",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >

        {/* HEADER */}

        <header
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "65px",
            }}
          >
            👩‍🏫🌳
          </div>

          <h1
            style={{
              color: "#315c48",
              marginBottom: "8px",
            }}
          >
            Parent Dashboard
          </h1>

          <p>
            Faith Foundations:
            The M&M Adventure
          </p>

          <button
            onClick={logout}
            style={{
              marginTop: "10px",
              padding: "10px 18px",
              border: "none",
              borderRadius: "10px",
              background: "#777",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔒 Lock Parent Dashboard
          </button>
        </header>

        {/* PROGRESS */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.1)",
          }}
        >
          <h2>
            📊 Student Progress
          </h2>

          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#315c48",
              }}
            >
              {completedCount}
            </div>

            <p>
              of {TOTAL_LESSONS} lessons completed
            </p>

            <div
              style={{
                width: "100%",
                height: "24px",
                background: "#e5e5e5",
                borderRadius: "20px",
                overflow: "hidden",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "#6b9e5b",
                  borderRadius: "20px",
                  transition:
                    "width .3s ease",
                }}
              />
            </div>

            <p
              style={{
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              {progressPercent}% Complete
            </p>
          </div>
        </section>

        {/* PARENT TOOLS */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.1)",
          }}
        >
          <h2>
            🛠️ Parent Tools
          </h2>

          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "18px",
            }}
          >
            <button
              onClick={previewLessons}
              style={{
                padding: "16px",
                border: "none",
                borderRadius: "14px",
                background: "#315c48",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              👀 Preview Student Lessons
            </button>

            <button
              onClick={openNextLesson}
              style={{
                padding: "16px",
                border: "none",
                borderRadius: "14px",
                background: "#6b9e5b",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              📚 Open Next Student Lesson
            </button>

            <button
              onClick={printReport}
              style={{
                padding: "16px",
                border: "none",
                borderRadius: "14px",
                background: "#777",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              🖨️ Print Progress Report
            </button>
          </div>

          <p
            style={{
              marginTop: "15px",
              fontSize: "13px",
              color: "#666",
              textAlign: "center",
            }}
          >
            👀 Parent previews do not count as completed
            student lessons.
          </p>
        </section>

        {/* FAITH TREE */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
            textAlign: "center",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.1)",
          }}
        >
          <h2>
            🌳 Faith Tree
          </h2>

          <div
            style={{
              fontSize: "90px",
              margin: "20px 0",
            }}
          >
            {completedCount >= 180
              ? "🌳🏆"
              : completedCount >= 135
              ? "🌳🌿"
              : completedCount >= 90
              ? "🌳"
              : completedCount >= 50
              ? "🌿"
              : completedCount >= 25
              ? "🌱"
              : completedCount >= 10
              ? "🌱"
              : "🌰"}
          </div>

          <h3
            style={{
              color: "#315c48",
            }}
          >
            {completedCount >= 180
              ? "🏆 Your Faith Tree is fully grown!"
              : completedCount >= 135
              ? "Your faith is growing strong!"
              : completedCount >= 90
              ? "⭐ Halfway Hero!"
              : completedCount >= 50
              ? "Your faith is becoming strong!"
              : completedCount >= 25
              ? "🌿 Your faith is growing!"
              : completedCount >= 10
              ? "🌱 Your faith is taking root!"
              : "🌰 Your faith journey is beginning!"}
          </h3>

          <p>
            Every completed lesson helps the Faith Tree
            grow.
          </p>
        </section>

        {/* BADGES */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
          }}
        >
          <h2>
            🏆 Badges
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: "12px",
              marginTop: "18px",
            }}
          >
            {badges.map(
              (badge, index) => {
                const earned =
                  completedCount >=
                  badge[2];

                return (
                  <div
                    key={index}
                    style={{
                      padding: "18px",
                      borderRadius: "15px",
                      textAlign: "center",
                      background: earned
                        ? "#e9f4ed"
                        : "#f0eee7",
                      border: earned
                        ? "2px solid #6b9e5b"
                        : "2px solid #ddd",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "40px",
                      }}
                    >
                      {badge[0]}
                    </div>

                    <strong>
                      {badge[1]}
                    </strong>

                    <p
                      style={{
                        fontSize: "13px",
                        marginBottom: 0,
                      }}
                    >
                      {badge[2]} lessons
                    </p>

                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      {earned
                        ? "✅ Earned"
                        : "🔒 Locked"}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* =================================================
            MIDTERM
            ONE BUTTON
        ================================================= */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.1)",
          }}
        >
          <h2>
            📝 Midterm Review & Exam
          </h2>

          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              borderRadius: "12px",
              background: "#fff4df",
            }}
          >
            <strong>
              Parent Preview Access
            </strong>

            <p
              style={{
                marginBottom: 0,
              }}
            >
              You can view Days 88, 89, and 90 now.
              You do NOT need to complete the lessons
              first.
            </p>
          </div>

          <button
            onClick={openMidterm}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: "#315c48",
              color: "white",
              fontWeight: "bold",
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            👀 Preview Midterm — Days 88–90
          </button>

          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "14px",
              background: midtermPassed
                ? "#e9f4ed"
                : midtermNotPassed
                ? "#fff0ed"
                : "#f5f5f5",
              textAlign: "center",
            }}
          >
            <h3>
              {midtermPassed
                ? "🎉 Midterm Passed"
                : midtermNotPassed
                ? "📖 Midterm Not Passed"
                : "⏳ Midterm Not Taken"}
            </h3>

            {midtermScore !== null && (
              <p>
                Score:
                <strong>
                  {" "}
                  {midtermScore}%
                </strong>
              </p>
            )}

            <p
              style={{
                fontSize: "14px",
              }}
            >
              Passing score:
              <strong> 80% or higher</strong>
            </p>

            <p
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              Attempts saved:
              {" "}
              {midtermAttempts.length}
            </p>
          </div>
        </section>

        {/* =================================================
            FINAL
            ONE BUTTON
        ================================================= */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.1)",
          }}
        >
          <h2>
            🏆 Final Review & Exam
          </h2>

          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              borderRadius: "12px",
              background: "#fff4df",
            }}
          >
            <strong>
              Parent Preview Access
            </strong>

            <p
              style={{
                marginBottom: 0,
              }}
            >
              You can preview Days 177, 178, 179,
              and 180 at any time. They do NOT need
              to be completed first.
            </p>
          </div>

          <button
            onClick={openFinal}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: "#315c48",
              color: "white",
              fontWeight: "bold",
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            👀 Preview Final — Days 177–180
          </button>

          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "14px",
              background: finalPassed
                ? "#e9f4ed"
                : finalNotPassed
                ? "#fff0ed"
                : "#f5f5f5",
              textAlign: "center",
            }}
          >
            <h3>
              {finalPassed
                ? "🎉 Final Passed"
                : finalNotPassed
                ? "📖 Final Not Passed"
                : "⏳ Final Not Taken"}
            </h3>

            {finalScore !== null && (
              <p>
                Score:
                <strong>
                  {" "}
                  {finalScore}%
                </strong>
              </p>
            )}

            <p
              style={{
                fontSize: "14px",
              }}
            >
              Passing score:
              <strong> 80% or higher</strong>
            </p>

            <p
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              Attempts saved:
              {" "}
              {finalAttempts.length}
            </p>
          </div>
        </section>

        {/* PARENT NOTES */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.1)",
          }}
        >
          <h2>
            📝 Parent Notes
          </h2>

          <p
            style={{
              color: "#666",
              fontSize: "14px",
            }}
          >
            These notes automatically save on this device.
          </p>

          <textarea
            value={notes}
            onChange={(e) =>
              saveNotes(e.target.value)
            }
            placeholder="Write notes about your student's progress..."
            style={{
              width: "100%",
              minHeight: "220px",
              boxSizing: "border-box",
              padding: "15px",
              borderRadius: "12px",
              border: "2px solid #ccc",
              fontSize: "16px",
              fontFamily:
                "Arial, sans-serif",
              resize: "vertical",
            }}
          />

          <p
            style={{
              fontSize: "13px",
              color: "#6b9e5b",
              fontWeight: "bold",
              marginBottom: 0,
            }}
          >
            ✅ Notes save automatically.
          </p>
        </section>

        {/* COMPLETION */}

        {completedCount >= 180 && (
          <section
            style={{
              background: "#e9f4ed",
              borderRadius: "20px",
              padding: "30px",
              textAlign: "center",
              border:
                "2px solid #6b9e5b",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "65px",
              }}
            >
              🏆🌳🎉
            </div>

            <h2
              style={{
                color: "#315c48",
              }}
            >
              Faith Foundations Champion!
            </h2>

            <p>
              All 180 school days have been completed!
            </p>

            <p
              style={{
                fontWeight: "bold",
              }}
            >
              The Faith Tree is fully grown! 🌳
            </p>
          </section>
        )}

        {/* BACK HOME */}

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <button
            onClick={() =>
              (window.location.href = "/")
            }
            style={{
              padding: "14px 24px",
              border: "none",
              borderRadius: "12px",
              background: "#315c48",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ← Back to Student Home
          </button>
        </div>

      </div>
    </main>
  );
}

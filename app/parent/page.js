"use client";

import { useEffect, useState } from "react";

const PARENT_PASSWORD = "M&M2026";

const STORAGE_KEY = "faithTreeCompleted";
const NOTES_KEY = "faithParentNotes";

const MIDTERM_SCORE_KEY = "faithMidtermScore";
const FINAL_SCORE_KEY = "faithFinalScore";

const TOTAL_LESSONS = 180;

export default function Parent() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [midtermScore, setMidtermScore] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  /* =========================================================
     LOAD PARENT ACCESS + NOTES + EXAM SCORES
  ========================================================= */

  useEffect(() => {
    const parentAccess = sessionStorage.getItem("parentAccess");

    if (parentAccess === "true") {
      setUnlocked(true);
    }

    const savedNotes = localStorage.getItem(NOTES_KEY);

    if (savedNotes !== null) {
      setNotes(savedNotes);
    }

    loadExamScores();
  }, []);

  /* =========================================================
     LOAD EXAM SCORES
  ========================================================= */

  function getStoredScore(keys) {
    for (const key of keys) {
      const saved = localStorage.getItem(key);

      if (saved !== null && saved !== "") {
        const number = Number(saved);

        if (
          Number.isFinite(number) &&
          number >= 0 &&
          number <= 100
        ) {
          return number;
        }
      }
    }

    return null;
  }

  function loadExamScores() {
    const midterm = getStoredScore([
      MIDTERM_SCORE_KEY,
      "midtermScore",
      "faithMidtermExamScore",
    ]);

    const final = getStoredScore([
      FINAL_SCORE_KEY,
      "finalScore",
      "faithFinalExamScore",
    ]);

    setMidtermScore(midterm);
    setFinalScore(final);
  }

  /* =========================================================
     LOAD STUDENT PROGRESS
  ========================================================= */

  useEffect(() => {
    if (!unlocked) return;

    function loadProgress() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

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
      } catch (error) {
        console.error(
          "Could not load student progress:",
          error
        );

        setCompleted([]);
      }
    }

    loadProgress();
    loadExamScores();

    window.addEventListener(
      "faithTreeProgressUpdated",
      loadProgress
    );

    window.addEventListener("storage", () => {
      loadProgress();
      loadExamScores();
    });

    return () => {
      window.removeEventListener(
        "faithTreeProgressUpdated",
        loadProgress
      );
    };
  }, [unlocked]);

  /* =========================================================
     LOGIN
  ========================================================= */

  function handleLogin(e) {
    e.preventDefault();

    if (password === PARENT_PASSWORD) {
      sessionStorage.setItem("parentAccess", "true");

      setUnlocked(true);
      setPassword("");
      setError("");
    } else {
      setError(
        "❌ Incorrect password. Please try again."
      );

      setPassword("");
    }
  }

  /* =========================================================
     LOGOUT
  ========================================================= */

  function logout() {
    sessionStorage.removeItem("parentAccess");

    setUnlocked(false);
    setPassword("");
    setError("");
  }

  /* =========================================================
     NOTES
  ========================================================= */

  function saveNotes(value) {
    setNotes(value);
    localStorage.setItem(NOTES_KEY, value);
  }

  /* =========================================================
     LESSON HELPERS
  ========================================================= */

  function isComplete(day) {
    return completed.includes(day);
  }

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

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function goToNextLesson() {
    const nextLesson = getNextLesson();

    if (!nextLesson) {
      alert(
        "🎉 All 180 lessons are complete!"
      );

      return;
    }

    window.location.href =
      `/Lessons?parent=true&day=${nextLesson}`;
  }

  function previewLessons() {
    window.location.href =
      "/Lessons?parent=true";
  }

  /* =========================================================
     SPECIFIC MIDTERM NAVIGATION
  ========================================================= */

  function openMidtermGuide1() {
    window.location.href =
      "/Midterm?parent=true&day=88";
  }

  function openMidtermGuide2() {
    window.location.href =
      "/Midterm?parent=true&day=89";
  }

  function openMidtermExam() {
    window.location.href =
      "/Midterm?parent=true&day=90";
  }

  /* =========================================================
     SPECIFIC FINAL NAVIGATION
  ========================================================= */

  function openFinalGuide1() {
    window.location.href =
      "/Final?parent=true&day=177";
  }

  function openFinalGuide2() {
    window.location.href =
      "/Final?parent=true&day=178";
  }

  function openFinalExam() {
    window.location.href =
      "/Final?parent=true&day=179";
  }

  /* =========================================================
     EXAM RESULTS
  ========================================================= */

  const midtermPassed =
    midtermScore !== null &&
    midtermScore >= 80;

  const midtermNotPassed =
    midtermScore !== null &&
    midtermScore <= 79;

  const finalPassed =
    finalScore !== null &&
    finalScore >= 80;

  const finalNotPassed =
    finalScore !== null &&
    finalScore <= 79;

  /* =========================================================
     PROGRESS VALUES
  ========================================================= */

  const count = completed.length;

  const percentage = Math.min(
    100,
    Math.round(
      (count / TOTAL_LESSONS) * 100
    )
  );

  const nextLesson = getNextLesson();

  /* =========================================================
     FAITH TREE
  ========================================================= */

  let tree = "🌱";
  let message =
    "Your faith is taking root!";

  if (count >= 180) {
    tree = "🌳🏆";
    message =
      "Your Faith Tree is fully grown!";
  } else if (count >= 150) {
    tree = "🌲🌳🌲";
    message =
      "Your Faith Tree is almost fully grown!";
  } else if (count >= 120) {
    tree = "🌳🌳🌳";
    message =
      "Your Faith Tree is growing strong!";
  } else if (count >= 90) {
    tree = "🌳🌳";
    message =
      "Your Faith Tree is growing beautifully!";
  } else if (count >= 60) {
    tree = "🌳";
    message =
      "Look how much your Faith Tree has grown!";
  } else if (count >= 30) {
    tree = "🌿";
    message =
      "Your faith is growing stronger!";
  }

  /* =========================================================
     COURSE STATUS
  ========================================================= */

  const courseStatus =
    count === 0
      ? "Not Started"
      : count >= TOTAL_LESSONS
      ? "Completed"
      : "In Progress";

  /* =========================================================
     BADGES
  ========================================================= */

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

  /* =========================================================
     PRINT PROGRESS REPORT
  ========================================================= */

  function printReport() {
    const reportWindow = window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );

    if (!reportWindow) {
      alert(
        "Please allow pop-ups for this website so the report can open."
      );

      return;
    }

    const reportNextLesson =
      getNextLesson();

    const reportStatus =
      count === 0
        ? "Not Started"
        : count >= TOTAL_LESSONS
        ? "Completed"
        : "In Progress";

    const escapedNotes =
      notes && notes.trim()
        ? notes
        : "No parent/teacher notes entered.";

    const midtermResult =
      midtermPassed
        ? `🏆 PASSED — ${midtermScore}%`
        : midtermNotPassed
        ? `📖 NOT PASSED — ${midtermScore}%`
        : isComplete(90)
        ? "⚠️ Completed — Score not recorded"
        : isComplete(88) &&
          isComplete(89)
        ? "🔓 Ready"
        : "🔒 Complete Days 88 & 89 first";

    const finalResult =
      finalPassed
        ? `🏆 PASSED — ${finalScore}%`
        : finalNotPassed
        ? `📖 NOT PASSED — ${finalScore}%`
        : isComplete(179)
        ? "⚠️ Completed — Score not recorded"
        : isComplete(177) &&
          isComplete(178)
        ? "🔓 Ready"
        : "🔒 Complete Days 177 & 178 first";

    reportWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <meta charset="UTF-8">

        <title>
          Faith Foundations Progress Report
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            font-family:
              Arial,
              Helvetica,
              sans-serif;

            color: #24313a;

            background: white;

            margin: 0;

            padding: 35px;
          }

          .report {
            max-width: 850px;
            margin: 0 auto;
          }

          h1 {
            text-align: center;
            color: #315c48;
            margin-bottom: 5px;
          }

          h2 {
            color: #315c48;

            border-bottom:
              2px solid #315c48;

            padding-bottom: 7px;

            margin-top: 30px;
          }

          h3 {
            color: #315c48;

            margin-bottom: 5px;
          }

          .subtitle {
            text-align: center;

            font-size: 18px;

            margin-bottom: 30px;
          }

          .info {
            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap: 12px;
          }

          .box {
            border:
              1px solid #ccc;

            border-radius: 8px;

            padding: 15px;

            min-height: 70px;
          }

          .center {
            text-align: center;
          }

          .tree {
            text-align: center;

            font-size: 70px;

            margin-top: 15px;
          }

          .tree-message {
            text-align: center;

            font-size: 20px;

            font-weight: bold;

            color: #315c48;
          }

          .progress-number {
            text-align: center;

            font-size: 25px;

            font-weight: bold;

            color: #315c48;

            margin: 15px;
          }

          .progress {
            width: 100%;

            height: 25px;

            background: #ddd;

            border-radius: 20px;

            overflow: hidden;
          }

          .progress-fill {
            height: 100%;

            width: ${percentage}%;

            background: #315c48;
          }

          table {
            width: 100%;

            border-collapse: collapse;

            margin-top: 15px;
          }

          th,
          td {
            border:
              1px solid #ccc;

            padding: 10px;

            text-align: left;
          }

          th {
            background: #e9f4ed;
          }

          .earned {
            font-weight: bold;

            color: #315c48;
          }

          .locked {
            color: #888;
          }

          .pass {
            color: #315c48;

            font-weight: bold;
          }

          .fail {
            color: #b3261e;

            font-weight: bold;
          }

          .ready {
            color: #8b6f47;

            font-weight: bold;
          }

          .rules {
            background: #fff4df;

            border:
              1px solid #e1cda7;

            border-radius: 8px;

            padding: 15px;

            margin-top: 15px;

            line-height: 1.6;
          }

          .notes {
            border:
              1px solid #999;

            border-radius: 8px;

            min-height: 160px;

            padding: 15px;

            white-space: pre-wrap;
          }

          .signature {
            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap: 50px;

            margin-top: 55px;
          }

          .signature-line {
            border-bottom:
              1px solid #333;

            padding-bottom: 8px;
          }

          .footer {
            text-align: center;

            margin-top: 45px;

            padding-top: 15px;

            border-top:
              1px solid #ddd;

            color: #666;

            font-size: 13px;
          }

          @media print {

            body {
              padding: 0;
            }

            .report {
              max-width: none;
            }

            @page {
              margin: 0.5in;
            }

          }

        </style>

      </head>

      <body>

        <div class="report">

          <h1>
            🌳 Faith Foundations
          </h1>

          <div class="subtitle">

            <strong>
              The M&M Adventure
            </strong>

            <br>

            Bible Curriculum Progress Report

          </div>

          <div class="info">

            <div class="box">
              <strong>Student:</strong>
              <br><br>
              M&M
            </div>

            <div class="box">
              <strong>Grade:</strong>
              <br><br>
              3rd Grade
            </div>

            <div class="box">
              <strong>School Year:</strong>
              <br><br>
              2026–2027
            </div>

            <div class="box">
              <strong>Parent/Teacher:</strong>
              <br><br>
              __________________________
            </div>

          </div>

          <h2>
            📚 Course Progress
          </h2>

          <div class="tree">
            ${tree}
          </div>

          <div class="tree-message">
            ${message}
          </div>

          <div class="progress-number">
            ${count} / 180 Lessons Completed
          </div>

          <div class="progress">
            <div class="progress-fill"></div>
          </div>

          <p class="center">
            <strong>
              ${percentage}% Complete
            </strong>
          </p>

          <table>

            <tr>
              <th>Course Status</th>
              <td>${reportStatus}</td>
            </tr>

            <tr>
              <th>Lessons Completed</th>
              <td>${count} of 180</td>
            </tr>

            <tr>
              <th>Lessons Remaining</th>
              <td>
                ${Math.max(
                  0,
                  TOTAL_LESSONS - count
                )}
              </td>
            </tr>

            <tr>
              <th>Next Lesson</th>
              <td>
                ${
                  reportNextLesson
                    ? `Day ${reportNextLesson}`
                    : "Course Complete 🎉"
                }
              </td>
            </tr>

          </table>

          <h2>
            📝 Exams & Reviews
          </h2>

          <div class="rules">

            <strong>
              📖 Exam Passing Standard
            </strong>

            <br>

            🏆 <strong>80% or higher = PASS</strong>

            <br>

            📖 <strong>79% or lower = NOT PASSED</strong>

            <br><br>

            Exams may be completed
            <strong>system-led or parent-led.</strong>

          </div>

          <h3>
            📚 Midterm
          </h3>

          <table>

            <tr>
              <th>Day</th>
              <th>Material</th>
              <th>Status</th>
            </tr>

            <tr>
              <td>88</td>

              <td>
                Midterm Study Guide #1
                <br>
                Review Lessons 1–44
              </td>

              <td>
                ${
                  isComplete(88)
                    ? "✅ Completed"
                    : "🔒 Not Completed"
                }
              </td>
            </tr>

            <tr>
              <td>89</td>

              <td>
                Midterm Study Guide #2
                <br>
                Review Lessons 45–87
              </td>

              <td>
                ${
                  isComplete(89)
                    ? "✅ Completed"
                    : "🔒 Not Completed"
                }
              </td>
            </tr>

            <tr>
              <td>90</td>

              <td>
                <strong>
                  Midterm Exam
                </strong>
              </td>

              <td>
                ${midtermResult}
              </td>
            </tr>

          </table>

          <h3>
            🏆 Final
          </h3>

          <table>

            <tr>
              <th>Day</th>
              <th>Material</th>
              <th>Status</th>
            </tr>

            <tr>
              <td>177</td>

              <td>
                Final Study Guide #1
                <br>
                Review Lessons 91–134
              </td>

              <td>
                ${
                  isComplete(177)
                    ? "✅ Completed"
                    : "🔒 Not Completed"
                }
              </td>
            </tr>

            <tr>
              <td>178</td>

              <td>
                Final Study Guide #2
                <br>
                Review Lessons 135–176
              </td>

              <td>
                ${
                  isComplete(178)
                    ? "✅ Completed"
                    : "🔒 Not Completed"
                }
              </td>
            </tr>

            <tr>
              <td>179</td>

              <td>
                <strong>
                  Final Exam
                </strong>
              </td>

              <td>
                ${finalResult}
              </td>
            </tr>

            <tr>
              <td>180</td>

              <td>
                Celebration /
                Completion Day
              </td>

              <td>
                ${
                  isComplete(180)
                    ? "🏆 Course Complete"
                    : "🔒 Not Yet Complete"
                }
              </td>
            </tr>

          </table>

          <h2>
            🏅 Faith Badges
          </h2>

          <table>

            <tr>
              <th>Badge</th>
              <th>Requirement</th>
              <th>Status</th>
            </tr>

            ${badges
              .map(
                ([icon, name, requirement]) => `
                  <tr>

                    <td>
                      ${icon} ${name}
                    </td>

                    <td>
                      ${requirement} Lessons
                    </td>

                    <td
                      class="${
                        count >= requirement
                          ? "earned"
                          : "locked"
                      }"
                    >

                      ${
                        count >= requirement
                          ? "✅ Earned"
                          : "🔒 Not Yet Earned"
                      }

                    </td>

                  </tr>
                `
              )
              .join("")}

          </table>

          <h2>
            📝 Parent/Teacher Notes
          </h2>

          <div class="notes">
            ${escapedNotes}
          </div>

          <div class="signature">

            <div class="signature-line">
              Parent/Teacher Signature
            </div>

            <div class="signature-line">
              Date
            </div>

          </div>

          <div class="footer">

            Faith Foundations:
            The M&M Adventure

            <br><br>

            Growing in God's Word —
            one day at a time.

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

  /* =========================================================
     LOGIN SCREEN
  ========================================================= */

  if (!unlocked) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f5f1e8",
          padding: "30px 20px",
          fontFamily:
            "Arial, sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            background: "white",
            borderRadius: "25px",
            padding: "35px 25px",
            textAlign: "center",
            boxShadow:
              "0 5px 25px rgba(0,0,0,.12)",
          }}
        >

          <div
            style={{
              fontSize: "70px",
            }}
          >
            🔐
          </div>

          <h1
            style={{
              color: "#315c48",
              marginBottom: "5px",
            }}
          >
            Parent Dashboard
          </h1>

          <h2>
            Faith Foundations
          </h2>

          <p
            style={{
              lineHeight: 1.6,
            }}
          >
            This area is for parents only.
            <br />
            Enter the parent password
            to continue.
          </p>

          <form onSubmit={handleLogin}>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Parent password"
              autoComplete="off"
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding: "15px",
                marginTop: "15px",
                borderRadius: "12px",
                border:
                  "2px solid #ddd",
                fontSize: "17px",
                textAlign: "center",
                outline: "none",
              }}
            />

            {error && (
              <p
                style={{
                  color: "#b3261e",
                  fontWeight: "bold",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "16px",
                border: "none",
                borderRadius: "14px",
                background: "#315c48",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🔓 Enter Parent Dashboard
            </button>

          </form>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              marginTop: "20px",
              border: "none",
              background:
                "transparent",
              color: "#315c48",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ← Back to Home
          </button>

        </div>

      </main>
    );
  }

  /* =========================================================
     PARENT DASHBOARD
  ========================================================= */

  return (
    <main
      style={{
        minHeight: "100vh",
        padding:
          "30px 20px 60px",
        background: "#f8f5ed",
        fontFamily:
          "Arial, sans-serif",
        color: "#24313a",
      }}
    >

      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >

        {/* HEADER */}

        <header
          style={{
            textAlign: "center",
            marginBottom: "25px",
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
              marginBottom: "5px",
            }}
          >
            Parent Dashboard
          </h1>

          <h2
            style={{
              marginTop: "5px",
            }}
          >
            Faith Foundations:
            The M&M Adventure
          </h2>

          <p>
            Monitor your child's Bible
            learning journey.
          </p>

        </header>

        {/* PARENT TOOLS */}

        <section
          className="no-print"
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)",
          }}
        >

          <h2
            style={{
              color: "#315c48",
            }}
          >
            ⚙️ Parent Tools
          </h2>

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >

            <button
              onClick={previewLessons}
              style={{
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background: "#315c48",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              👀 Preview Student Lessons
            </button>

            <button
              onClick={goToNextLesson}
              disabled={!nextLesson}
              style={{
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background:
                  nextLesson
                    ? "#6b9e5b"
                    : "#999",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor:
                  nextLesson
                    ? "pointer"
                    : "default",
              }}
            >
              {nextLesson
                ? `📖 Open Next Lesson — Day ${nextLesson}`
                : "🎉 All 180 Lessons Complete"}
            </button>

            {/* MIDTERM AND FINAL BUTTONS
                REMOVED FROM HERE ON PURPOSE */}

            <button
              onClick={printReport}
              style={{
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background: "#315c48",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🖨️ Print Progress Report
            </button>

            <button
              onClick={logout}
              style={{
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background: "#777",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🔒 Lock Parent Dashboard
            </button>

          </div>

        </section>

        {/* FAITH TREE */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            marginBottom: "22px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.1)",
          }}
        >

          <div
            style={{
              fontSize: "75px",
              lineHeight: 1.2,
            }}
          >
            {tree}
          </div>

          <h2
            style={{
              color: "#315c48",
            }}
          >
            {message}
          </h2>

          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            {count} / 180 Lessons Complete
          </p>

          <div
            style={{
              width: "100%",
              height: "28px",
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
                transition:
                  "width .4s ease",
              }}
            />

          </div>

          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {percentage}% Complete
          </p>

        </section>

        {/* CURRENT PROGRESS */}

        <section
          style={{
            background: "#fffaf0",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px",
          }}
        >

          <h2
            style={{
              color: "#315c48",
            }}
          >
            📅 Current Progress
          </h2>

          <p>
            📖 Next lesson:{" "}
            <strong>
              {nextLesson
                ? `Day ${nextLesson}`
                : "Course Complete 🎉"}
            </strong>
          </p>

          <p>
            ⭐ Lessons completed:{" "}
            <strong>
              {count}
            </strong>
          </p>

          <p>
            📈 Lessons remaining:{" "}
            <strong>
              {Math.max(
                0,
                TOTAL_LESSONS - count
              )}
            </strong>
          </p>

          <p>
            🌳 Faith Tree progress:{" "}
            <strong>
              {percentage}%
            </strong>
          </p>

          <p>
            📚 Course status:{" "}
            <strong>
              {courseStatus}
            </strong>
          </p>

        </section>

        {/* =====================================================
            EXAMS & REVIEWS
        ===================================================== */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px",
          }}
        >

          <h2
            style={{
              color: "#315c48",
            }}
          >
            📝 Exams & Reviews
          </h2>

          <div
            style={{
              background: "#fff4df",
              padding: "15px",
              borderRadius: "12px",
              lineHeight: 1.6,
              marginBottom: "18px",
            }}
          >

            👩‍🏫 <strong>Parent Preview:</strong>

            <br />

            Parents can preview each study guide
            and exam individually.

            <br /><br />

            <strong>
              📖 Exam Passing Standard:
            </strong>

            <br />

            🏆 <strong>80% or higher = PASS</strong>

            <br />

            📖 <strong>79% or lower = NOT PASSED</strong>

            <br /><br />

            Exams may be completed
            <strong>
              system-led or parent-led.
            </strong>

          </div>

          {/* =================================================
              MIDTERM SECTION
          ================================================= */}

          <h3
            style={{
              color: "#315c48",
              marginTop: "10px",
            }}
          >
            📚 Midterm
          </h3>

          {/* DAY 88 */}

          <div
            style={{
              padding: "18px",
              marginTop: "12px",
              borderRadius: "14px",
              background:
                isComplete(88)
                  ? "#e9f4ed"
                  : "#f7f7f7",
              border:
                "1px solid #ddd",
            }}
          >

            <strong>
              📚 Day 88 — Midterm Study Guide #1
            </strong>

            <p>
              Review Lessons 1–44
            </p>

            <p
              style={{
                fontWeight: "bold",
              }}
            >
              {isComplete(88)
                ? "✅ Completed"
                : "🔒 Not completed"}
            </p>

            <button
              onClick={
                openMidtermGuide1
              }
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "10px",
                background: "#8b6f47",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              👀 Parent Review & Print
            </button>

          </div>

          {/* DAY 89 */}

          <div
            style={{
              padding: "18px",
              marginTop: "12px",
              borderRadius: "14px",
              background:
                isComplete(89)
                  ? "#e9f4ed"
                  : "#f7f7f7",
              border:
                "1px solid #ddd",
            }}
          >

            <strong>
              📚 Day 89 — Midterm Study Guide #2
            </strong>

            <p>
              Review Lessons 45–87
            </p>

            <p
              style={{
                fontWeight: "bold",
              }}
            >
              {isComplete(89)
                ? "✅ Completed"
                : "🔒 Not completed"}
            </p>

            <button
              onClick={
                openMidtermGuide2
              }
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "10px",
                background: "#8b6f47",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              👀 Parent Review & Print
            </button>

          </div>

          {/* DAY 90 */}

          <div
            style={{
              padding: "18px",
              marginTop: "12px",
              borderRadius: "14px",
              background:
                midtermPassed
                  ? "#e9f4ed"
                  : midtermNotPassed
                  ? "#fdeaea"
                  : isComplete(90)
                  ? "#fff4df"
                  : isComplete(88) &&
                    isComplete(89)
                  ? "#fff4df"
                  : "#f7f7f7",
              border:
                "1px solid #ddd",
            }}
          >

            <strong>
              📝 Day 90 — Midterm Exam
            </strong>

            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "10px",
                background: "white",
                lineHeight: 1.6,
              }}
            >

              <strong>
                📊 Passing Requirement
              </strong>

              <br />

              🏆 80% or higher = <strong>PASS</strong>

              <br />

              📖 79% or lower ={" "}
              <strong>NOT PASSED</strong>

              <br />

              👩‍🏫 System-led or Parent-led

            </div>

            {midtermScore !== null && (
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color:
                    midtermPassed
                      ? "#315c48"
                      : "#b3261e",
                }}
              >
                Score: {midtermScore}%
                <br />

                {midtermPassed
                  ? "🏆 PASS"
                  : "📖 NOT PASSED"}
              </p>
            )}

            <p
              style={{
                fontWeight: "bold",
              }}
            >
              {midtermPassed
                ? "🏆 Passed"
                : midtermNotPassed
                ? "📖 Not Passed"
                : isComplete(90)
                ? "⚠️ Completed — Score not recorded"
                : isComplete(88) &&
                  isComplete(89)
                ? "🔓 Ready for Student"
                : "🔒 Complete Days 88 & 89 first"}
            </p>

            <button
              onClick={
                openMidtermExam
              }
              disabled={
                !(
                  isComplete(88) &&
                  isComplete(89)
                )
              }
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "10px",
                background:
                  isComplete(88) &&
                  isComplete(89)
                    ? "#8b6f47"
                    : "#aaa",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor:
                  isComplete(88) &&
                  isComplete(89)
                    ? "pointer"
                    : "default",
                marginTop: "8px",
              }}
            >
              👀 Parent Review & Print Exam
            </button>

          </div>

          {/* =================================================
              FINAL SECTION
          ================================================= */}

          <h3
            style={{
              color: "#315c48",
              marginTop: "28px",
            }}
          >
            🏆 Final Exam
          </h3>

          {/* DAY 177 */}

          <div
            style={{
              padding: "18px",
              marginTop: "12px",
              borderRadius: "14px",
              background:
                isComplete(177)
                  ? "#e9f4ed"
                  : "#f7f7f7",
              border:
                "1px solid #ddd",
            }}
          >

            <strong>
              📚 Day 177 — Final Study Guide #1
            </strong>

            <p>
              Review Lessons 91–134
            </p>

            <p
              style={{
                fontWeight: "bold",
              }}
            >
              {isComplete(177)
                ? "✅ Completed"
                : "🔒 Not completed"}
            </p>

            <button
              onClick={
                openFinalGuide1
              }
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "10px",
                background: "#8b6f47",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              👀 Parent Review & Print
            </button>

          </div>

          {/* DAY 178 */}

          <div
            style={{
              padding: "18px",
              marginTop: "12px",
              borderRadius: "14px",
              background:
                isComplete(178)
                  ? "#e9f4ed"
                  : "#f7f7f7",
              border:
                "1px solid #ddd",
            }}
          >

            <strong>
              📚 Day 178 — Final Study Guide #2
            </strong>

            <p>
              Review Lessons 135–176
            </p>

            <p
              style={{
                fontWeight: "bold",
              }}
            >
              {isComplete(178)
                ? "✅ Completed"
                : "🔒 Not completed"}
            </p>

            <button
              onClick={
                openFinalGuide2
              }
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "10px",
                background: "#8b6f47",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              👀 Parent Review & Print
            </button>

          </div>

          {/* DAY 179 */}

          <div
            style={{
              padding: "18px",
              marginTop: "12px",
              borderRadius: "14px",
              background:
                finalPassed
                  ? "#e9f4ed"
                  : finalNotPassed
                  ? "#fdeaea"
                  : isComplete(179)
                  ? "#fff4df"
                  : isComplete(177) &&
                    isComplete(178)
                  ? "#fff4df"
                  : "#f7f7f7",
              border:
                "1px solid #ddd",
            }}
          >

            <strong>
              🏆 Day 179 — Final Exam
            </strong>

            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "10px",
                background: "white",
                lineHeight: 1.6,
              }}
            >

              <strong>
                📊 Passing Requirement
              </strong>

              <br />

              🏆 80% or higher = <strong>PASS</strong>

              <br />

              📖 79% or lower ={" "}
              <strong>NOT PASSED</strong>

              <br />

              👩‍🏫 System-led or Parent-led

            </div>

            {finalScore !== null && (
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color:
                    finalPassed
                      ? "#315c48"
                      : "#b3261e",
                }}
              >
                Score: {finalScore}%
                <br />

                {finalPassed
                  ? "🏆 PASS"
                  : "📖 NOT PASSED"}
              </p>
            )}

            <p
              style={{
                fontWeight: "bold",
              }}
            >
              {finalPassed
                ? "🏆 Passed"
                : finalNotPassed
                ? "📖 Not Passed"
                : isComplete(179)
                ? "⚠️ Completed — Score not recorded"
                : isComplete(177) &&
                  isComplete(178)
                ? "🔓 Ready for Student"
                : "🔒 Complete Days 177 & 178 first"}
            </p>

            <button
              onClick={
                openFinalExam
              }
              disabled={
                !(
                  isComplete(177) &&
                  isComplete(178)
                )
              }
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "10px",
                background:
                  isComplete(177) &&
                  isComplete(178)
                    ? "#8b6f47"
                    : "#aaa",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor:
                  isComplete(177) &&
                  isComplete(178)
                    ? "pointer"
                    : "default",
                marginTop: "8px",
              }}
            >
              👀 Parent Review & Print Exam
            </button>

          </div>

          {/* DAY 180 */}

          <div
            style={{
              padding: "18px",
              marginTop: "12px",
              borderRadius: "14px",
              background:
                isComplete(180)
                  ? "#e9f4ed"
                  : "#f7f7f7",
              border:
                "1px solid #ddd",
            }}
          >

            <strong>
              🏆 Day 180 — Celebration / Completion Day
            </strong>

            <p
              style={{
                fontWeight: "bold",
              }}
            >
              {isComplete(180)
                ? "🎉 Course Complete!"
                : "🔒 Complete the course to reach Celebration Day"}
            </p>

          </div>

        </section>

        {/* FAITH BADGES */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px",
          }}
        >

          <h2
            style={{
              color: "#315c48",
            }}
          >
            🏅 Faith Badges
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >

            {badges.map(
              ([icon, name, requirement]) => {
                const earned =
                  count >= requirement;

                return (
                  <div
                    key={name}
                    style={{
                      padding: "18px",
                      borderRadius: "15px",
                      textAlign: "center",
                      background:
                        earned
                          ? "#e9f4ed"
                          : "#f7f7f7",
                      border:
                        earned
                          ? "2px solid #315c48"
                          : "2px solid #ddd",
                      opacity:
                        earned ? 1 : 0.7,
                    }}
                  >

                    <div
                      style={{
                        fontSize: "40px",
                      }}
                    >
                      {icon}
                    </div>

                    <strong>
                      {name}
                    </strong>

                    <p
                      style={{
                        fontSize: "13px",
                        marginBottom: "5px",
                      }}
                    >
                      {requirement} lessons
                    </p>

                    <span
                      style={{
                        fontWeight: "bold",
                        color:
                          earned
                            ? "#315c48"
                            : "#777",
                      }}
                    >
                      {earned
                        ? "✅ Earned"
                        : "🔒 Locked"}
                    </span>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* COMPLETED LESSONS */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px",
          }}
        >

          <h2
            style={{
              color: "#315c48",
            }}
          >
            ✅ Completed Lessons
          </h2>

          {completed.length === 0 ? (
            <div
              style={{
                background: "#f7f7f7",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >

              <p>
                No lessons completed yet.
              </p>

              <p
                style={{
                  color: "#777",
                }}
              >
                Once your student
                completes lessons,
                they will appear here.
              </p>

            </div>
          ) : (
            <>
              <p>
                <strong>
                  {completed.length}
                </strong>{" "}
                lesson
                {completed.length === 1
                  ? ""
                  : "s"} completed.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >

                {completed.map(
                  (day) => (
                    <span
                      key={day}
                      style={{
                        background:
                          "#e9f4ed",
                        borderRadius:
                          "10px",
                        padding:
                          "8px 12px",
                        fontWeight:
                          "bold",
                        fontSize:
                          "14px",
                      }}
                    >
                      Day {day} ✅
                    </span>
                  )
                )}

              </div>
            </>
          )}

        </section>

        {/* PARENT NOTES */}

        <section
          className="no-print"
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px",
          }}
        >

          <h2
            style={{
              color: "#315c48",
            }}
          >
            📝 Parent/Teacher Notes
          </h2>

          <p
            style={{
              lineHeight: 1.5,
            }}
          >
            Type notes here. They will
            automatically save on this
            device and appear on the
            printable progress report.
          </p>

          <textarea
            value={notes}
            onChange={(e) =>
              saveNotes(
                e.target.value
              )
            }
            placeholder="Enter parent/teacher notes here..."
            rows={7}
            style={{
              width: "100%",
              boxSizing:
                "border-box",
              padding: "15px",
              borderRadius:
                "12px",
              border:
                "2px solid #ccc",
              fontSize: "16px",
              fontFamily:
                "Arial, sans-serif",
              resize: "vertical",
              background: "white",
              color: "#24313a",
              outline: "none",
            }}
          />

          <p
            style={{
              fontSize: "13px",
              color: "#666",
            }}
          >
            ✅ Notes saved automatically.
          </p>

        </section>

        {/* FOOTER */}

        <footer
          style={{
            textAlign: "center",
            padding: "20px",
          }}
        >

          <div
            style={{
              fontSize: "55px",
            }}
          >
            🌳
          </div>

          <p
            style={{
              fontWeight: "bold",
              color: "#315c48",
            }}
          >
            Every lesson helps your
            Faith Tree grow!
          </p>

          <p
            style={{
              color: "#777",
            }}
          >
            Faith Foundations:
            The M&M Adventure
          </p>

        </footer>

      </div>

    </main>
  );
}

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

  const lessonsRemaining =
    TOTAL_LESSONS -
    completedCount;

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
  ======================================================= */

  function openMidterm() {
    window.location.href =
      "/Midterm?parent=true&day=88";
  }

  /* =======================================================
     FINAL
  ======================================================= */

  function openFinal() {
    window.location.href =
      "/Final?parent=true&day=177";
  }

  /* =======================================================
     REPORT HELPERS
  ======================================================= */

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDate(value) {
    if (!value) return "Not recorded";

    try {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return escapeHtml(value);
      }

      return date.toLocaleString();
    } catch {
      return "Not recorded";
    }
  }

  function getAttemptScore(attempt) {
    if (!attempt || typeof attempt !== "object") {
      return null;
    }

    const possibleScores = [
      attempt.score,
      attempt.percentage,
      attempt.percent,
      attempt.result,
    ];

    for (const value of possibleScores) {
      const numeric = Number(value);

      if (
        Number.isFinite(numeric) &&
        numeric >= 0 &&
        numeric <= 100
      ) {
        return numeric;
      }
    }

    return null;
  }

  function getIncorrectCount(attempt) {
    if (!attempt || typeof attempt !== "object") {
      return 0;
    }

    if (Array.isArray(attempt.incorrectAnswers)) {
      return attempt.incorrectAnswers.length;
    }

    if (Array.isArray(attempt.incorrect)) {
      return attempt.incorrect.length;
    }

    if (
      Number.isFinite(
        Number(attempt.incorrectCount)
      )
    ) {
      return Number(attempt.incorrectCount);
    }

    return 0;
  }

  function getAttemptDate(attempt) {
    if (!attempt || typeof attempt !== "object") {
      return null;
    }

    return (
      attempt.date ||
      attempt.timestamp ||
      attempt.completedAt ||
      attempt.createdAt ||
      null
    );
  }

  function getAttemptMode(attempt) {
    if (!attempt || typeof attempt !== "object") {
      return "Not recorded";
    }

    return (
      attempt.mode ||
      attempt.examMode ||
      attempt.type ||
      "System-led"
    );
  }

  function getAttemptPassed(attempt, score) {
    if (
      attempt &&
      typeof attempt === "object" &&
      typeof attempt.passed === "boolean"
    ) {
      return attempt.passed;
    }

    if (score !== null) {
      return score >= PASSING_SCORE;
    }

    return false;
  }

  function buildAttemptRows(attempts) {
    if (!attempts || attempts.length === 0) {
      return `
        <tr>
          <td colspan="6" class="empty">
            No exam attempts have been recorded.
          </td>
        </tr>
      `;
    }

    return attempts
      .map((attempt, index) => {
        const score =
          getAttemptScore(attempt);

        const passed =
          getAttemptPassed(
            attempt,
            score
          );

        const incorrectCount =
          getIncorrectCount(attempt);

        const date =
          getAttemptDate(attempt);

        const mode =
          getAttemptMode(attempt);

        return `
          <tr>
            <td>${index + 1}</td>

            <td>
              ${formatDate(date)}
            </td>

            <td>
              ${escapeHtml(mode)}
            </td>

            <td>
              ${
                score !== null
                  ? `<strong>${score}%</strong>`
                  : "Not recorded"
              }
            </td>

            <td class="${
              passed
                ? "pass"
                : score !== null
                ? "fail"
                : ""
            }">
              ${
                score !== null
                  ? passed
                    ? "PASSED"
                    : "NOT PASSED"
                  : "—"
              }
            </td>

            <td>
              ${
                incorrectCount > 0
                  ? incorrectCount
                  : "0"
              }
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function buildIncorrectAnswerDetails(attempts) {
    if (!attempts || attempts.length === 0) {
      return "";
    }

    const sections = [];

    attempts.forEach((attempt, index) => {
      if (
        !attempt ||
        typeof attempt !== "object"
      ) {
        return;
      }

      const incorrect =
        Array.isArray(
          attempt.incorrectAnswers
        )
          ? attempt.incorrectAnswers
          : Array.isArray(
              attempt.incorrect
            )
          ? attempt.incorrect
          : [];

      if (incorrect.length === 0) {
        return;
      }

      const items = incorrect
        .map((item, itemIndex) => {
          if (
            item &&
            typeof item === "object"
          ) {
            const question =
              item.question ||
              item.prompt ||
              item.text ||
              `Question ${itemIndex + 1}`;

            const selected =
              item.selectedAnswer ||
              item.answer ||
              item.selected ||
              "Not recorded";

            const correct =
              item.correctAnswer ||
              item.correct ||
              "Not recorded";

            return `
              <li>
                <strong>
                  ${escapeHtml(question)}
                </strong>
                <br>
                Student answer:
                ${escapeHtml(selected)}
                <br>
                Correct answer:
                ${escapeHtml(correct)}
              </li>
            `;
          }

          return `
            <li>
              ${escapeHtml(item)}
            </li>
          `;
        })
        .join("");

      sections.push(`
        <div class="incorrect-section">
          <h4>
            Attempt ${index + 1}
          </h4>

          <ul>
            ${items}
          </ul>
        </div>
      `);
    });

    if (sections.length === 0) {
      return `
        <p class="muted">
          No incorrect-answer details were recorded.
        </p>
      `;
    }

    return sections.join("");
  }

  function buildCompletedLessonRanges() {
    if (completed.length === 0) {
      return "No lessons completed yet.";
    }

    const ranges = [];

    let start =
      completed[0];

    let previous =
      completed[0];

    for (
      let i = 1;
      i < completed.length;
      i++
    ) {
      const current =
        completed[i];

      if (
        current === previous + 1
      ) {
        previous = current;
      } else {
        ranges.push(
          start === previous
            ? `Day ${start}`
            : `Days ${start}–${previous}`
        );

        start = current;
        previous = current;
      }
    }

    ranges.push(
      start === previous
        ? `Day ${start}`
        : `Days ${start}–${previous}`
    );

    return ranges.join(", ");
  }

  function buildLessonStatusRows() {
    let rows = "";

    for (
      let day = 1;
      day <= TOTAL_LESSONS;
      day++
    ) {
      const isComplete =
        completed.includes(day);

      rows += `
        <tr>
          <td>
            ${day}
          </td>

          <td>
            ${
              isComplete
                ? "Completed"
                : day === nextLesson
                ? "Next Lesson"
                : "Not Completed"
            }
          </td>

          <td class="${
            isComplete
              ? "pass"
              : day === nextLesson
              ? "next"
              : ""
          }">
            ${
              isComplete
                ? "✓"
                : day === nextLesson
                ? "→"
                : "—"
            }
          </td>
        </tr>
      `;
    }

    return rows;
  }

  /* =======================================================
     PRINT DETAILED REPORT
  ======================================================= */

  function printReport() {
    const reportWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=1100"
      );

    if (!reportWindow) {
      alert(
        "Please allow pop-ups so the detailed progress report can open."
      );
      return;
    }

    const reportDate =
      new Date().toLocaleDateString();

    const earnedBadges =
      badges.filter(
        (badge) =>
          completedCount >= badge[2]
      );

    const lockedBadges =
      badges.filter(
        (badge) =>
          completedCount < badge[2]
      );

    const faithTreeStage =
      completedCount >= 180
        ? "Fully Grown Faith Tree"
        : completedCount >= 135
        ? "Faith Champion Stage"
        : completedCount >= 90
        ? "Halfway Hero Stage"
        : completedCount >= 50
        ? "Faith Builder Stage"
        : completedCount >= 25
        ? "Growing Strong Stage"
        : completedCount >= 10
        ? "First Steps Stage"
        : "Beginning Stage";

    const courseStatus =
      completedCount >= 180
        ? "COURSE COMPLETE"
        : nextLesson
        ? "IN PROGRESS"
        : "NOT STARTED";

    const completedRanges =
      buildCompletedLessonRanges();

    const midtermStatus =
      midtermPassed
        ? "PASSED"
        : midtermNotPassed
        ? "NOT PASSED"
        : "NOT TAKEN";

    const finalStatus =
      finalPassed
        ? "PASSED"
        : finalNotPassed
        ? "NOT PASSED"
        : "NOT TAKEN";

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
            margin: 0;
            padding: 0;
            background: #eeeeee;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
            color: #24313a;
            line-height: 1.5;
          }

          .report {
            width: 100%;
            max-width: 850px;
            margin: 25px auto;
            background: white;
            padding: 42px;
          }

          .header {
            text-align: center;
            border-bottom:
              3px solid #315c48;
            padding-bottom: 25px;
            margin-bottom: 25px;
          }

          .logo {
            font-size: 58px;
            margin-bottom: 5px;
          }

          h1 {
            color: #315c48;
            font-size: 30px;
            margin:
              0 0 5px 0;
          }

          .subtitle {
            font-size: 20px;
            font-weight: bold;
            color: #555;
          }

          .report-title {
            font-size: 22px;
            color: #315c48;
            margin-top: 12px;
            font-weight: bold;
          }

          .info-grid {
            display: grid;
            grid-template-columns:
              repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 25px;
          }

          .info-box {
            border:
              1px solid #d7ddd8;
            border-radius: 10px;
            padding: 13px;
            background: #f8fbf8;
          }

          .label {
            display: block;
            font-size: 12px;
            color: #777;
            text-transform: uppercase;
            letter-spacing: .5px;
            margin-bottom: 4px;
          }

          .value {
            font-size: 16px;
            font-weight: bold;
          }

          .section {
            margin-top: 28px;
            page-break-inside: avoid;
          }

          .section h2 {
            background: #315c48;
            color: white;
            padding: 11px 15px;
            border-radius: 8px;
            font-size: 19px;
            margin:
              0 0 15px 0;
          }

          .section h3 {
            color: #315c48;
            margin-top: 20px;
          }

          .progress-number {
            text-align: center;
            font-size: 42px;
            font-weight: bold;
            color: #315c48;
            margin-top: 5px;
          }

          .progress-label {
            text-align: center;
            font-weight: bold;
            margin-bottom: 15px;
          }

          .progress-bar {
            width: 100%;
            height: 25px;
            background: #e5e5e5;
            border-radius: 20px;
            overflow: hidden;
            border:
              1px solid #d0d0d0;
          }

          .progress-fill {
            height: 100%;
            width: ${progressPercent}%;
            background: #6b9e5b;
            border-radius: 20px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns:
              repeat(3, 1fr);
            gap: 12px;
            margin-top: 18px;
          }

          .stat {
            text-align: center;
            border:
              1px solid #ddd;
            border-radius: 10px;
            padding: 15px;
          }

          .stat-number {
            display: block;
            font-size: 26px;
            font-weight: bold;
            color: #315c48;
          }

          .stat-label {
            font-size: 12px;
            color: #666;
          }

          .status-box {
            border-radius: 10px;
            padding: 18px;
            text-align: center;
            margin-top: 15px;
            background:
              ${
                completedCount >= 180
                  ? "#e9f4ed"
                  : "#f5f5f5"
              };
            border:
              2px solid
              ${
                completedCount >= 180
                  ? "#6b9e5b"
                  : "#ddd"
              };
          }

          .status-large {
            font-size: 22px;
            font-weight: bold;
            color: #315c48;
          }

          table {
            width: 100%;
            border-collapse:
              collapse;
            margin-top: 10px;
            font-size: 13px;
          }

          th {
            background: #e9f0eb;
            color: #315c48;
            text-align: left;
            font-weight: bold;
          }

          th,
          td {
            border:
              1px solid #d5d5d5;
            padding: 8px;
            vertical-align: top;
          }

          tr:nth-child(even) {
            background: #fafafa;
          }

          .pass {
            color: #267342;
            font-weight: bold;
          }

          .fail {
            color: #b42318;
            font-weight: bold;
          }

          .next {
            color: #315c48;
            font-weight: bold;
          }

          .empty {
            text-align: center;
            color: #777;
            padding: 18px;
          }

          .badge-grid {
            display: grid;
            grid-template-columns:
              repeat(2, 1fr);
            gap: 12px;
          }

          .badge {
            border:
              1px solid #d5d5d5;
            border-radius: 10px;
            padding: 13px;
            min-height: 90px;
          }

          .badge-earned {
            background: #e9f4ed;
            border:
              2px solid #6b9e5b;
          }

          .badge-locked {
            background: #f5f5f5;
          }

          .badge-icon {
            font-size: 30px;
            float: left;
            margin-right: 10px;
          }

          .badge-name {
            font-weight: bold;
            color: #315c48;
          }

          .badge-milestone {
            font-size: 12px;
            color: #666;
          }

          .exam-box {
            border:
              1px solid #d5d5d5;
            border-radius: 10px;
            padding: 17px;
            margin-bottom: 15px;
          }

          .exam-header {
            display: flex;
            justify-content:
              space-between;
            align-items: center;
            gap: 15px;
            margin-bottom: 10px;
          }

          .exam-title {
            font-size: 18px;
            font-weight: bold;
            color: #315c48;
          }

          .exam-status {
            font-weight: bold;
            padding:
              5px 10px;
            border-radius: 8px;
            background: #f0f0f0;
          }

          .score {
            font-size: 25px;
            font-weight: bold;
            color: #315c48;
          }

          .notes-box {
            min-height: 150px;
            border:
              1px solid #ccc;
            border-radius: 10px;
            padding: 15px;
            white-space: normal;
          }

          .muted {
            color: #777;
          }

          .incorrect-section {
            border:
              1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            margin-top: 12px;
            background: #fffafa;
          }

          .incorrect-section h4 {
            margin:
              0 0 8px 0;
            color: #315c48;
          }

          .incorrect-section li {
            margin-bottom: 10px;
          }

          .signature-grid {
            display: grid;
            grid-template-columns:
              1fr 1fr;
            gap: 45px;
            margin-top: 45px;
          }

          .signature-line {
            border-bottom:
              1px solid #333;
            padding-bottom: 7px;
          }

          .signature-label {
            margin-top: 5px;
            font-size: 12px;
            color: #666;
          }

          .footer {
            margin-top: 45px;
            padding-top: 15px;
            border-top:
              1px solid #ccc;
            text-align: center;
            font-size: 11px;
            color: #777;
          }

          .page-break {
            page-break-before: always;
          }

          @media print {

            body {
              background: white;
            }

            .report {
              margin: 0;
              max-width: none;
              padding: 25px;
            }

            .no-print {
              display: none;
            }

            .section {
              page-break-inside: avoid;
            }

            table {
              page-break-inside: auto;
            }

            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }

            @page {
              margin: .5in;
            }

          }

        </style>

      </head>

      <body>

        <div class="report">

          <!-- =========================================
               HEADER
          ========================================== -->

          <header class="header">

            <div class="logo">
              🌳📖
            </div>

            <h1>
              Faith Foundations
            </h1>

            <div class="subtitle">
              The M&M Adventure
            </div>

            <div class="report-title">
              Parent Progress Report
            </div>

          </header>

          <!-- =========================================
               STUDENT INFORMATION
          ========================================== -->

          <div class="info-grid">

            <div class="info-box">
              <span class="label">
                Student
              </span>

              <span class="value">
                ______________________________
              </span>
            </div>

            <div class="info-box">
              <span class="label">
                Grade
              </span>

              <span class="value">
                3rd Grade
              </span>
            </div>

            <div class="info-box">
              <span class="label">
                School Year
              </span>

              <span class="value">
                2026–2027
              </span>
            </div>

            <div class="info-box">
              <span class="label">
                Parent / Teacher
              </span>

              <span class="value">
                ______________________________
              </span>
            </div>

            <div class="info-box">
              <span class="label">
                Report Date
              </span>

              <span class="value">
                ${reportDate}
              </span>
            </div>

            <div class="info-box">
              <span class="label">
                Course
              </span>

              <span class="value">
                Faith Foundations
              </span>
            </div>

          </div>

          <!-- =========================================
               COURSE PROGRESS
          ========================================== -->

          <section class="section">

            <h2>
              📊 Course Progress
            </h2>

            <div class="progress-number">
              ${progressPercent}%
            </div>

            <div class="progress-label">
              ${completedCount}
              of
              ${TOTAL_LESSONS}
              lessons completed
            </div>

            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>

            <div class="stats-grid">

              <div class="stat">
                <span class="stat-number">
                  ${completedCount}
                </span>

                <span class="stat-label">
                  Lessons Completed
                </span>
              </div>

              <div class="stat">
                <span class="stat-number">
                  ${lessonsRemaining}
                </span>

                <span class="stat-label">
                  Lessons Remaining
                </span>
              </div>

              <div class="stat">
                <span class="stat-number">
                  ${
                    nextLesson
                      ? `Day ${nextLesson}`
                      : "Complete"
                  }
                </span>

                <span class="stat-label">
                  Next Lesson
                </span>
              </div>

            </div>

            <div class="status-box">

              <div class="status-large">
                ${courseStatus}
              </div>

              <p>
                ${
                  completedCount >= 180
                    ? "All 180 school days have been completed."
                    : nextLesson
                    ? `The next lesson to complete is Day ${nextLesson}.`
                    : "The student has not started the course yet."
                }
              </p>

            </div>

          </section>

          <!-- =========================================
               FAITH TREE
          ========================================== -->

          <section class="section">

            <h2>
              🌳 Faith Tree Progress
            </h2>

            <div class="status-box">

              <div
                style="
                  font-size:55px;
                  margin-bottom:8px;
                "
              >
                ${
                  completedCount >= 180
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
                    : "🌰"
                }
              </div>

              <div class="status-large">
                ${faithTreeStage}
              </div>

              <p>
                Every completed lesson helps the
                student's Faith Tree grow.
              </p>

            </div>

          </section>

          <!-- =========================================
               BADGES
          ========================================== -->

          <section class="section">

            <h2>
              🏆 Badges & Milestones
            </h2>

            <div class="badge-grid">

              ${badges
                .map((badge) => {
                  const earned =
                    completedCount >=
                    badge[2];

                  return `
                    <div class="
                      badge
                      ${
                        earned
                          ? "badge-earned"
                          : "badge-locked"
                      }
                    ">

                      <div class="badge-icon">
                        ${badge[0]}
                      </div>

                      <div class="badge-name">
                        ${badge[1]}
                      </div>

                      <div class="badge-milestone">
                        ${badge[2]} lessons
                      </div>

                      <div
                        style="
                          margin-top:6px;
                          font-weight:bold;
                        "
                      >
                        ${
                          earned
                            ? "✓ EARNED"
                            : "🔒 NOT YET EARNED"
                        }
                      </div>

                    </div>
                  `;
                })
                .join("")}

            </div>

          </section>

          <!-- =========================================
               COMPLETED LESSONS
          ========================================== -->

          <section class="section">

            <h2>
              📚 Lesson Completion Record
            </h2>

            <p>
              <strong>
                Completed lesson ranges:
              </strong>
            </p>

            <p>
              ${completedRanges}
            </p>

            <p>
              <strong>
                Total completed:
              </strong>
              ${completedCount}
              of
              ${TOTAL_LESSONS}
            </p>

            ${
              nextLesson
                ? `
                  <p>
                    <strong>
                      Next lesson:
                    </strong>
                    Day ${nextLesson}
                  </p>
                `
                : `
                  <p>
                    <strong>
                      Next lesson:
                    </strong>
                    All lessons completed.
                  </p>
                `
            }

          </section>

          <!-- =========================================
               DETAILED DAY-BY-DAY STATUS
          ========================================== -->

          <section class="section page-break">

            <h2>
              📋 Detailed 180-Day Lesson Record
            </h2>

            <table>

              <thead>
                <tr>
                  <th>
                    Day
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Mark
                  </th>
                </tr>
              </thead>

              <tbody>
                ${buildLessonStatusRows()}
              </tbody>

            </table>

          </section>

          <!-- =========================================
               MIDTERM
          ========================================== -->

          <section class="section page-break">

            <h2>
              📝 Midterm Review & Exam
            </h2>

            <div class="exam-box">

              <div class="exam-header">

                <div class="exam-title">
                  Midterm Exam
                </div>

                <div class="exam-status">
                  ${midtermStatus}
                </div>

              </div>

              ${
                midtermScore !== null
                  ? `
                    <p>
                      Final recorded score:
                    </p>

                    <div class="score">
                      ${midtermScore}%
                    </div>
                  `
                  : `
                    <p class="muted">
                      No passing score has been recorded yet.
                    </p>
                  `
              }

              <p>
                <strong>
                  Passing standard:
                </strong>
                ${PASSING_SCORE}% or higher
              </p>

              <p>
                <strong>
                  Review:
                </strong>
                Day 88 – Study Guide #1
                and Day 89 – Study Guide #2
              </p>

              <p>
                <strong>
                  Exam:
                </strong>
                Day 90
              </p>

              <p>
                <strong>
                  Attempts recorded:
                </strong>
                ${midtermAttempts.length}
              </p>

            </div>

            <h3>
              Midterm Exam Attempts
            </h3>

            <table>

              <thead>
                <tr>
                  <th>
                    Attempt
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Mode
                  </th>

                  <th>
                    Score
                  </th>

                  <th>
                    Result
                  </th>

                  <th>
                    Incorrect
                  </th>
                </tr>
              </thead>

              <tbody>
                ${buildAttemptRows(
                  midtermAttempts
                )}
              </tbody>

            </table>

            <h3>
              Incorrect Answer Details
            </h3>

            ${buildIncorrectAnswerDetails(
              midtermAttempts
            )}

          </section>

          <!-- =========================================
               FINAL
          ========================================== -->

          <section class="section page-break">

            <h2>
              🏆 Final Review & Exam
            </h2>

            <div class="exam-box">

              <div class="exam-header">

                <div class="exam-title">
                  Final Exam
                </div>

                <div class="exam-status">
                  ${finalStatus}
                </div>

              </div>

              ${
                finalScore !== null
                  ? `
                    <p>
                      Final recorded score:
                    </p>

                    <div class="score">
                      ${finalScore}%
                    </div>
                  `
                  : `
                    <p class="muted">
                      No passing score has been recorded yet.
                    </p>
                  `
              }

              <p>
                <strong>
                  Passing standard:
                </strong>
                ${PASSING_SCORE}% or higher
              </p>

              <p>
                <strong>
                  Review:
                </strong>
                Day 177 – Study Guide #1
                and Day 178 – Study Guide #2
              </p>

              <p>
                <strong>
                  Exam:
                </strong>
                Day 179
              </p>

              <p>
                <strong>
                  Celebration:
                </strong>
                Day 180
              </p>

              <p>
                <strong>
                  Attempts recorded:
                </strong>
                ${finalAttempts.length}
              </p>

            </div>

            <h3>
              Final Exam Attempts
            </h3>

            <table>

              <thead>
                <tr>
                  <th>
                    Attempt
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Mode
                  </th>

                  <th>
                    Score
                  </th>

                  <th>
                    Result
                  </th>

                  <th>
                    Incorrect
                  </th>
                </tr>
              </thead>

              <tbody>
                ${buildAttemptRows(
                  finalAttempts
                )}
              </tbody>

            </table>

            <h3>
              Incorrect Answer Details
            </h3>

            ${buildIncorrectAnswerDetails(
              finalAttempts
            )}

          </section>

          <!-- =========================================
               COURSE STATUS
          ========================================== -->

          <section class="section">

            <h2>
              📖 Course Status
            </h2>

            <table>

              <tbody>

                <tr>
                  <th>
                    Course
                  </th>

                  <td>
                    Faith Foundations:
                    The M&M Adventure
                  </td>
                </tr>

                <tr>
                  <th>
                    Total School Days
                  </th>

                  <td>
                    180
                  </td>
                </tr>

                <tr>
                  <th>
                    Lessons Completed
                  </th>

                  <td>
                    ${completedCount}
                  </td>
                </tr>

                <tr>
                  <th>
                    Lessons Remaining
                  </th>

                  <td>
                    ${lessonsRemaining}
                  </td>
                </tr>

                <tr>
                  <th>
                    Overall Progress
                  </th>

                  <td>
                    ${progressPercent}%
                  </td>
                </tr>

                <tr>
                  <th>
                    Midterm
                  </th>

                  <td>
                    ${midtermStatus}
                    ${
                      midtermScore !== null
                        ? ` — ${midtermScore}%`
                        : ""
                    }
                  </td>
                </tr>

                <tr>
                  <th>
                    Final
                  </th>

                  <td>
                    ${finalStatus}
                    ${
                      finalScore !== null
                        ? ` — ${finalScore}%`
                        : ""
                    }
                  </td>
                </tr>

                <tr>
                  <th>
                    Faith Tree
                  </th>

                  <td>
                    ${faithTreeStage}
                  </td>
                </tr>

                <tr>
                  <th>
                    Course Status
                  </th>

                  <td>
                    <strong>
                      ${courseStatus}
                    </strong>
                  </td>
                </tr>

              </tbody>

            </table>

          </section>

          <!-- =========================================
               PARENT / TEACHER NOTES
          ========================================== -->

          <section class="section">

            <h2>
              📝 Parent / Teacher Notes
            </h2>

            <div class="notes-box">

              ${
                notes
                  ? escapeHtml(notes).replace(
                      /\n/g,
                      "<br>"
                    )
                  : `
                    <span class="muted">
                      No parent/teacher notes recorded.
                    </span>
                  `
              }

            </div>

          </section>

          <!-- =========================================
               SIGNATURES
          ========================================== -->

          <section class="section">

            <h2>
              ✍️ Parent / Teacher Verification
            </h2>

            <p>
              This report is intended to provide a
              record of progress through the
              Faith Foundations: The M&M Adventure
              Bible curriculum.
            </p>

            <div class="signature-grid">

              <div>
                <div class="signature-line"></div>

                <div class="signature-label">
                  Parent / Teacher Signature
                </div>
              </div>

              <div>
                <div class="signature-line"></div>

                <div class="signature-label">
                  Date
                </div>
              </div>

            </div>

          </section>

          <!-- =========================================
               FOOTER
          ========================================== -->

          <footer class="footer">

            <strong>
              Faith Foundations:
              The M&M Adventure
            </strong>

            <br>

            Growing in God's Word,
            one lesson at a time. 🌱📖🌳

            <br><br>

            Parent Progress Report —
            ${reportDate}

          </footer>

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
              🖨️ Print Detailed Progress Report
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

        {/* MIDTERM */}

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

        {/* FINAL */}

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

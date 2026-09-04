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

  /* =========================================================
     LOAD DATA
  ========================================================= */

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
    setMidtermScore(
      getScore(
        MIDTERM_PASS_SCORE_KEY,
        "faithMidtermScore"
      )
    );

    setFinalScore(
      getScore(
        FINAL_PASS_SCORE_KEY,
        "faithFinalScore"
      )
    );

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

  /* =========================================================
     REFRESH WHEN STUDENT DATA CHANGES
  ========================================================= */

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

  /* =========================================================
     LOGIN
  ========================================================= */

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

  function logout() {
    sessionStorage.removeItem(
      "parentAccess"
    );

    setUnlocked(false);
    setPassword("");
    setError("");
  }

  /* =========================================================
     NOTES
  ========================================================= */

  function saveNotes(value) {
    setNotes(value);

    try {
      localStorage.setItem(
        NOTES_KEY,
        value
      );
    } catch {}
  }

  /* =========================================================
     PROGRESS
  ========================================================= */

  const completedCount = completed.length;

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

  const nextLesson = getNextLesson();

  /* =========================================================
     BADGES
  ========================================================= */

  const badges = [
    ["🌱", "First Steps", 10],
    ["🌿", "Growing Strong", 25],
    ["🌳", "Faith Builder", 50],
    ["⭐", "Halfway Hero", 90],
    ["🏅", "Faith Champion", 135],
    ["🏆", "Faith Foundations Champion", 180],
  ];

  /* =========================================================
     EXAM STATUS
  ========================================================= */

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

  /* =========================================================
     FAITH TREE
  ========================================================= */

  function getFaithTreeStage(count) {
    if (count >= 180) {
      return {
        emoji: "🌳",
        title: "Faith Foundations Champion",
        message:
          "Your Faith Tree is fully grown!",
      };
    }

    if (count >= 135) {
      return {
        emoji: "🌲",
        title: "Faith Champion",
        message:
          "Your Faith Tree is growing beautifully!",
      };
    }

    if (count >= 90) {
      return {
        emoji: "🌳",
        title: "Halfway Hero",
        message:
          "Your faith is growing strong!",
      };
    }

    if (count >= 50) {
      return {
        emoji: "🌿",
        title: "Faith Builder",
        message:
          "Your Faith Tree is taking root!",
      };
    }

    if (count >= 25) {
      return {
        emoji: "🌱",
        title: "Growing Strong",
        message:
          "Keep growing in God's Word!",
      };
    }

    if (count >= 10) {
      return {
        emoji: "🌱",
        title: "First Steps",
        message:
          "Every lesson helps your faith grow!",
      };
    }

    return {
      emoji: "🌰",
      title: "Faith Seed",
      message:
        "Your faith journey is just beginning!",
    };
  }

  const faithTree =
    getFaithTreeStage(completedCount);

  /* =========================================================
     NAVIGATION
  ========================================================= */

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

  function openMidterm() {
    window.location.href =
      "/Midterm?parent=true&day=88";
  }

  function openFinal() {
    window.location.href =
      "/Final?parent=true&day=177";
  }

  /* =========================================================
     REPORT HELPERS
  ========================================================= */

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatNotes(value) {
    if (!value) {
      return "<span class='empty'>No parent/teacher notes entered.</span>";
    }

    return escapeHtml(value)
      .replace(/\n/g, "<br />");
  }

  function getAttemptScore(attempt) {
    if (
      attempt === null ||
      attempt === undefined
    ) {
      return null;
    }

    const possibleKeys = [
      "score",
      "percentage",
      "percent",
      "grade",
    ];

    for (const key of possibleKeys) {
      const value = Number(
        attempt?.[key]
      );

      if (
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100
      ) {
        return value;
      }
    }

    if (
      typeof attempt === "number" &&
      attempt >= 0 &&
      attempt <= 100
    ) {
      return attempt;
    }

    return null;
  }

  function getAttemptDate(attempt) {
    if (
      !attempt ||
      typeof attempt !== "object"
    ) {
      return "";
    }

    const possibleKeys = [
      "date",
      "completedAt",
      "timestamp",
      "createdAt",
      "submittedAt",
    ];

    for (const key of possibleKeys) {
      if (attempt[key]) {
        try {
          const date =
            new Date(attempt[key]);

          if (!Number.isNaN(date.getTime())) {
            return date.toLocaleDateString();
          }
        } catch {}
      }
    }

    return "";
  }

  function getIncorrectCount(attempt) {
    if (
      !attempt ||
      typeof attempt !== "object"
    ) {
      return null;
    }

    const possibleKeys = [
      "incorrectAnswers",
      "incorrectCount",
      "wrongAnswers",
      "missed",
    ];

    for (const key of possibleKeys) {
      const value = attempt[key];

      if (Array.isArray(value)) {
        return value.length;
      }

      const numeric = Number(value);

      if (
        Number.isFinite(numeric) &&
        numeric >= 0
      ) {
        return numeric;
      }
    }

    return null;
  }

  function getAttemptStatus(attempt) {
    const score =
      getAttemptScore(attempt);

    if (score === null) {
      return "Recorded";
    }

    return score >= PASSING_SCORE
      ? "PASS"
      : "NOT PASSED";
  }

  /* =========================================================
     PRINTABLE PROGRESS REPORT
     
     NOTE:
     The Lesson Completion Record has been REMOVED.
     Overall Course Progress is the single progress summary.
  ========================================================= */

  function printReport() {
    const reportWindow =
      window.open(
        "",
        "_blank",
        "width=1000,height=900"
      );

    if (!reportWindow) {
      alert(
        "Please allow pop-ups to print the progress report."
      );
      return;
    }

    const midtermAttemptRows =
      midtermAttempts.length > 0
        ? midtermAttempts
            .map(
              (attempt, index) => {
                const score =
                  getAttemptScore(
                    attempt
                  );

                const date =
                  getAttemptDate(
                    attempt
                  );

                const incorrect =
                  getIncorrectCount(
                    attempt
                  );

                const status =
                  getAttemptStatus(
                    attempt
                  );

                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>
                      ${
                        date
                          ? escapeHtml(date)
                          : "—"
                      }
                    </td>
                    <td>
                      ${
                        score !== null
                          ? `${score}%`
                          : "—"
                      }
                    </td>
                    <td>
                      ${
                        incorrect !== null
                          ? incorrect
                          : "—"
                      }
                    </td>
                    <td class="${
                      status === "PASS"
                        ? "pass"
                        : status ===
                          "NOT PASSED"
                        ? "not-passed"
                        : ""
                    }">
                      ${status}
                    </td>
                  </tr>
                `;
              }
            )
            .join("")
        : "";

    const finalAttemptRows =
      finalAttempts.length > 0
        ? finalAttempts
            .map(
              (attempt, index) => {
                const score =
                  getAttemptScore(
                    attempt
                  );

                const date =
                  getAttemptDate(
                    attempt
                  );

                const incorrect =
                  getIncorrectCount(
                    attempt
                  );

                const status =
                  getAttemptStatus(
                    attempt
                  );

                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>
                      ${
                        date
                          ? escapeHtml(date)
                          : "—"
                      }
                    </td>
                    <td>
                      ${
                        score !== null
                          ? `${score}%`
                          : "—"
                      }
                    </td>
                    <td>
                      ${
                        incorrect !== null
                          ? incorrect
                          : "—"
                      }
                    </td>
                    <td class="${
                      status === "PASS"
                        ? "pass"
                        : status ===
                          "NOT PASSED"
                        ? "not-passed"
                        : ""
                    }">
                      ${status}
                    </td>
                  </tr>
                `;
              }
            )
            .join("")
        : "";

    const badgeRows = badges
      .map(
        ([emoji, name, requirement]) => {
          const earned =
            completedCount >=
            requirement;

          return `
            <tr>
              <td class="badge-icon">
                ${emoji}
              </td>

              <td>
                <strong>
                  ${escapeHtml(name)}
                </strong>
              </td>

              <td>
                ${requirement} lessons
              </td>

              <td class="${
                earned
                  ? "earned"
                  : "not-earned"
              }">
                ${
                  earned
                    ? "Earned"
                    : "Not Yet Earned"
                }
              </td>
            </tr>
          `;
        }
      )
      .join("");

    let overallStatus =
      "In Progress";

    if (completedCount >= 180) {
      overallStatus =
        "Course Complete";
    } else if (completedCount === 0) {
      overallStatus =
        "Not Yet Started";
    }

    const midtermStatus =
      midtermPassed
        ? "PASS"
        : midtermNotPassed
        ? "NOT PASSED"
        : "Not Taken";

    const finalStatus =
      finalPassed
        ? "PASS"
        : finalNotPassed
        ? "NOT PASSED"
        : "Not Taken";

    const nextLessonText =
      nextLesson
        ? `Lesson ${nextLesson}`
        : "All lessons complete";

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>
            Faith Foundations Progress Report
          </title>

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              font-family:
                Arial,
                Helvetica,
                sans-serif;
              color: #26352b;
              background: #ffffff;
              line-height: 1.5;
            }

            .report {
              max-width: 900px;
              margin: 0 auto;
            }

            .header {
              text-align: center;
              border-bottom: 3px solid #4f7657;
              padding-bottom: 20px;
              margin-bottom: 28px;
            }

            .header h1 {
              margin: 0;
              font-size: 28px;
              color: #355d3d;
            }

            .header h2 {
              margin: 7px 0 0;
              font-size: 17px;
              font-weight: normal;
              color: #68776c;
            }

            .section {
              margin-bottom: 28px;
              page-break-inside: avoid;
            }

            .section-title {
              background: #eef5ef;
              border-left: 5px solid #4f7657;
              padding: 10px 14px;
              font-size: 17px;
              font-weight: bold;
              color: #355d3d;
              margin-bottom: 14px;
            }

            .info-grid {
              display: grid;
              grid-template-columns:
                1fr 1fr;
              gap: 10px 30px;
              border: 1px solid #d8e1da;
              border-radius: 8px;
              padding: 16px;
            }

            .info-item {
              padding: 5px 0;
            }

            .label {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: .6px;
              color: #718077;
              font-weight: bold;
            }

            .value {
              font-size: 15px;
              margin-top: 2px;
            }

            .progress-summary {
              border: 1px solid #d8e1da;
              border-radius: 10px;
              padding: 20px;
            }

            .progress-top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 20px;
              margin-bottom: 12px;
            }

            .progress-number {
              font-size: 25px;
              font-weight: bold;
              color: #355d3d;
            }

            .progress-percent {
              font-size: 25px;
              font-weight: bold;
              color: #4f7657;
            }

            .progress-bar {
              width: 100%;
              height: 18px;
              background: #e7eee8;
              border-radius: 20px;
              overflow: hidden;
              border: 1px solid #d2ddd4;
            }

            .progress-fill {
              height: 100%;
              width: ${progressPercent}%;
              background: #5d8a66;
              border-radius: 20px;
            }

            .progress-details {
              display: flex;
              justify-content: space-between;
              margin-top: 12px;
              font-size: 13px;
              color: #5e6d63;
            }

            .status-box {
              margin-top: 16px;
              padding: 12px;
              text-align: center;
              border-radius: 7px;
              background: #f3f8f4;
              border: 1px solid #cddbcf;
              font-weight: bold;
              color: #355d3d;
            }

            .tree-box {
              text-align: center;
              border: 1px solid #d8e1da;
              border-radius: 10px;
              padding: 18px;
              margin-bottom: 15px;
            }

            .tree-emoji {
              font-size: 55px;
              line-height: 1;
              margin-bottom: 8px;
            }

            .tree-title {
              font-size: 18px;
              font-weight: bold;
              color: #355d3d;
            }

            .tree-message {
              color: #68776c;
              margin-top: 4px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
            }

            th {
              background: #eef5ef;
              color: #355d3d;
              text-align: left;
              padding: 9px;
              border: 1px solid #d4dfd6;
            }

            td {
              padding: 9px;
              border: 1px solid #dce4de;
              vertical-align: middle;
            }

            .badge-icon {
              width: 50px;
              text-align: center;
              font-size: 22px;
            }

            .earned {
              color: #397048;
              font-weight: bold;
            }

            .not-earned {
              color: #8a918c;
            }

            .exam-grid {
              display: grid;
              grid-template-columns:
                1fr 1fr;
              gap: 16px;
            }

            .exam-card {
              border: 1px solid #d8e1da;
              border-radius: 9px;
              padding: 17px;
            }

            .exam-card h3 {
              margin: 0 0 10px;
              color: #355d3d;
              font-size: 16px;
            }

            .exam-line {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #edf1ee;
              padding: 7px 0;
            }

            .exam-line:last-child {
              border-bottom: none;
            }

            .pass {
              color: #347044;
              font-weight: bold;
            }

            .not-passed {
              color: #9a4d45;
              font-weight: bold;
            }

            .attempt-section {
              margin-top: 18px;
            }

            .attempt-title {
              font-size: 14px;
              font-weight: bold;
              color: #4c6252;
              margin-bottom: 8px;
            }

            .notes-box {
              min-height: 110px;
              border: 1px solid #d8e1da;
              border-radius: 8px;
              padding: 15px;
              background: #fcfdfc;
            }

            .empty {
              color: #89938c;
              font-style: italic;
            }

            .signature-grid {
              display: grid;
              grid-template-columns:
                1fr 1fr;
              gap: 45px;
              margin-top: 45px;
            }

            .signature-line {
              border-top: 1px solid #526158;
              padding-top: 7px;
              font-size: 12px;
              color: #66736a;
            }

            .footer {
              text-align: center;
              border-top: 1px solid #d8e1da;
              margin-top: 35px;
              padding-top: 14px;
              font-size: 11px;
              color: #7a857d;
            }

            @media print {
              body {
                padding: 20px;
              }

              .section {
                page-break-inside: avoid;
              }

              .header {
                page-break-after: avoid;
              }
            }

            @media (max-width: 650px) {
              body {
                padding: 20px;
              }

              .info-grid,
              .exam-grid,
              .signature-grid {
                grid-template-columns: 1fr;
              }

              .progress-top {
                flex-direction: column;
                align-items: flex-start;
              }
            }
          </style>
        </head>

        <body>
          <div class="report">

            <!-- HEADER -->

            <div class="header">
              <h1>
                Faith Foundations:
                The M&amp;M Adventure
              </h1>

              <h2>
                Bible Curriculum Progress Report
              </h2>
            </div>

            <!-- STUDENT INFORMATION -->

            <div class="section">
              <div class="section-title">
                Student Information
              </div>

              <div class="info-grid">

                <div class="info-item">
                  <div class="label">
                    Student
                  </div>
                  <div class="value">
                    ______________________________
                  </div>
                </div>

                <div class="info-item">
                  <div class="label">
                    Grade
                  </div>
                  <div class="value">
                    3rd Grade
                  </div>
                </div>

                <div class="info-item">
                  <div class="label">
                    School Year
                  </div>
                  <div class="value">
                    2026–2027
                  </div>
                </div>

                <div class="info-item">
                  <div class="label">
                    Parent / Teacher
                  </div>
                  <div class="value">
                    ______________________________
                  </div>
                </div>

              </div>
            </div>

            <!-- OVERALL COURSE PROGRESS -->

            <div class="section">
              <div class="section-title">
                Overall Course Progress
              </div>

              <div class="progress-summary">

                <div class="progress-top">

                  <div class="progress-number">
                    ${completedCount}
                    / ${TOTAL_LESSONS}
                    lessons
                  </div>

                  <div class="progress-percent">
                    ${progressPercent}%
                  </div>

                </div>

                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>

                <div class="progress-details">

                  <span>
                    Next:
                    ${escapeHtml(
                      nextLessonText
                    )}
                  </span>

                  <span>
                    ${TOTAL_LESSONS -
                      completedCount}
                    lessons remaining
                  </span>

                </div>

                <div class="status-box">
                  Course Status:
                  ${overallStatus}
                </div>

              </div>
            </div>

            <!-- FAITH GROWTH -->

            <div class="section">
              <div class="section-title">
                Faith Growth &amp; Achievements
              </div>

              <div class="tree-box">

                <div class="tree-emoji">
                  ${faithTree.emoji}
                </div>

                <div class="tree-title">
                  ${escapeHtml(
                    faithTree.title
                  )}
                </div>

                <div class="tree-message">
                  ${escapeHtml(
                    faithTree.message
                  )}
                </div>

              </div>

              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Badge</th>
                    <th>Requirement</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  ${badgeRows}
                </tbody>
              </table>
            </div>

            <!-- REVIEWS & EXAMS -->

            <div class="section">
              <div class="section-title">
                Reviews &amp; Exams
              </div>

              <div class="exam-grid">

                <div class="exam-card">

                  <h3>
                    Midterm Review &amp; Exam
                  </h3>

                  <div class="exam-line">
                    <span>
                      Review
                    </span>

                    <span>
                      Days 88–89
                    </span>
                  </div>

                  <div class="exam-line">
                    <span>
                      Exam
                    </span>

                    <span>
                      Day 90
                    </span>
                  </div>

                  <div class="exam-line">
                    <span>
                      Score
                    </span>

                    <span>
                      ${
                        midtermScore !== null
                          ? `${midtermScore}%`
                          : "Not Taken"
                      }
                    </span>
                  </div>

                  <div class="exam-line">
                    <span>
                      Result
                    </span>

                    <span class="${
                      midtermPassed
                        ? "pass"
                        : midtermNotPassed
                        ? "not-passed"
                        : ""
                    }">
                      ${midtermStatus}
                    </span>
                  </div>

                </div>

                <div class="exam-card">

                  <h3>
                    Final Review &amp; Exam
                  </h3>

                  <div class="exam-line">
                    <span>
                      Review
                    </span>

                    <span>
                      Days 177–178
                    </span>
                  </div>

                  <div class="exam-line">
                    <span>
                      Exam
                    </span>

                    <span>
                      Day 179
                    </span>
                  </div>

                  <div class="exam-line">
                    <span>
                      Score
                    </span>

                    <span>
                      ${
                        finalScore !== null
                          ? `${finalScore}%`
                          : "Not Taken"
                      }
                    </span>
                  </div>

                  <div class="exam-line">
                    <span>
                      Result
                    </span>

                    <span class="${
                      finalPassed
                        ? "pass"
                        : finalNotPassed
                        ? "not-passed"
                        : ""
                    }">
                      ${finalStatus}
                    </span>
                  </div>

                </div>

              </div>

              ${
                midtermAttempts.length >
                0
                  ? `
                    <div class="attempt-section">

                      <div class="attempt-title">
                        Midterm Attempt History
                      </div>

                      <table>
                        <thead>
                          <tr>
                            <th>Attempt</th>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Incorrect</th>
                            <th>Result</th>
                          </tr>
                        </thead>

                        <tbody>
                          ${midtermAttemptRows}
                        </tbody>
                      </table>

                    </div>
                  `
                  : ""
              }

              ${
                finalAttempts.length >
                0
                  ? `
                    <div class="attempt-section">

                      <div class="attempt-title">
                        Final Attempt History
                      </div>

                      <table>
                        <thead>
                          <tr>
                            <th>Attempt</th>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Incorrect</th>
                            <th>Result</th>
                          </tr>
                        </thead>

                        <tbody>
                          ${finalAttemptRows}
                        </tbody>
                      </table>

                    </div>
                  `
                  : ""
              }

            </div>

            <!-- PARENT / TEACHER NOTES -->

            <div class="section">
              <div class="section-title">
                Parent / Teacher Notes
              </div>

              <div class="notes-box">
                ${formatNotes(notes)}
              </div>
            </div>

            <!-- SIGNATURES -->

            <div class="signature-grid">

              <div class="signature-line">
                Parent / Teacher Signature
              </div>

              <div class="signature-line">
                Date
              </div>

            </div>

            <!-- FOOTER -->

            <div class="footer">
              Faith Foundations: The M&amp;M Adventure
              &nbsp;•&nbsp;
              Growing in God's Word, one lesson at a time.
            </div>

          </div>

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.print();
              }, 600);
            };
          </script>

        </body>
      </html>
    `);

    reportWindow.document.close();
  }

  /* =========================================================
     LOGIN SCREEN
  ========================================================= */

  if (!unlocked) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background:
            "linear-gradient(135deg, #eef7ef, #ffffff)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "35px",
            boxShadow:
              "0 10px 35px rgba(53, 93, 61, 0.12)",
            border:
              "1px solid #dce8de",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "10px",
            }}
          >
            🌳
          </div>

          <h1
            style={{
              margin: "0",
              color: "#355d3d",
              fontSize: "27px",
            }}
          >
            Parent Dashboard
          </h1>

          <p
            style={{
              color: "#69776d",
              marginTop: "8px",
              marginBottom: "25px",
            }}
          >
            Faith Foundations:
            The M&amp;M Adventure
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
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border:
                  "1px solid #ccd9ce",
                fontSize: "16px",
                outline: "none",
                marginBottom: "12px",
              }}
            />

            {error && (
              <div
                style={{
                  color: "#a34b45",
                  fontSize: "14px",
                  marginBottom: "12px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "10px",
                background: "#4f7657",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🔐 Parent Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* =========================================================
     DASHBOARD
  ========================================================= */

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f3f8f4 0%, #ffffff 35%)",
        padding: "25px 18px 50px",
      }}
    >
      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                color: "#718077",
                fontWeight: "bold",
                textTransform:
                  "uppercase",
                letterSpacing: "1px",
              }}
            >
              Faith Foundations
            </div>

            <h1
              style={{
                margin: "4px 0 0",
                color: "#355d3d",
                fontSize: "30px",
              }}
            >
              🌳 Parent Dashboard
            </h1>
          </div>

          <button
            onClick={logout}
            style={{
              padding: "10px 15px",
              borderRadius: "9px",
              border:
                "1px solid #ccd9ce",
              background: "#ffffff",
              color: "#526158",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Log Out
          </button>
        </div>

        {/* COURSE PROGRESS */}

        <section
          style={{
            background: "#ffffff",
            border:
              "1px solid #dce7de",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow:
              "0 5px 18px rgba(53,93,61,.06)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#355d3d",
            }}
          >
            📚 Course Progress
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(170px,1fr))",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <DashboardStat
              icon="📖"
              label="Lessons Completed"
              value={`${completedCount} / ${TOTAL_LESSONS}`}
            />

            <DashboardStat
              icon="📊"
              label="Progress"
              value={`${progressPercent}%`}
            />

            <DashboardStat
              icon="➡️"
              label="Next Lesson"
              value={
                nextLesson
                  ? `Day ${nextLesson}`
                  : "Complete!"
              }
            />

            <DashboardStat
              icon="🏆"
              label="Faith Tree"
              value={faithTree.title}
            />
          </div>

          <div
            style={{
              width: "100%",
              height: "15px",
              background: "#e8efe9",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background:
                  "#5d8a66",
                borderRadius: "20px",
                transition:
                  "width .3s ease",
              }}
            />
          </div>
        </section>

        {/* FAITH TREE */}

        <section
          style={{
            background: "#ffffff",
            border:
              "1px solid #dce7de",
            borderRadius: "16px",
            padding: "25px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "75px",
              lineHeight: 1,
            }}
          >
            {faithTree.emoji}
          </div>

          <h2
            style={{
              color: "#355d3d",
              margin:
                "10px 0 5px",
            }}
          >
            {faithTree.title}
          </h2>

          <p
            style={{
              color: "#68776c",
              margin: 0,
            }}
          >
            {faithTree.message}
          </p>
        </section>

        {/* ACTION BUTTONS */}

        <section
          style={{
            background: "#ffffff",
            border:
              "1px solid #dce7de",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#355d3d",
            }}
          >
            🛠 Parent Controls
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(210px,1fr))",
              gap: "12px",
            }}
          >
            <ParentButton
              onClick={previewLessons}
              icon="📚"
              text="Preview All Lessons"
            />

            <ParentButton
              onClick={openNextLesson}
              icon="➡️"
              text={
                nextLesson
                  ? `Open Next Lesson (${nextLesson})`
                  : "All Lessons Complete"
              }
            />

            <ParentButton
              onClick={openMidterm}
              icon="📝"
              text="Preview Midterm"
            />

            <ParentButton
              onClick={openFinal}
              icon="🎓"
              text="Preview Final"
            />

            <ParentButton
              onClick={printReport}
              icon="🖨️"
              text="Print Progress Report"
            />
          </div>
        </section>

        {/* BADGES */}

        <section
          style={{
            background: "#ffffff",
            border:
              "1px solid #dce7de",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#355d3d",
            }}
          >
            🏅 Badges
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: "12px",
            }}
          >
            {badges.map(
              ([
                emoji,
                name,
                requirement,
              ]) => {
                const earned =
                  completedCount >=
                  requirement;

                return (
                  <div
                    key={name}
                    style={{
                      padding: "16px",
                      borderRadius:
                        "12px",
                      border: earned
                        ? "2px solid #6d9976"
                        : "1px solid #dce5de",
                      background:
                        earned
                          ? "#f1f8f2"
                          : "#fafcfa",
                      opacity: earned
                        ? 1
                        : 0.65,
                      textAlign:
                        "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "32px",
                      }}
                    >
                      {emoji}
                    </div>

                    <strong
                      style={{
                        display:
                          "block",
                        color:
                          "#355d3d",
                        marginTop:
                          "7px",
                      }}
                    >
                      {name}
                    </strong>

                    <small
                      style={{
                        color:
                          "#6d796f",
                      }}
                    >
                      {requirement} lessons
                    </small>

                    <div
                      style={{
                        marginTop:
                          "7px",
                        fontSize:
                          "12px",
                        fontWeight:
                          "bold",
                        color: earned
                          ? "#397048"
                          : "#89938c",
                      }}
                    >
                      {earned
                        ? "✓ Earned"
                        : "Not Yet Earned"}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* EXAMS */}

        <section
          style={{
            background: "#ffffff",
            border:
              "1px solid #dce7de",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#355d3d",
            }}
          >
            📝 Reviews & Exams
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: "15px",
            }}
          >
            <ExamDashboardCard
              title="Midterm"
              review="Days 88–89"
              exam="Day 90"
              score={midtermScore}
              passed={midtermPassed}
              notPassed={
                midtermNotPassed
              }
            />

            <ExamDashboardCard
              title="Final"
              review="Days 177–178"
              exam="Day 179"
              score={finalScore}
              passed={finalPassed}
              notPassed={
                finalNotPassed
              }
            />
          </div>
        </section>

        {/* NOTES */}

        <section
          style={{
            background: "#ffffff",
            border:
              "1px solid #dce7de",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#355d3d",
            }}
          >
            📝 Parent / Teacher Notes
          </h2>

          <textarea
            value={notes}
            onChange={(e) =>
              saveNotes(
                e.target.value
              )
            }
            placeholder="Enter notes about the student's progress, strengths, areas to work on, or anything you want to remember..."
            style={{
              width: "100%",
              minHeight: "170px",
              resize: "vertical",
              padding: "14px",
              borderRadius: "10px",
              border:
                "1px solid #ccd9ce",
              fontSize: "15px",
              lineHeight: 1.5,
              fontFamily:
                "inherit",
              outline: "none",
            }}
          />

          <div
            style={{
              marginTop: "7px",
              fontSize: "12px",
              color: "#7a857d",
            }}
          >
            Notes save automatically.
          </div>
        </section>

      </div>
    </main>
  );
}

/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({
  icon,
  label,
  value,
}) {
  return (
    <div
      style={{
        background: "#f5f9f5",
        border:
          "1px solid #dce7de",
        borderRadius: "12px",
        padding: "15px",
      }}
    >
      <div
        style={{
          fontSize: "22px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          marginTop: "6px",
          fontSize: "12px",
          color: "#718077",
          fontWeight: "bold",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: "3px",
          color: "#355d3d",
          fontSize: "17px",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   PARENT BUTTON
========================================================= */

function ParentButton({
  onClick,
  icon,
  text,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "15px",
        borderRadius: "11px",
        border:
          "1px solid #cddbcf",
        background: "#f7faf7",
        color: "#355d3d",
        fontWeight: "bold",
        fontSize: "14px",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        style={{
          fontSize: "20px",
          marginRight: "8px",
        }}
      >
        {icon}
      </span>

      {text}
    </button>
  );
}

/* =========================================================
   EXAM DASHBOARD CARD
========================================================= */

function ExamDashboardCard({
  title,
  review,
  exam,
  score,
  passed,
  notPassed,
}) {
  return (
    <div
      style={{
        border:
          "1px solid #dce7de",
        borderRadius: "12px",
        padding: "18px",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: "#355d3d",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          padding: "7px 0",
          borderBottom:
            "1px solid #edf1ee",
          fontSize: "14px",
        }}
      >
        <span>Review</span>
        <strong>{review}</strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          padding: "7px 0",
          borderBottom:
            "1px solid #edf1ee",
          fontSize: "14px",
        }}
      >
        <span>Exam</span>
        <strong>{exam}</strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          padding: "7px 0",
          borderBottom:
            "1px solid #edf1ee",
          fontSize: "14px",
        }}
      >
        <span>Score</span>

        <strong>
          {score !== null
            ? `${score}%`
            : "Not Taken"}
        </strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          padding: "7px 0",
          fontSize: "14px",
        }}
      >
        <span>Result</span>

        <strong
          style={{
            color: passed
              ? "#397048"
              : notPassed
              ? "#a34b45"
              : "#7a857d",
          }}
        >
          {passed
            ? "PASS"
            : notPassed
            ? "NOT PASSED"
            : "Not Taken"}
        </strong>
      </div>
    </div>
  );
}

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
      try {
        sessionStorage.setItem(
          "parentAccess",
          "true"
        );
      } catch {}

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
    try {
      sessionStorage.removeItem(
        "parentAccess"
      );
    } catch {}

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

  const lessonsRemaining =
    TOTAL_LESSONS - completedCount;

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
     
     IMPORTANT:
     These milestones match the Student Home page:
     10, 25, 50, 90, 135, 180
  ========================================================= */

  const badges = [
    ["🌱", "First Steps", 10],
    ["🌿", "Growing Strong", 25],
    ["🌳", "Faith Builder", 50],
    ["⭐", "Halfway Hero", 90],
    ["🏅", "Faith Champion", 135],
    ["🏆", "Faith Foundations Champion", 180],
  ];

  const earnedBadges = badges.filter(
    (badge) =>
      completedCount >= badge[2]
  );

  /* =========================================================
     EXAMS
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

     EXACT SAME MILESTONES AS STUDENT HOME
  ========================================================= */

  function getFaithTreeStage(count) {
    if (count >= 180) {
      return {
        emoji: "🌲🌳🌲🌳🌲",
        title:
          "Faith Foundations Champion",
        message:
          "Your Faith Tree is fully grown!",
      };
    }

    if (count >= 135) {
      return {
        emoji: "🌲🌳🌲🌳",
        title: "Faith Champion",
        message:
          "Your Faith Tree is growing beautifully!",
      };
    }

    if (count >= 90) {
      return {
        emoji: "🌳🌳🌳",
        title: "Halfway Hero",
        message:
          "Your faith is growing strong!",
      };
    }

    if (count >= 50) {
      return {
        emoji: "🌳",
        title: "Faith Builder",
        message:
          "Your Faith Tree is growing strong!",
      };
    }

    if (count >= 25) {
      return {
        emoji: "🌿",
        title: "Growing Strong",
        message:
          "Your faith is growing stronger every day!",
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

    if (count >= 1) {
      return {
        emoji: "🌱",
        title: "Faith Seed Planted",
        message:
          "Your Faith Seed has been planted. Keep growing in God's Word!",
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
     SAFE HTML
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
    return escapeHtml(value)
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n/g, "<br>");
  }

  /* =========================================================
     EXAM ATTEMPT HELPERS
  ========================================================= */

  function getAttemptScore(attempt) {
    if (
      !attempt ||
      typeof attempt !== "object"
    ) {
      return null;
    }

    const possibleValues = [
      attempt.score,
      attempt.percentage,
      attempt.percent,
      attempt.grade,
      attempt.result,
    ];

    for (const value of possibleValues) {
      if (
        typeof value === "number" &&
        Number.isFinite(value)
      ) {
        return value;
      }

      if (
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        const numeric =
          Number(
            value
              .replace("%", "")
              .trim()
          );

        if (
          Number.isFinite(numeric)
        ) {
          return numeric;
        }
      }
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

    const possibleDates = [
      attempt.date,
      attempt.completedAt,
      attempt.timestamp,
      attempt.createdAt,
      attempt.time,
    ];

    for (const value of possibleDates) {
      if (!value) continue;

      try {
        const date = new Date(value);

        if (
          !Number.isNaN(
            date.getTime()
          )
        ) {
          return date.toLocaleDateString();
        }
      } catch {}
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

    const possibleValues = [
      attempt.incorrectAnswers,
      attempt.incorrectCount,
      attempt.wrongAnswers,
      attempt.missed,
      attempt.missedQuestions,
    ];

    for (const value of possibleValues) {
      if (
        typeof value === "number"
      ) {
        return value;
      }

      if (
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        const numeric =
          Number(value);

        if (
          Number.isFinite(numeric)
        ) {
          return numeric;
        }
      }

      if (Array.isArray(value)) {
        return value.length;
      }
    }

    return null;
  }

  function getAttemptStatus(attempt) {
    const score =
      getAttemptScore(attempt);

    if (score === null) {
      return "RECORDED";
    }

    return score >= PASSING_SCORE
      ? "PASSED"
      : "NOT PASSED";
  }

  function buildAttemptsRows(attempts) {
    if (
      !Array.isArray(attempts) ||
      attempts.length === 0
    ) {
      return "";
    }

    return attempts
      .map((attempt, index) => {
        const score =
          getAttemptScore(attempt);

        const date =
          getAttemptDate(attempt);

        const incorrect =
          getIncorrectCount(attempt);

        const status =
          getAttemptStatus(attempt);

        const statusClass =
          status === "PASSED"
            ? "status-pass"
            : status === "NOT PASSED"
            ? "status-fail"
            : "status-neutral";

        return `
          <tr>
            <td>${index + 1}</td>

            <td>
              ${escapeHtml(
                date || "—"
              )}
            </td>

            <td>
              ${
                score !== null
                  ? `${escapeHtml(
                      score
                    )}%`
                  : "—"
              }
            </td>

            <td>
              ${
                incorrect !== null
                  ? escapeHtml(
                      incorrect
                    )
                  : "—"
              }
            </td>

            <td>
              <span class="${statusClass}">
                ${escapeHtml(status)}
              </span>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function buildAttemptSection(
    title,
    attempts
  ) {
    if (
      !Array.isArray(attempts) ||
      attempts.length === 0
    ) {
      return "";
    }

    return `
      <div class="section">

        <div class="section-title">
          ${escapeHtml(title)}
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
            ${buildAttemptsRows(
              attempts
            )}
          </tbody>

        </table>

      </div>
    `;
  }

  /* =========================================================
     PRINTABLE PARENT REPORT
  ========================================================= */

  function printReport() {
    const reportWindow =
      window.open(
        "",
        "_blank",
        "width=1000,height=1100"
      );

    if (!reportWindow) {
      alert(
        "Please allow pop-ups so the progress report can open."
      );
      return;
    }

    const today =
      new Date().toLocaleDateString();

    const courseStatus =
      completedCount >= TOTAL_LESSONS
        ? "COURSE COMPLETED"
        : completedCount > 0
        ? "IN PROGRESS"
        : "NOT YET STARTED";

    const statusClass =
      completedCount >= TOTAL_LESSONS
        ? "complete"
        : completedCount > 0
        ? "progress"
        : "not-started";

    const badgeRows = badges
      .map((badge) => {
        const earned =
          completedCount >= badge[2];

        return `
          <tr>

            <td class="badge-icon">
              ${badge[0]}
            </td>

            <td>
              <strong>
                ${escapeHtml(
                  badge[1]
                )}
              </strong>
            </td>

            <td>
              ${badge[2]} lessons
            </td>

            <td>
              ${
                earned
                  ? `<span class="earned">
                      ✓ EARNED
                    </span>`
                  : `<span class="not-earned">
                      Not Yet Earned
                    </span>`
              }
            </td>

          </tr>
        `;
      })
      .join("");

    const completedLessonRows =
      completed.length > 0
        ? completed
            .map(
              (day) => `
                <span class="lesson-chip">
                  ${day}
                </span>
              `
            )
            .join("")
        : `
            <div class="empty-progress">
              No lessons completed yet.
            </div>
          `;

    const midtermExamStatus =
      midtermScore === null
        ? "Not completed"
        : midtermPassed
        ? "PASSED"
        : "NOT PASSED";

    const finalExamStatus =
      finalScore === null
        ? "Not completed"
        : finalPassed
        ? "PASSED"
        : "NOT PASSED";

    const midtermStatusClass =
      midtermPassed
        ? "status-pass"
        : midtermNotPassed
        ? "status-fail"
        : "status-neutral";

    const finalStatusClass =
      finalPassed
        ? "status-pass"
        : finalNotPassed
        ? "status-fail"
        : "status-neutral";

    const midtermAttemptSection =
      buildAttemptSection(
        "MIDTERM EXAM ATTEMPT HISTORY",
        midtermAttempts
      );

    const finalAttemptSection =
      buildAttemptSection(
        "FINAL EXAM ATTEMPT HISTORY",
        finalAttempts
      );

    reportWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <meta charset="UTF-8" />

        <title>
          Faith Foundations Progress Report
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          @page {
            size: Letter;
            margin: 0.45in;
          }

          body {
            margin: 0;
            padding: 0;
            background: #eef3ef;
            color: #27352f;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
            font-size: 13px;
            line-height: 1.45;
          }

          .report {
            max-width: 8in;
            margin: 0 auto;
            background: white;
            padding: 28px;
          }

          .report-header {
            text-align: center;
            border-bottom:
              4px solid #315c48;
            padding-bottom: 18px;
            margin-bottom: 20px;
          }

          .tree {
            font-size: 44px;
            line-height: 1;
            margin-bottom: 5px;
          }

          .school-name {
            color: #315c48;
            font-size: 28px;
            font-weight: 800;
          }

          .adventure {
            font-size: 19px;
            font-weight: 600;
            color: #65756c;
            margin-top: 2px;
          }

          .report-title {
            font-size: 22px;
            font-weight: 800;
            margin-top: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .report-subtitle {
            color: #68766f;
            margin-top: 3px;
          }

          .section {
            margin-top: 20px;
            page-break-inside: avoid;
          }

          .section-title {
            background: #315c48;
            color: white;
            padding: 9px 12px;
            border-radius:
              7px 7px 0 0;
            font-size: 15px;
            font-weight: 800;
            letter-spacing: 0.3px;
          }

          .info-grid {
            display: grid;
            grid-template-columns:
              1fr 1fr;
            border:
              1px solid #d5ddd8;
            border-top: 0;
          }

          .info-item {
            min-height: 58px;
            padding: 10px 13px;
            border-bottom:
              1px solid #d5ddd8;
          }

          .info-item:nth-child(odd) {
            border-right:
              1px solid #d5ddd8;
          }

          .info-label {
            display: block;
            color: #728079;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 3px;
          }

          .info-value {
            font-size: 15px;
            font-weight: 700;
            min-height: 20px;
          }

          .progress-card {
            border:
              1px solid #cdd8d1;
            border-radius: 10px;
            overflow: hidden;
          }

          .progress-main {
            display: grid;
            grid-template-columns:
              130px 1fr 125px;
            align-items: center;
            gap: 18px;
            padding: 18px;
          }

          .percent-circle {
            width: 108px;
            height: 108px;
            border-radius: 50%;
            border:
              9px solid #dce7df;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: auto;
            font-size: 27px;
            font-weight: 800;
            color: #315c48;
          }

          .progress-heading {
            font-size: 20px;
            font-weight: 800;
            color: #315c48;
          }

          .progress-detail {
            color: #65736c;
            margin-top: 5px;
          }

          .progress-bar {
            height: 14px;
            background: #e3e9e5;
            border-radius: 99px;
            overflow: hidden;
            margin-top: 14px;
          }

          .progress-fill {
            height: 100%;
            width: ${progressPercent}%;
            background: #315c48;
            border-radius: 99px;
          }

          .tree-card {
            text-align: center;
            border-left:
              1px solid #d5ddd8;
            padding-left: 18px;
          }

          .tree-icon {
            font-size: 45px;
          }

          .tree-stage {
            font-size: 12px;
            font-weight: 800;
            color: #315c48;
            margin-top: 3px;
          }

          .tree-message {
            font-size: 10px;
            color: #718078;
          }

          .progress-summary {
            display: grid;
            grid-template-columns:
              repeat(3, 1fr);
            border-top:
              1px solid #d5ddd8;
            background: #f6f8f6;
          }

          .summary-item {
            text-align: center;
            padding: 10px;
            border-right:
              1px solid #d5ddd8;
          }

          .summary-item:last-child {
            border-right: 0;
          }

          .summary-number {
            font-size: 18px;
            font-weight: 800;
            color: #315c48;
          }

          .summary-label {
            font-size: 9px;
            text-transform: uppercase;
            color: #77847e;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .status-box {
            margin-top: 12px;
            text-align: center;
            padding: 10px;
            border-radius: 7px;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.6px;
          }

          .status-box.complete {
            background: #e4f2e8;
            color: #245c38;
            border:
              1px solid #acd0b8;
          }

          .status-box.progress {
            background: #eef4ef;
            color: #315c48;
            border:
              1px solid #c8d8ce;
          }

          .status-box.not-started {
            background: #f5f5f4;
            color: #66706b;
            border:
              1px solid #d8dbd9;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            background: #f0f4f1;
            color: #526159;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: left;
            padding: 8px;
            border:
              1px solid #d5ddd8;
          }

          td {
            padding: 8px;
            border:
              1px solid #d5ddd8;
            vertical-align: middle;
          }

          .badge-icon {
            width: 45px;
            font-size: 24px;
            text-align: center;
          }

          .earned {
            display: inline-block;
            background: #e2f1e7;
            color: #246039;
            border-radius: 20px;
            padding: 3px 8px;
            font-size: 9px;
            font-weight: 800;
          }

          .not-earned {
            color: #8a928d;
            font-size: 10px;
          }

          .exam-grid {
            display: grid;
            grid-template-columns:
              1fr 1fr;
            gap: 12px;
          }

          .exam-card {
            border:
              1px solid #d5ddd8;
            border-radius: 8px;
            overflow: hidden;
          }

          .exam-header {
            background: #f0f4f1;
            padding: 10px 12px;
            font-weight: 800;
            color: #315c48;
          }

          .exam-body {
            padding: 12px;
          }

          .exam-score {
            font-size: 28px;
            font-weight: 800;
            color: #315c48;
          }

          .exam-label {
            color: #77847e;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 700;
          }

          .status-pass,
          .status-fail,
          .status-neutral {
            display: inline-block;
            border-radius: 20px;
            padding: 3px 8px;
            font-size: 9px;
            font-weight: 800;
          }

          .status-pass {
            background: #e2f1e7;
            color: #245c38;
          }

          .status-fail {
            background: #f8e7e4;
            color: #8a382d;
          }

          .status-neutral {
            background: #eeeeeb;
            color: #6c746f;
          }

          .exam-note {
            margin-top: 8px;
            color: #68756e;
            font-size: 10px;
          }

          .lesson-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            padding: 12px;
            border:
              1px solid #d5ddd8;
            border-top: 0;
          }

          .lesson-chip {
            width: 28px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            background: #315c48;
            color: white;
            font-size: 9px;
            font-weight: 700;
          }

          .empty-progress {
            width: 100%;
            padding: 15px;
            text-align: center;
            color: #77847e;
          }

          .notes-box {
            min-height: 120px;
            border:
              1px solid #d5ddd8;
            padding: 15px;
            line-height: 1.6;
          }

          .no-notes {
            color: #8a928d;
            font-style: italic;
          }

          .signature-grid {
            display: grid;
            grid-template-columns:
              1fr 1fr;
            gap: 35px;
            margin-top: 35px;
          }

          .signature-line {
            border-bottom:
              1px solid #4b554f;
            height: 28px;
          }

          .signature-label {
            font-size: 9px;
            color: #77847e;
            text-transform: uppercase;
            font-weight: 700;
            margin-top: 5px;
          }

          .footer {
            border-top:
              2px solid #d5ddd8;
            margin-top: 28px;
            padding-top: 12px;
            text-align: center;
            color: #7a857f;
            font-size: 9px;
          }

          .footer strong {
            color: #315c48;
          }

          @media print {

            body {
              background: white;
            }

            .report {
              max-width: none;
              margin: 0;
              padding: 0;
            }

            .section,
            .progress-card,
            .exam-card,
            table {
              page-break-inside: avoid;
            }

            .lesson-grid {
              page-break-inside: auto;
            }

          }

        </style>

      </head>

      <body>

        <div class="report">

          <div class="report-header">

            <div class="tree">
              ${faithTree.emoji}
            </div>

            <div class="school-name">
              Faith Foundations
            </div>

            <div class="adventure">
              The M&amp;M Adventure
            </div>

            <div class="report-title">
              Bible Curriculum Progress Report
            </div>

            <div class="report-subtitle">
              Parent / Teacher Report Card
            </div>

          </div>

          <div class="section">

            <div class="section-title">
              STUDENT INFORMATION
            </div>

            <div class="info-grid">

              <div class="info-item">
                <span class="info-label">
                  Student
                </span>

                <div class="info-value">
                  ______________________________
                </div>
              </div>

              <div class="info-item">
                <span class="info-label">
                  Grade
                </span>

                <div class="info-value">
                  3rd Grade
                </div>
              </div>

              <div class="info-item">
                <span class="info-label">
                  School Year
                </span>

                <div class="info-value">
                  2026–2027
                </div>
              </div>

              <div class="info-item">
                <span class="info-label">
                  Parent / Teacher
                </span>

                <div class="info-value">
                  ______________________________
                </div>
              </div>

            </div>

          </div>

          <div class="section">

            <div class="section-title">
              OVERALL COURSE PROGRESS
            </div>

            <div class="progress-card">

              <div class="progress-main">

                <div class="percent-circle">
                  ${progressPercent}%
                </div>

                <div>

                  <div class="progress-heading">
                    ${completedCount}
                    of
                    ${TOTAL_LESSONS}
                    Lessons
                  </div>

                  <div class="progress-detail">
                    ${
                      lessonsRemaining > 0
                        ? `${lessonsRemaining} lessons remaining`
                        : "All lessons completed"
                    }
                  </div>

                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>

                </div>

                <div class="tree-card">

                  <div class="tree-icon">
                    ${faithTree.emoji}
                  </div>

                  <div class="tree-stage">
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

              </div>

              <div class="progress-summary">

                <div class="summary-item">

                  <div class="summary-number">
                    ${
                      nextLesson
                        ? `Day ${nextLesson}`
                        : "Complete"
                    }
                  </div>

                  <div class="summary-label">
                    Next Lesson
                  </div>

                </div>

                <div class="summary-item">

                  <div class="summary-number">
                    ${earnedBadges.length}
                  </div>

                  <div class="summary-label">
                    Badges Earned
                  </div>

                </div>

                <div class="summary-item">

                  <div class="summary-number">
                    ${completedCount}
                  </div>

                  <div class="summary-label">
                    Lessons Completed
                  </div>

                </div>

              </div>

            </div>

            <div class="status-box ${statusClass}">
              ${courseStatus}
            </div>

          </div>

          <div class="section">

            <div class="section-title">
              FAITH GROWTH &amp; ACHIEVEMENTS
            </div>

            <table>

              <thead>

                <tr>
                  <th>Badge</th>
                  <th>Achievement</th>
                  <th>Requirement</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>
                ${badgeRows}
              </tbody>

            </table>

          </div>

          <div class="section">

            <div class="section-title">
              REVIEWS &amp; EXAMS
            </div>

            <div class="exam-grid">

              <div class="exam-card">

                <div class="exam-header">
                  📖 Midterm Review &amp; Exam
                </div>

                <div class="exam-body">

                  <div class="exam-label">
                    Score
                  </div>

                  <div class="exam-score">
                    ${
                      midtermScore !== null
                        ? `${midtermScore}%`
                        : "—"
                    }
                  </div>

                  <div>

                    <span
                      class="${midtermStatusClass}"
                    >
                      ${midtermExamStatus}
                    </span>

                  </div>

                  <div class="exam-note">
                    Review &amp; Exam:
                    Days 88–90
                    <br />
                    Passing standard:
                    80% or higher
                  </div>

                </div>

              </div>

              <div class="exam-card">

                <div class="exam-header">
                  🏆 Final Review &amp; Exam
                </div>

                <div class="exam-body">

                  <div class="exam-label">
                    Score
                  </div>

                  <div class="exam-score">
                    ${
                      finalScore !== null
                        ? `${finalScore}%`
                        : "—"
                    }
                  </div>

                  <div>

                    <span
                      class="${finalStatusClass}"
                    >
                      ${finalExamStatus}
                    </span>

                  </div>

                  <div class="exam-note">
                    Review &amp; Exam:
                    Days 177–180
                    <br />
                    Passing standard:
                    80% or higher
                  </div>

                </div>

              </div>

            </div>

          </div>

          ${midtermAttemptSection}

          ${finalAttemptSection}

          <div class="section">

            <div class="section-title">
              LESSON COMPLETION RECORD
            </div>

            <div class="lesson-grid">
              ${completedLessonRows}
            </div>

          </div>

          <div class="section">

            <div class="section-title">
              PARENT / TEACHER NOTES
            </div>

            <div class="notes-box">

              ${
                notes
                  ? formatNotes(notes)
                  : `
                    <span class="no-notes">
                      No parent or teacher notes
                      have been entered.
                    </span>
                  `
              }

            </div>

          </div>

          <div class="signature-grid">

            <div>

              <div class="signature-line"></div>

              <div class="signature-label">
                Parent / Teacher Signature
              </div>

            </div>

            <div>

              <div class="signature-line">
                ${escapeHtml(today)}
              </div>

              <div class="signature-label">
                Date
              </div>

            </div>

          </div>

          <div class="footer">

            <strong>
              Faith Foundations:
              The M&amp;M Adventure
            </strong>

            <br />

            Bible Curriculum Progress Report
            • 180-Day Homeschool Bible Curriculum
            • School Year 2026–2027

            <br />

            Every lesson is a step toward
            growing in God's Word. 🌱

          </div>

        </div>

        <script>

          setTimeout(function () {
            window.focus();
            window.print();
          }, 600);

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
            "linear-gradient(135deg,#eef5ef,#ffffff)",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: "white",
            borderRadius: "20px",
            padding: "35px",
            boxShadow:
              "0 15px 45px rgba(49,92,72,.15)",
            textAlign: "center",
          }}
        >

          <div
            style={{
              fontSize: "60px",
              marginBottom: "8px",
            }}
          >
            🌳
          </div>

          <h1
            style={{
              margin: 0,
              color: "#315c48",
              fontSize: "28px",
            }}
          >
            Faith Foundations
          </h1>

          <h2
            style={{
              margin:
                "5px 0 25px",
              color: "#6b786f",
              fontSize: "17px",
              fontWeight: 600,
            }}
          >
            The M&amp;M Adventure
          </h2>

          <div
            style={{
              background: "#f2f6f3",
              borderRadius: "12px",
              padding: "18px",
              marginBottom: "22px",
            }}
          >

            <strong
              style={{
                color: "#315c48",
              }}
            >
              🔐 Parent Dashboard
            </strong>

            <p
              style={{
                margin:
                  "8px 0 0",
                color: "#69766f",
                fontSize: "14px",
              }}
            >
              Enter the parent password
              to view student progress,
              exams, badges, and reports.
            </p>

          </div>

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
                border:
                  "1px solid #ccd7d0",
                borderRadius: "10px",
                fontSize: "16px",
                outline: "none",
                marginBottom: "12px",
              }}
            />

            {error && (
              <div
                style={{
                  color: "#a33a2e",
                  background: "#fff0ed",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  fontSize: "13px",
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
                background: "#315c48",
                color: "white",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🔓 Open Parent Dashboard
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
        background: "#f3f7f4",
        padding: "20px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#26352e",
      }}
    >

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >

        {/* HEADER */}

        <header
          style={{
            background: "#315c48",
            color: "white",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >

          <div>

            <div
              style={{
                fontSize: "30px",
                fontWeight: 800,
              }}
            >
              🌳 Faith Foundations
            </div>

            <div
              style={{
                opacity: 0.9,
                marginTop: "4px",
              }}
            >
              The M&amp;M Adventure
            </div>

            <div
              style={{
                marginTop: "10px",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              Parent Dashboard
            </div>

          </div>

          <button
            onClick={logout}
            style={{
              border:
                "1px solid rgba(255,255,255,.5)",
              background:
                "rgba(255,255,255,.12)",
              color: "white",
              borderRadius: "9px",
              padding:
                "10px 15px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            🔒 Log Out
          </button>

        </header>

        {/* PROGRESS */}

        <section
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "22px",
            marginBottom: "18px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.05)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#315c48",
            }}
          >
            📊 Student Progress
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(140px,1fr))",
              gap: "12px",
            }}
          >

            <DashboardStat
              label="Lessons Completed"
              value={`${completedCount}/180`}
            />

            <DashboardStat
              label="Overall Progress"
              value={`${progressPercent}%`}
            />

            <DashboardStat
              label="Lessons Remaining"
              value={lessonsRemaining}
            />

            <DashboardStat
              label="Next Lesson"
              value={
                nextLesson
                  ? `Day ${nextLesson}`
                  : "Complete!"
              }
            />

          </div>

          <div
            style={{
              marginTop: "18px",
              height: "14px",
              background: "#e1e8e3",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >

            <div
              style={{
                height: "100%",
                width:
                  `${progressPercent}%`,
                background:
                  "#315c48",
                borderRadius:
                  "20px",
              }}
            />

          </div>

        </section>

        {/* FAITH TREE */}

        <section
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "22px",
            marginBottom: "18px",
            textAlign: "center",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.05)",
          }}
        >

          <h2
            style={{
              color: "#315c48",
              marginTop: 0,
            }}
          >
            🌳 Faith Tree
          </h2>

          <div
            style={{
              fontSize: "80px",
              margin: "8px",
            }}
          >
            {faithTree.emoji}
          </div>

          <h3
            style={{
              margin: "5px 0",
              color: "#315c48",
            }}
          >
            {faithTree.title}
          </h3>

          <p
            style={{
              color: "#68766f",
              marginBottom: 0,
            }}
          >
            {faithTree.message}
          </p>

        </section>

        {/* BADGES */}

        <section
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "22px",
            marginBottom: "18px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.05)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#315c48",
            }}
          >
            🏆 Badges
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: "10px",
            }}
          >

            {badges.map((badge) => {

              const earned =
                completedCount >=
                badge[2];

              return (
                <div
                  key={badge[1]}
                  style={{
                    padding: "15px",
                    borderRadius: "12px",
                    border:
                      earned
                        ? "2px solid #315c48"
                        : "1px solid #d7dfda",
                    background:
                      earned
                        ? "#eef6f0"
                        : "#fafafa",
                    textAlign: "center",
                    opacity:
                      earned ? 1 : 0.6,
                  }}
                >

                  <div
                    style={{
                      fontSize: "30px",
                    }}
                  >
                    {badge[0]}
                  </div>

                  <strong>
                    {badge[1]}
                  </strong>

                  <div
                    style={{
                      fontSize: "12px",
                      marginTop: "4px",
                      color: "#6e7a73",
                    }}
                  >
                    {badge[2]} lessons
                  </div>

                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color:
                        earned
                          ? "#315c48"
                          : "#888",
                    }}
                  >
                    {earned
                      ? "✓ EARNED"
                      : "NOT YET"}
                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* PARENT TOOLS */}

        <section
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "22px",
            marginBottom: "18px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.05)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#315c48",
            }}
          >
            🛠️ Parent Tools
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "10px",
            }}
          >

            <ParentButton
              onClick={previewLessons}
              text="👀 Preview Student Lessons"
            />

            <ParentButton
              onClick={openNextLesson}
              text={
                nextLesson
                  ? `📚 Open Day ${nextLesson}`
                  : "🎉 Course Complete"
              }
            />

            <ParentButton
              onClick={printReport}
              text="🖨️ Print Parent Progress Report"
              primary
            />

            <ParentButton
              onClick={() =>
                (window.location.href = "/")
              }
              text="🏠 Back to Student Home"
            />

          </div>

        </section>

        {/* MIDTERM */}

        <section
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "22px",
            marginBottom: "18px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.05)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#315c48",
            }}
          >
            📖 Midterm
          </h2>

          <p
            style={{
              color: "#69766f",
            }}
          >
            Preview the complete Midterm
            Review and Exam materials.
            Parent preview access is
            available from Day 1.
          </p>

          {midtermScore !== null && (
            <div
              style={{
                background:
                  midtermPassed
                    ? "#e8f4eb"
                    : "#fff0ed",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "12px",
              }}
            >

              <strong>
                Midterm Score:
                {" "}
                {midtermScore}%
              </strong>

              <div
                style={{
                  marginTop: "4px",
                }}
              >
                {midtermPassed
                  ? "🎉 PASSED"
                  : "📖 NOT PASSED"}
              </div>

            </div>
          )}

          <ParentButton
            onClick={openMidterm}
            text="👀 Preview Midterm — Days 88–90"
          />

        </section>

        {/* FINAL */}

        <section
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "22px",
            marginBottom: "18px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.05)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#315c48",
            }}
          >
            🏆 Final
          </h2>

          <p
            style={{
              color: "#69766f",
            }}
          >
            Preview the complete Final
            Review and Exam materials.
            Parent preview access is
            available from Day 1.
          </p>

          {finalScore !== null && (
            <div
              style={{
                background:
                  finalPassed
                    ? "#e8f4eb"
                    : "#fff0ed",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "12px",
              }}
            >

              <strong>
                Final Score:
                {" "}
                {finalScore}%
              </strong>

              <div
                style={{
                  marginTop: "4px",
                }}
              >
                {finalPassed
                  ? "🎉 PASSED"
                  : "📖 NOT PASSED"}
              </div>

            </div>
          )}

          <ParentButton
            onClick={openFinal}
            text="👀 Preview Final — Days 177–180"
          />

        </section>

        {/* NOTES */}

        <section
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "22px",
            marginBottom: "18px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.05)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#315c48",
            }}
          >
            📝 Parent / Teacher Notes
          </h2>

          <p
            style={{
              color: "#69766f",
              fontSize: "14px",
            }}
          >
            These notes automatically save
            as you type.
          </p>

          <textarea
            value={notes}
            onChange={(e) =>
              saveNotes(e.target.value)
            }
            placeholder="Enter observations, accomplishments, areas to work on, or anything you'd like to remember..."
            style={{
              width: "100%",
              minHeight: "160px",
              padding: "14px",
              border:
                "1px solid #ccd7d0",
              borderRadius: "10px",
              resize: "vertical",
              fontFamily:
                "Arial, Helvetica, sans-serif",
              fontSize: "15px",
              lineHeight: 1.5,
            }}
          />

        </section>

        {/* COMPLETION */}

        {completedCount >=
          TOTAL_LESSONS && (
          <section
            style={{
              background:
                "linear-gradient(135deg,#315c48,#46785d)",
              color: "white",
              borderRadius: "18px",
              padding: "30px",
              textAlign: "center",
              marginBottom: "18px",
            }}
          >

            <div
              style={{
                fontSize: "55px",
              }}
            >
              🏆🌳
            </div>

            <h2
              style={{
                margin:
                  "8px 0",
              }}
            >
              Faith Foundations
              Complete!
            </h2>

            <p
              style={{
                marginBottom: 0,
                opacity: 0.95,
              }}
            >
              All 180 Bible lessons have
              been completed. Your Faith
              Tree is fully grown!
            </p>

          </section>
        )}

      </div>

    </main>
  );
}

/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({
  label,
  value,
}) {
  return (
    <div
      style={{
        background: "#f3f7f4",
        borderRadius: "12px",
        padding: "16px",
        textAlign: "center",
      }}
    >

      <div
        style={{
          color: "#315c48",
          fontSize: "22px",
          fontWeight: 800,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#748078",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          marginTop: "4px",
        }}
      >
        {label}
      </div>

    </div>
  );
}

/* =========================================================
   PARENT BUTTON
========================================================= */

function ParentButton({
  onClick,
  text,
  primary = false,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "13px 15px",
        borderRadius: "10px",
        border:
          primary
            ? "1px solid #315c48"
            : "1px solid #cbd7d0",
        background:
          primary
            ? "#315c48"
            : "#f7f9f7",
        color:
          primary
            ? "white"
            : "#315c48",
        fontSize: "14px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
}

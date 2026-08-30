"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "faithTreeCompleted";
const MIDTERM_SCORE_KEY = "faithMidtermScore";
const MIDTERM_MODE_KEY = "faithMidtermMode";
const MIDTERM_PARENT_SCORE_KEY = "faithMidtermParentScore";

/* =========================
   MIDTERM QUESTIONS
========================= */

const questions = [
  {
    question: "Who created the world?",
    answers: ["Noah", "God", "Moses", "David"],
    correct: "God",
  },
  {
    question: "What did Noah build?",
    answers: ["A temple", "A tower", "An ark", "A palace"],
    correct: "An ark",
  },
  {
    question:
      "Who trusted God and followed Him to a new land?",
    answers: ["Abraham", "Jonah", "Samuel", "Solomon"],
    correct: "Abraham",
  },
  {
    question:
      "Who was known for forgiving his brothers?",
    answers: ["Joseph", "Joshua", "Daniel", "Elijah"],
    correct: "Joseph",
  },
  {
    question:
      "Who was called to lead God's people out of Egypt?",
    answers: ["David", "Moses", "Peter", "Paul"],
    correct: "Moses",
  },
  {
    question: "What did God tell Joshua to be?",
    answers: [
      "Rich",
      "Famous",
      "Strong and courageous",
      "Angry",
    ],
    correct: "Strong and courageous",
  },
  {
    question: "Who defeated Goliath?",
    answers: ["David", "Saul", "Samuel", "Joshua"],
    correct: "David",
  },
  {
    question:
      "Who was thrown into the lions' den?",
    answers: ["Daniel", "Joseph", "Moses", "Peter"],
    correct: "Daniel",
  },
  {
    question:
      "What did Jesus teach us to do for our neighbors?",
    answers: [
      "Ignore them",
      "Love them",
      "Avoid them",
      "Judge them",
    ],
    correct: "Love them",
  },
  {
    question:
      "What is one important thing prayer does?",
    answers: [
      "Keeps us close to God",
      "Makes us famous",
      "Makes us perfect",
      "Makes us rich",
    ],
    correct: "Keeps us close to God",
  },
];

/* =========================
   STUDY GUIDE
========================= */

const studyGuide1 = [
  "Creation — God created the world.",
  "Noah — Noah obeyed God and built the ark.",
  "Abraham — Abraham trusted God and followed Him.",
  "Joseph — Joseph forgave his brothers.",
  "Moses — God called Moses to lead His people out of Egypt.",
];

const studyGuide2 = [
  "Joshua — God told Joshua to be strong and courageous.",
  "David — David trusted God and defeated Goliath.",
  "Daniel — Daniel trusted God in the lions' den.",
  "Jesus — Jesus taught us to love our neighbors.",
  "Prayer — Prayer helps keep us close to God.",
];

/* =========================
   MAIN COMPONENT
========================= */

export default function Midterm() {
  const [completed, setCompleted] = useState([]);

  const [view, setView] = useState("student");

  const [answers, setAnswers] = useState({});

  const [score, setScore] = useState(null);

  const [mode, setMode] = useState("system");

  const [parentScore, setParentScore] = useState("");

  const [parentScoreSaved, setParentScoreSaved] =
    useState(false);

  useEffect(() => {
    loadProgress();

    const savedScore =
      localStorage.getItem(MIDTERM_SCORE_KEY);

    if (savedScore !== null) {
      setScore(Number(savedScore));
    }

    const savedMode =
      localStorage.getItem(MIDTERM_MODE_KEY);

    if (savedMode) {
      setMode(savedMode);
    }

    const savedParentScore =
      localStorage.getItem(
        MIDTERM_PARENT_SCORE_KEY
      );

    if (savedParentScore) {
      setParentScore(savedParentScore);
    }
  }, []);

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
                day <= 180
            )
        ),
      ].sort((a, b) => a - b);

      setCompleted(clean);
    } catch {
      setCompleted([]);
    }
  }

  const day88Complete = completed.includes(88);
  const day89Complete = completed.includes(89);

  const examUnlocked =
    day88Complete && day89Complete;

  /* =========================
     SYSTEM EXAM
  ========================= */

  function calculateScore() {
    let total = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        total++;
      }
    });

    const finalScore = Math.round(
      (total / questions.length) * 100
    );

    setScore(finalScore);

    localStorage.setItem(
      MIDTERM_SCORE_KEY,
      String(finalScore)
    );
  }

  function resetExam() {
    setAnswers({});
    setScore(null);

    localStorage.removeItem(
      MIDTERM_SCORE_KEY
    );
  }

  /* =========================
     EXAM MODE
  ========================= */

  function changeMode(newMode) {
    setMode(newMode);

    localStorage.setItem(
      MIDTERM_MODE_KEY,
      newMode
    );

    setScore(null);
    setAnswers({});
  }

  /* =========================
     PARENT SCORE
  ========================= */

  function saveParentScore() {
    const numericScore =
      Number(parentScore);

    if (
      Number.isNaN(numericScore) ||
      numericScore < 0 ||
      numericScore > 100
    ) {
      alert(
        "Please enter a score between 0 and 100."
      );
      return;
    }

    localStorage.setItem(
      MIDTERM_PARENT_SCORE_KEY,
      String(numericScore)
    );

    setParentScoreSaved(true);
  }

  /* =========================
     PRINT EXAM
  ========================= */

  function printParentExam() {
    const examWindow = window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );

    if (!examWindow) {
      alert(
        "Please allow pop-ups so the printable exam can open."
      );
      return;
    }

    examWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>

        <title>
          Faith Foundations Midterm Exam
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

          .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 25px 0;
          }

          .line {
            border-bottom: 1px solid #333;
            padding-bottom: 8px;
          }

          .question {
            margin-top: 25px;
            page-break-inside: avoid;
          }

          .answer {
            margin: 10px 0 10px 20px;
          }

          .score {
            margin-top: 40px;
            border: 1px solid #333;
            padding: 20px;
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
            Midterm Exam
          </h2>

          <div class="student-info">

            <div class="line">
              Student:
            </div>

            <div class="line">
              Date:
            </div>

          </div>

          <p>
            <strong>
              Parent-Led Exam
            </strong>
          </p>

          <p>
            Circle the best answer for each question.
          </p>

          ${questions
            .map(
              (q, index) => `
                <div class="question">

                  <strong>
                    ${index + 1}. ${q.question}
                  </strong>

                  ${q.answers
                    .map(
                      (answer, letterIndex) => `
                        <div class="answer">
                          ${
                            String.fromCharCode(
                              65 + letterIndex
                            )
                          }.
                          ${answer}
                        </div>
                      `
                    )
                    .join("")}

                </div>
              `
            )
            .join("")}

          <div class="score">

            <strong>
              Parent/Teacher Score:
            </strong>

            __________________ %

            <br><br>

            <strong>
              Passed?
            </strong>

            ☐ Yes &nbsp;&nbsp;&nbsp;
            ☐ No

            <br><br>

            Parent/Teacher Signature:

            ______________________________

          </div>

          <p class="center">
            Passing score: <strong>80% or higher</strong>
          </p>

        </div>

      </body>
      </html>
    `);

    examWindow.document.close();

    setTimeout(() => {
      examWindow.focus();
      examWindow.print();
    }, 500);
  }

  /* =========================
     PRINT STUDY GUIDE
  ========================= */

  function printStudyGuide(title, items) {
    const guideWindow = window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );

    if (!guideWindow) {
      alert(
        "Please allow pop-ups so the study guide can open."
      );
      return;
    }

    guideWindow.document.write(`
      <!DOCTYPE html>
      <html>

      <head>

        <title>
          ${title}
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

          li {
            margin-bottom: 18px;
            font-size: 18px;
            line-height: 1.5;
          }

          .notes {
            margin-top: 30px;
            border: 1px solid #aaa;
            min-height: 180px;
            padding: 15px;
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

          <h2>
            ${title}
          </h2>

          <p>
            Review these Bible stories and ideas
            before the Midterm Exam.
          </p>

          <ul>

            ${items
              .map(
                (item) =>
                  `<li>${item}</li>`
              )
              .join("")}

          </ul>

          <h2>
            📝 My Study Notes
          </h2>

          <div class="notes"></div>

          <p>
            <strong>
              Remember:
            </strong>
            The goal is to learn God's Word,
            not just memorize answers!
          </p>

        </div>

      </body>

      </html>
    `);

    guideWindow.document.close();

    setTimeout(() => {
      guideWindow.focus();
      guideWindow.print();
    }, 500);
  }

  /* =========================
     LOCK SCREEN
  ========================= */

  if (!examUnlocked) {
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
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >

          <header
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >

            <div
              style={{
                fontSize: "60px",
              }}
            >
              📚🌳
            </div>

            <h1
              style={{
                color: "#315c48",
              }}
            >
              Midterm Preparation
            </h1>

            <p>
              Faith Foundations:
              The M&M Adventure
            </p>

          </header>

          <section
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,.1)",
            }}
          >

            <h2>
              📖 Get Ready for Your Midterm!
            </h2>

            <p>
              Your Midterm Exam comes after
              two study days.
            </p>

            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                borderRadius: "15px",
                background: day88Complete
                  ? "#e9f4ed"
                  : "#f7f1df",
              }}
            >

              <strong>
                Day 88 — Study Guide #1
              </strong>

              <p>
                {day88Complete
                  ? "✅ Completed"
                  : "🔒 Complete Day 88 first"}
              </p>

            </div>

            <div
              style={{
                marginTop: "15px",
                padding: "20px",
                borderRadius: "15px",
                background: day89Complete
                  ? "#e9f4ed"
                  : "#f7f1df",
              }}
            >

              <strong>
                Day 89 — Study Guide #2
              </strong>

              <p>
                {day89Complete
                  ? "✅ Completed"
                  : "🔒 Complete Day 89 first"}
              </p>

            </div>

            <div
              style={{
                marginTop: "15px",
                padding: "20px",
                borderRadius: "15px",
                background: "#f1f1f1",
              }}
            >

              <strong>
                Day 90 — Midterm Exam
              </strong>

              <p>
                🔒 Complete Days 88 and 89
                before taking the exam.
              </p>

            </div>

          </section>

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
                padding: "13px 22px",
                border: "none",
                borderRadius: "12px",
                background: "#315c48",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ← Back to Home
            </button>

          </div>

        </div>

      </main>
    );
  }

  /* =========================
     MAIN PAGE
  ========================= */

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
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >

        <header
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >

          <div
            style={{
              fontSize: "60px",
            }}
          >
            📚🌳
          </div>

          <h1
            style={{
              color: "#315c48",
            }}
          >
            Midterm Bible Review & Exam
          </h1>

          <p>
            Faith Foundations:
            The M&M Adventure
          </p>

        </header>

        {/* STUDY GUIDES */}

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
            📖 Midterm Study Guides
          </h2>

          <h3>
            Day 88 — Study Guide #1
          </h3>

          <ul>
            {studyGuide1.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() =>
              printStudyGuide(
                "Midterm Study Guide #1 — Day 88",
                studyGuide1
              )
            }
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "#315c48",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🖨️ Print Study Guide #1
          </button>

          <hr
            style={{
              margin: "30px 0",
              border: "none",
              borderTop: "1px solid #ddd",
            }}
          />

          <h3>
            Day 89 — Study Guide #2
          </h3>

          <ul>
            {studyGuide2.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() =>
              printStudyGuide(
                "Midterm Study Guide #2 — Day 89",
                studyGuide2
              )
            }
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "#315c48",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🖨️ Print Study Guide #2
          </button>

        </section>

        {/* EXAM MODE */}

        <section
          style={{
            background: "#fff4df",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
          }}
        >

          <h2>
            📝 Day 90 — Midterm Exam
          </h2>

          <p>
            Choose how the exam will be given:
          </p>

          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "15px",
            }}
          >

            <button
              onClick={() =>
                changeMode("system")
              }
              style={{
                padding: "16px",
                borderRadius: "14px",
                border:
                  mode === "system"
                    ? "3px solid #315c48"
                    : "1px solid #ccc",
                background:
                  mode === "system"
                    ? "#e9f4ed"
                    : "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              💻 System-Led Exam
            </button>

            <button
              onClick={() =>
                changeMode("parent")
              }
              style={{
                padding: "16px",
                borderRadius: "14px",
                border:
                  mode === "parent"
                    ? "3px solid #315c48"
                    : "1px solid #ccc",
                background:
                  mode === "parent"
                    ? "#e9f4ed"
                    : "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              👩‍🏫 Parent-Led Exam
            </button>

          </div>

          <p
            style={{
              marginTop: "18px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            ✅ Passing score: 80% or higher
          </p>

        </section>

        {/* PARENT EXAM */}

        {mode === "parent" && (
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
              👩‍🏫 Parent-Led Midterm
            </h2>

            <p>
              Print the blank exam and give it
              to the student.
            </p>

            <button
              onClick={printParentExam}
              style={{
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "14px",
                background: "#315c48",
                color: "white",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🖨️ Print Blank Midterm Exam
            </button>

            <h3
              style={{
                marginTop: "30px",
              }}
            >
              Enter Student's Score
            </h3>

            <input
              type="number"
              min="0"
              max="100"
              value={parentScore}
              onChange={(e) =>
                setParentScore(e.target.value)
              }
              placeholder="Enter score %"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px",
                borderRadius: "12px",
                border: "2px solid #ccc",
                fontSize: "18px",
              }}
            />

            <button
              onClick={saveParentScore}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "15px",
                border: "none",
                borderRadius: "12px",
                background: "#6b9e5b",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              💾 Save Score
            </button>

            {parentScoreSaved && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  borderRadius: "15px",
                  background:
                    Number(parentScore) >= 80
                      ? "#e9f4ed"
                      : "#fff0ed",
                  textAlign: "center",
                }}
              >

                <div
                  style={{
                    fontSize: "45px",
                  }}
                >
                  {Number(parentScore) >= 80
                    ? "🎉🏆"
                    : "📖💪"}
                </div>

                <h2>
                  {Number(parentScore) >= 80
                    ? "Midterm Passed!"
                    : "Keep Studying"}
                </h2>

                <p>
                  Score:{" "}
                  <strong>
                    {parentScore}%
                  </strong>
                </p>

                <p>
                  {Number(parentScore) >= 80
                    ? "Great job! You passed the Midterm!"
                    : "Review your study guides and try again."}
                </p>

              </div>
            )}

          </section>
        )}

        {/* SYSTEM EXAM */}

        {mode === "system" && (
          <ExamContent
            answers={answers}
            setAnswers={setAnswers}
            score={score}
            calculateScore={calculateScore}
            resetExam={resetExam}
          />
        )}

        {/* VIEW SWITCH */}

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >

          <button
            onClick={() =>
              setView(
                view === "student"
                  ? "parent"
                  : "student"
              )
            }
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "none",
              background: "#777",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {view === "student"
              ? "👩‍🏫 Parent Preview"
              : "👧 Student View"}
          </button>

        </div>

      </div>

    </main>
  );
}

/* =========================
   SYSTEM EXAM CONTENT
========================= */

function ExamContent({
  answers,
  setAnswers,
  score,
  calculateScore,
  resetExam,
}) {
  return (
    <section
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "25px",
        boxShadow:
          "0 4px 15px rgba(0,0,0,.1)",
      }}
    >

      <h2>
        💻 System-Led Midterm Exam
      </h2>

      <p>
        Answer all 10 questions and then
        submit your exam.
      </p>

      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            marginTop: "25px",
            paddingBottom: "20px",
            borderBottom:
              "1px solid #ddd",
          }}
        >

          <h3>
            {index + 1}. {q.question}
          </h3>

          {q.answers.map((answer) => (
            <label
              key={answer}
              style={{
                display: "block",
                padding: "10px",
                marginTop: "8px",
                borderRadius: "10px",
                background:
                  answers[index] === answer
                    ? "#e3f1e7"
                    : "#f7f7f7",
                cursor: "pointer",
              }}
            >

              <input
                type="radio"
                name={`question-${index}`}
                checked={
                  answers[index] === answer
                }
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [index]: answer,
                  })
                }
              />

              {" "}

              {answer}

            </label>
          ))}

        </div>
      ))}

      <button
        onClick={calculateScore}
        style={{
          width: "100%",
          marginTop: "30px",
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
        📝 Submit Midterm Exam
      </button>

      {score !== null && (
        <div
          style={{
            marginTop: "25px",
            padding: "25px",
            borderRadius: "15px",
            background:
              score >= 80
                ? "#e9f4ed"
                : "#fff0ed",
            textAlign: "center",
          }}
        >

          <div
            style={{
              fontSize: "50px",
            }}
          >
            {score >= 80
              ? "🎉🏆"
              : "📖💪"}
          </div>

          <h2>
            Your Score: {score}%
          </h2>

          <h2>
            {score >= 80
              ? "🎉 You Passed!"
              : "📖 Keep Studying"}
          </h2>

          <p>
            {score >= 80
              ? "Great job! You passed the Midterm Exam!"
              : "You need 80% or higher to pass. Review your study guides and try again."}
          </p>

          <button
            onClick={resetExam}
            style={{
              marginTop: "10px",
              padding: "12px 20px",
              borderRadius: "10px",
              border: "none",
              background: "#777",
              color: "white",
              cursor: "pointer",
            }}
          >
            🔄 Retake Exam
          </button>

        </div>
      )}

    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "faithTreeCompleted";

const MIDTERM_ATTEMPTS_KEY = "faithMidtermAttempts";
const MIDTERM_PASS_KEY = "faithMidtermPassed";
const MIDTERM_PASS_SCORE_KEY = "faithMidtermPassingScore";
const MIDTERM_MODE_KEY = "faithMidtermMode";

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

const studyGuide = [
  "Creation — God created the world.",
  "Noah — Noah obeyed God and built the ark.",
  "Abraham — Abraham trusted God and followed Him.",
  "Joseph — Joseph forgave his brothers.",
  "Moses — God called Moses to lead His people out of Egypt.",
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

  const [answers, setAnswers] = useState({});

  const [score, setScore] = useState(null);

  const [mode, setMode] = useState("system");

  const [attempts, setAttempts] = useState([]);

  const [parentScore, setParentScore] = useState("");

  const [parentMissed, setParentMissed] = useState("");

  const [parentSaved, setParentSaved] = useState(false);

  const [passed, setPassed] = useState(false);

  useEffect(() => {
    loadProgress();

    const savedAttempts =
      localStorage.getItem(MIDTERM_ATTEMPTS_KEY);

    if (savedAttempts) {
      try {
        const parsed = JSON.parse(savedAttempts);

        if (Array.isArray(parsed)) {
          setAttempts(parsed);
        }
      } catch {
        setAttempts([]);
      }
    }

    const savedPassed =
      localStorage.getItem(MIDTERM_PASS_KEY);

    setPassed(savedPassed === "true");

    const savedMode =
      localStorage.getItem(MIDTERM_MODE_KEY);

    if (savedMode) {
      setMode(savedMode);
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

  /*
    Day 89 is the actual Midterm Exam.
    It becomes complete only after the student passes.
  */

  function markDay89Complete() {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      let current = [];

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          current = parsed;
        }
      }

      if (!current.includes(89)) {
        current.push(89);
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(current)
      );

      window.dispatchEvent(
        new Event("faithTreeProgressUpdated")
      );

      setCompleted(
        [...new Set(current)].sort(
          (a, b) => a - b
        )
      );
    } catch {}
  }

  function saveAttempt(attempt) {
    const savedAttempts = [
      ...attempts,
      attempt,
    ];

    setAttempts(savedAttempts);

    localStorage.setItem(
      MIDTERM_ATTEMPTS_KEY,
      JSON.stringify(savedAttempts)
    );

    return savedAttempts;
  }

  /* =========================
     SYSTEM EXAM
  ========================= */

  function calculateScore() {
    if (
      Object.keys(answers).length <
      questions.length
    ) {
      alert(
        "Please answer all 10 questions before submitting."
      );
      return;
    }

    let total = 0;

    const incorrect = [];

    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        total++;
      } else {
        incorrect.push({
          number: index + 1,
          question: q.question,
          selectedAnswer:
            answers[index] || "No answer",
          correctAnswer: q.correct,
        });
      }
    });

    const finalScore = Math.round(
      (total / questions.length) * 100
    );

    const didPass = finalScore >= 80;

    const attempt = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      mode: "System-Led",
      score: finalScore,
      passed: didPass,
      incorrect,
    };

    saveAttempt(attempt);

    setScore(finalScore);

    if (didPass) {
      setPassed(true);

      localStorage.setItem(
        MIDTERM_PASS_KEY,
        "true"
      );

      localStorage.setItem(
        MIDTERM_PASS_SCORE_KEY,
        String(finalScore)
      );

      markDay89Complete();
    }
  }

  function resetExam() {
    setAnswers({});
    setScore(null);
  }

  function changeMode(newMode) {
    setMode(newMode);

    localStorage.setItem(
      MIDTERM_MODE_KEY,
      newMode
    );

    setAnswers({});
    setScore(null);
    setParentSaved(false);
  }

  /* =========================
     PARENT-LED EXAM
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

    const missedNumbers =
      parentMissed
        .split(",")
        .map((item) => Number(item.trim()))
        .filter(
          (number) =>
            Number.isInteger(number) &&
            number >= 1 &&
            number <= questions.length
        );

    const incorrect =
      missedNumbers.map((number) => {
        const q = questions[number - 1];

        return {
          number,
          question: q.question,
          selectedAnswer:
            "Parent-Led Exam",
          correctAnswer: q.correct,
        };
      });

    const didPass =
      numericScore >= 80;

    const attempt = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      mode: "Parent-Led",
      score: numericScore,
      passed: didPass,
      incorrect,
    };

    saveAttempt(attempt);

    setParentSaved(true);

    if (didPass) {
      setPassed(true);

      localStorage.setItem(
        MIDTERM_PASS_KEY,
        "true"
      );

      localStorage.setItem(
        MIDTERM_PASS_SCORE_KEY,
        String(numericScore)
      );

      markDay89Complete();
    }
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
        <title>Faith Foundations Midterm Exam</title>

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
            Day 89 — Midterm Exam
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
            <strong>Parent-Led Exam</strong>
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
                          ${String.fromCharCode(
                            65 + letterIndex
                          )}.
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
            <strong>Parent/Teacher Score:</strong>
            __________________ %

            <br><br>

            <strong>Questions Missed:</strong>
            ______________________________

            <br><br>

            <strong>Passed?</strong>
            ☐ Yes &nbsp;&nbsp;&nbsp;
            ☐ No

            <br><br>

            Parent/Teacher Signature:
            ______________________________
          </div>

          <p class="center">
            Passing score:
            <strong>80% or higher</strong>
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

  function printStudyGuide() {
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
          Midterm Study Guide — Day 88
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
            📚 Day 88 — Midterm Study Day
          </h2>

          <p>
            Review Days 1–87 with your parent.
          </p>

          <ul>
            ${studyGuide
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

  if (!day88Complete) {
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
          <section
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              textAlign: "center",
              boxShadow:
                "0 4px 15px rgba(0,0,0,.1)",
            }}
          >
            <div style={{ fontSize: "65px" }}>
              🔒📚
            </div>

            <h1
              style={{
                color: "#315c48",
              }}
            >
              Midterm Exam Locked
            </h1>

            <p>
              Complete <strong>Day 88 —
              Midterm Study Day</strong> first.
            </p>

            <p>
              Review Days 1–87 and then return here
              to take your Midterm Exam.
            </p>

            <button
              onClick={() =>
                (window.location.href = "/")
              }
              style={{
                marginTop: "20px",
                padding: "14px 22px",
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
          </section>
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
          <div style={{ fontSize: "60px" }}>
            📚🌳
          </div>

          <h1
            style={{
              color: "#315c48",
            }}
          >
            Midterm Review & Exam
          </h1>

          <p>
            Faith Foundations:
            The M&M Adventure
          </p>
        </header>

        {/* DAY 88 STUDY */}

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
            📚 Day 88 — Midterm Study Day
          </h2>

          <p>
            Review Days 1–87 with your parent.
          </p>

          <ul>
            {studyGuide.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={printStudyGuide}
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
            🖨️ Print Midterm Study Guide
          </button>
        </section>

        {/* PASSED NOTICE */}

        {passed && (
          <section
            style={{
              background: "#e9f4ed",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "55px" }}>
              🎉🏆
            </div>

            <h2>
              Midterm Passed!
            </h2>

            <p>
              Passing score:{" "}
              <strong>80% or higher</strong>
            </p>

            <p>
              Your passing score has been saved.
            </p>
          </section>
        )}

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
            📝 Day 89 — Midterm Exam
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
              Print the exam and give it to the
              student.
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

            <h3>
              Questions Missed
            </h3>

            <input
              type="text"
              value={parentMissed}
              onChange={(e) =>
                setParentMissed(e.target.value)
              }
              placeholder="Example: 2, 5, 7"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px",
                borderRadius: "12px",
                border: "2px solid #ccc",
                fontSize: "18px",
              }}
            />

            <p
              style={{
                fontSize: "14px",
                color: "#666",
              }}
            >
              Enter the question numbers the
              student missed, separated by commas.
            </p>

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
              💾 Save Exam Attempt
            </button>

            {parentSaved && (
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
                <div style={{ fontSize: "45px" }}>
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
                    ? "Great job! You passed the Midterm Exam!"
                    : "Review your lessons and try again."}
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

        {/* ATTEMPT HISTORY */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginTop: "20px",
          }}
        >
          <h2>
            📊 My Midterm Attempts
          </h2>

          {attempts.length === 0 ? (
            <p>
              No Midterm attempts yet.
            </p>
          ) : (
            attempts.map((attempt, index) => (
              <div
                key={attempt.id}
                style={{
                  padding: "15px",
                  marginTop: "12px",
                  borderRadius: "12px",
                  background:
                    attempt.passed
                      ? "#e9f4ed"
                      : "#fff0ed",
                }}
              >
                <strong>
                  Attempt {index + 1}
                </strong>

                <p>
                  Score:{" "}
                  <strong>
                    {attempt.score}%
                  </strong>
                </p>

                <p>
                  {attempt.passed
                    ? "🎉 Passed"
                    : "📖 Did not pass"}
                </p>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  {attempt.mode} • {attempt.date}
                </p>

                {attempt.incorrect?.length > 0 && (
                  <div>
                    <strong>
                      Questions missed:
                    </strong>

                    <ul>
                      {attempt.incorrect.map(
                        (item) => (
                          <li key={item.number}>
                            #{item.number} —{" "}
                            {item.question}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {attempt.incorrect?.length ===
                  0 && (
                  <p>
                    ✅ No questions missed.
                  </p>
                )}
              </div>
            ))
          )}
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
              />{" "}
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
          <div style={{ fontSize: "50px" }}>
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

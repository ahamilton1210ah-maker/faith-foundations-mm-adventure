"use client";

import { useEffect, useState } from "react";

/* =========================
   STORAGE
========================= */

const STORAGE_KEY = "faithTreeCompleted";

const FINAL_SCORE_KEY = "faithFinalScore";
const FINAL_PASS_KEY = "faithFinalPassed";
const FINAL_MODE_KEY = "faithFinalMode";
const FINAL_ATTEMPTS_KEY = "faithFinalAttempts";

/* =========================
   COURSE FINAL DAYS
========================= */

const FINAL_REVIEW_DAY_1 = 177;
const FINAL_REVIEW_DAY_2 = 178;
const FINAL_EXAM_DAY = 179;
const CELEBRATION_DAY = 180;

const PASSING_SCORE = 80;

/* =========================
   FINAL EXAM QUESTIONS
========================= */

const questions = [
  {
    question: "Who is the Creator of everything?",
    answers: ["Moses", "God", "David", "Paul"],
    correct: "God",
  },
  {
    question: "What did Jesus teach us to do for others?",
    answers: [
      "Ignore them",
      "Love them",
      "Judge them",
      "Avoid them",
    ],
    correct: "Love them",
  },
  {
    question: "Who built the ark?",
    answers: [
      "Abraham",
      "Noah",
      "Moses",
      "Joshua",
    ],
    correct: "Noah",
  },
  {
    question: "Who defeated Goliath?",
    answers: [
      "David",
      "Samuel",
      "Saul",
      "Solomon",
    ],
    correct: "David",
  },
  {
    question:
      "Who was known for praying even when it was dangerous?",
    answers: [
      "Daniel",
      "Joseph",
      "Jonah",
      "Peter",
    ],
    correct: "Daniel",
  },
  {
    question: "What is one fruit of the Spirit?",
    answers: [
      "Anger",
      "Jealousy",
      "Love",
      "Pride",
    ],
    correct: "Love",
  },
  {
    question:
      "What does the Bible tell us to do with God's Word?",
    answers: [
      "Forget it",
      "Hide it in our hearts",
      "Ignore it",
      "Only read it once",
    ],
    correct: "Hide it in our hearts",
  },
  {
    question:
      "What happened after Jesus died?",
    answers: [
      "He stayed dead",
      "He moved away",
      "He rose again",
      "He became a king on earth",
    ],
    correct: "He rose again",
  },
  {
    question: "What does prayer help us do?",
    answers: [
      "Grow closer to God",
      "Become famous",
      "Become rich",
      "Never have problems",
    ],
    correct: "Grow closer to God",
  },
  {
    question:
      "What should we do when we finish this Bible adventure?",
    answers: [
      "Stop learning",
      "Keep growing in faith",
      "Forget what we learned",
      "Never read the Bible again",
    ],
    correct: "Keep growing in faith",
  },
];

/* =========================
   FINAL STUDY GUIDE #1
   DAY 177
========================= */

const finalStudyGuide1 = [
  "Review the Bible lessons you learned throughout the first part of the course.",
  "Remember that God is the Creator of everything.",
  "Review Bible stories about people who trusted and obeyed God.",
  "Review Noah and how he obeyed God by building the ark.",
  "Review Abraham and his faith in following God's direction.",
  "Review Joseph and how he forgave his brothers.",
  "Review Moses and how God used him to lead His people.",
  "Review Joshua and God's command to be strong and courageous.",
  "Review David and how he trusted God when facing Goliath.",
  "Review Daniel and how he continued praying even when it was dangerous.",
];

/* =========================
   FINAL STUDY GUIDE #2
   DAY 178
========================= */

const finalStudyGuide2 = [
  "Review what Jesus taught about loving others.",
  "Review the importance of prayer and growing closer to God.",
  "Review the fruit of the Spirit and how Christians should live.",
  "Review why God's Word should be treasured and remembered.",
  "Review the death and resurrection of Jesus.",
  "Review ways God has helped you grow throughout the course.",
  "Think about Bible verses and stories that were meaningful to you.",
  "Review what it means to trust God even when something is difficult.",
  "Remember that finishing the course is an accomplishment, but faith continues to grow.",
  "Prepare your heart to complete the Final Exam and continue growing in God's Word.",
];

/* =========================
   MAIN COMPONENT
========================= */

export default function Final() {
  const [isParent, setIsParent] = useState(false);

  const [finalUnlocked, setFinalUnlocked] = useState(false);

  const [answers, setAnswers] = useState({});

  const [score, setScore] = useState(null);

  const [passed, setPassed] = useState(false);

  const [mode, setMode] = useState("system");

  const [attempts, setAttempts] = useState([]);

  const [parentScore, setParentScore] = useState("");

  const [parentMissed, setParentMissed] = useState("");

  const [parentSaved, setParentSaved] = useState(false);

  const [completedDays, setCompletedDays] = useState([]);

  /* =========================
     LOAD EVERYTHING
  ========================= */

  useEffect(() => {
    loadProgress();

    const savedScore =
      localStorage.getItem(FINAL_SCORE_KEY);

    if (savedScore !== null) {
      const numericScore = Number(savedScore);

      if (!Number.isNaN(numericScore)) {
        setScore(numericScore);
      }
    }

    const savedPassed =
      localStorage.getItem(FINAL_PASS_KEY);

    setPassed(savedPassed === "true");

    const savedMode =
      localStorage.getItem(FINAL_MODE_KEY);

    if (
      savedMode === "system" ||
      savedMode === "parent"
    ) {
      setMode(savedMode);
    }

    const savedAttempts =
      localStorage.getItem(FINAL_ATTEMPTS_KEY);

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
  }, []);

  /* =========================
     LOAD COURSE PROGRESS
  ========================= */

  function loadProgress() {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setCompletedDays([]);
        setFinalUnlocked(false);
        return;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        setCompletedDays([]);
        setFinalUnlocked(false);
        return;
      }

      const completed = [
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

      setCompletedDays(completed);

      /*
        DAY 179 FINAL EXAM UNLOCKS ONLY
        AFTER BOTH DAY 177 AND DAY 178
        ARE COMPLETE.
      */

      const day177Complete =
        completed.includes(FINAL_REVIEW_DAY_1);

      const day178Complete =
        completed.includes(FINAL_REVIEW_DAY_2);

      setFinalUnlocked(
        day177Complete && day178Complete
      );
    } catch {
      setCompletedDays([]);
      setFinalUnlocked(false);
    }
  }

  /* =========================
     CHECK COMPLETION
  ========================= */

  function isDayComplete(day) {
    return completedDays.includes(day);
  }

  /* =========================
     UPDATE COMPLETED DAYS
  ========================= */

  function addCompletedDay(day) {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      let current = [];

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            current = parsed;
          }
        } catch {
          current = [];
        }
      }

      const numericDays = [
        ...new Set(
          current
            .map(Number)
            .filter(
              (item) =>
                Number.isInteger(item) &&
                item >= 1 &&
                item <= 180
            )
        ),
      ];

      if (!numericDays.includes(day)) {
        numericDays.push(day);
      }

      numericDays.sort((a, b) => a - b);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(numericDays)
      );

      setCompletedDays(numericDays);

      /*
        Tell the rest of the app that
        course progress changed.
      */

      window.dispatchEvent(
        new Event("faithTreeProgressUpdated")
      );
    } catch {}
  }

  /* =========================
     MARK DAY 179 COMPLETE
     ONLY AFTER PASSING
========================= */

  function markDay179Complete() {
    addCompletedDay(FINAL_EXAM_DAY);
  }

  /* =========================
     SAVE ATTEMPT
========================= */

  function saveAttempt(attempt) {
    const updatedAttempts = [
      ...attempts,
      attempt,
    ];

    setAttempts(updatedAttempts);

    localStorage.setItem(
      FINAL_ATTEMPTS_KEY,
      JSON.stringify(updatedAttempts)
    );
  }

  /* =========================
     CHANGE EXAM MODE
========================= */

  function changeMode(newMode) {
    setMode(newMode);

    localStorage.setItem(
      FINAL_MODE_KEY,
      newMode
    );

    /*
      Changing exam mode starts the
      current exam screen over, but
      DOES NOT erase attempt history.
    */

    setAnswers({});
    setParentScore("");
    setParentMissed("");
    setParentSaved(false);
  }

  /* =========================
     SYSTEM-LED EXAM
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

    const didPass =
      finalScore >= PASSING_SCORE;

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

    localStorage.setItem(
      FINAL_SCORE_KEY,
      String(finalScore)
    );

    /*
      IMPORTANT:
      Passing = Day 179 complete.
      Failing = Day 179 stays incomplete.
    */

    if (didPass) {
      setPassed(true);

      localStorage.setItem(
        FINAL_PASS_KEY,
        "true"
      );

      markDay179Complete();
    } else {
      /*
        A failed attempt must NOT mark
        Day 179 complete.
      */

      setPassed(false);

      localStorage.setItem(
        FINAL_PASS_KEY,
        "false"
      );
    }
  }

  /* =========================
     RESET / RETAKE
========================= */

  function resetExam() {
    setAnswers({});
    setScore(null);
    setParentSaved(false);
    setParentScore("");
    setParentMissed("");

    /*
      Retaking the exam clears the current
      displayed score, but does NOT delete
      previous attempts.

      If Day 179 was already completed
      by a previous passing attempt, it
      remains completed.
    */

    localStorage.removeItem(
      FINAL_SCORE_KEY
    );
  }

  /* =========================
     PARENT-LED EXAM
========================= */

  function saveParentScore() {
    const numericScore =
      Number(parentScore);

    if (
      parentScore === "" ||
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
      numericScore >= PASSING_SCORE;

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

    setScore(numericScore);

    localStorage.setItem(
      FINAL_SCORE_KEY,
      String(numericScore)
    );

    /*
      Passing Parent-Led Exam = Day 179 complete.
    */

    if (didPass) {
      setPassed(true);

      localStorage.setItem(
        FINAL_PASS_KEY,
        "true"
      );

      markDay179Complete();
    } else {
      /*
        Failed Parent-Led Exam does NOT
        complete Day 179.
      */

      setPassed(false);

      localStorage.setItem(
        FINAL_PASS_KEY,
        "false"
      );
    }
  }

  /* =========================
     PRINT FINAL EXAM
========================= */

  function printFinalExam() {
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
          Faith Foundations Final Exam
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
            Day 179 — Final Exam
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
              Parent-Led Final Exam
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

            <strong>
              Parent/Teacher Score:
            </strong>

            __________________ %

            <br><br>

            <strong>
              Questions Missed:
            </strong>

            ______________________________

            <br><br>

            <strong>
              Passed?
            </strong>

            ☐ Yes
            &nbsp;&nbsp;&nbsp;
            ☐ No

            <br><br>

            Parent/Teacher Signature:

            ______________________________

          </div>

          <p class="center">

            Passing score:
            <strong>
              80% or higher
            </strong>

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
     PRINT STUDY GUIDE #1
========================= */

  function printStudyGuide1() {
    printStudyGuide(
      "Day 177 — Final Study Guide #1",
      "Review Lessons 91–134",
      finalStudyGuide1
    );
  }

  /* =========================
     PRINT STUDY GUIDE #2
========================= */

  function printStudyGuide2() {
    printStudyGuide(
      "Day 178 — Final Study Guide #2",
      "Review Lessons 135–176",
      finalStudyGuide2
    );
  }

  /* =========================
     GENERIC STUDY GUIDE PRINT
========================= */

  function printStudyGuide(
    title,
    subtitle,
    guide
  ) {
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
            min-height: 220px;
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
            📚 ${title}
          </h2>

          <h3>
            ${subtitle}
          </h3>

          <ul>

            ${guide
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
            not just memorize answers.

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
     STUDENT LOCK SCREEN
========================= */

  if (!isParent && !finalUnlocked) {
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
            <div style={{ fontSize: "65px" }}>
              🏆🌳📖
            </div>

            <h1
              style={{
                color: "#315c48",
              }}
            >
              Final Bible Review & Exam
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
              textAlign: "center",
              boxShadow:
                "0 4px 15px rgba(0,0,0,.1)",
            }}
          >
            <div
              style={{
                fontSize: "65px",
              }}
            >
              🔒🌳
            </div>

            <h2
              style={{
                color: "#315c48",
              }}
            >
              Final Exam Locked
            </h2>

            <p>
              You are almost finished!
            </p>

            <p>
              Complete:
            </p>

            <p
              style={{
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              📚 Day 177 — Final Study Guide #1
              <br />
              📚 Day 178 — Final Study Guide #2
            </p>

            <p>
              Then your Final Exam will unlock!
            </p>

            <div
              style={{
                marginTop: "25px",
                padding: "18px",
                background: "#e9f4ed",
                borderRadius: "15px",
              }}
            >
              <strong>
                🎯 Final Exam Passing Score:
                80% or higher
              </strong>
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

          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            <button
              onClick={() =>
                setIsParent(true)
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
              👩‍🏫 Parent Preview
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
              fontSize: "65px",
            }}
          >
            🏆🌳📖
          </div>

          <h1
            style={{
              color: "#315c48",
            }}
          >
            Final Bible Review & Exam
          </h1>

          <p>
            Faith Foundations:
            The M&M Adventure
          </p>
        </header>

        {/* =========================
            PARENT PREVIEW NOTICE
        ========================= */}

        {isParent && (
          <section
            style={{
              background: "#fff4df",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h2>
              👩‍🏫 Parent Preview
            </h2>

            <p>
              You can preview the Final Study
              Guides and Final Exam at any time.
            </p>

            <p>
              🔒 The student must complete
              <strong>
                {" "}
                Days 177 and 178{" "}
              </strong>
              before the Final Exam unlocks.
            </p>

            <p>
              🎯 Passing score:
              <strong>
                {" "}
                80% or higher
              </strong>
            </p>

            <p
              style={{
                marginBottom: 0,
              }}
            >
              📋 Final progression:
              <strong>
                {" "}
                Day 177 → Day 178 → Day 179 →
                Day 180
              </strong>
            </p>
          </section>
        )}

        {/* =========================
            PROGRESS STATUS
        ========================= */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <h2>
            🌳 Final Course Progress
          </h2>

          <div
            style={{
              display: "grid",
              gap: "10px",
            }}
          >
            <ProgressRow
              day={177}
              label="Final Study Guide #1"
              complete={isDayComplete(177)}
            />

            <ProgressRow
              day={178}
              label="Final Study Guide #2"
              complete={isDayComplete(178)}
            />

            <ProgressRow
              day={179}
              label="Final Exam"
              complete={isDayComplete(179)}
            />

            <ProgressRow
              day={180}
              label="Celebration / Completion Day"
              complete={isDayComplete(180)}
            />
          </div>

          {!isDayComplete(179) && (
            <p
              style={{
                marginTop: "15px",
                marginBottom: 0,
                fontSize: "14px",
                color: "#666",
              }}
            >
              Day 179 is completed only after
              earning a final exam score of
              80% or higher.
            </p>
          )}

          {isDayComplete(179) &&
            !isDayComplete(180) && (
              <p
                style={{
                  marginTop: "15px",
                  marginBottom: 0,
                  fontWeight: "bold",
                }}
              >
                🏆 Final Exam complete!
                Day 180 is your separate
                Celebration / Completion Day.
              </p>
            )}
        </section>

        {/* =========================
            DAY 177
        ========================= */}

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
            📚 Day 177 — Final Study Guide #1
          </h2>

          <h3>
            Review Lessons 91–134
          </h3>

          <p>
            Review the Bible stories, lessons,
            verses, and faith-building ideas
            from this section of the course.
          </p>

          <ul>
            {finalStudyGuide1.map(
              (item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  {item}
                </li>
              )
            )}
          </ul>

          <button
            onClick={printStudyGuide1}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: "#315c48",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🖨️ Print Final Study Guide #1
          </button>
        </section>

        {/* =========================
            DAY 178
        ========================= */}

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
            📚 Day 178 — Final Study Guide #2
          </h2>

          <h3>
            Review Lessons 135–176
          </h3>

          <p>
            Review the Bible stories, lessons,
            verses, and faith-building ideas
            from this section of the course.
          </p>

          <ul>
            {finalStudyGuide2.map(
              (item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  {item}
                </li>
              )
            )}
          </ul>

          <button
            onClick={printStudyGuide2}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: "#315c48",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🖨️ Print Final Study Guide #2
          </button>
        </section>

        {/* =========================
            PASSED NOTICE
        ========================= */}

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
            <div
              style={{
                fontSize: "55px",
              }}
            >
              🎉🏆🌳
            </div>

            <h2>
              Final Exam Passed!
            </h2>

            <p>
              Your passing score has been saved.
            </p>

            {score !== null && (
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Final Score: {score}%
              </p>
            )}

            <p>
              🌳 Day 179 is complete!
            </p>

            <p>
              🏆 Day 180 is your
              Celebration / Completion Day!
            </p>
          </section>
        )}

        {/* =========================
            EXAM MODE
        ========================= */}

        <section
          style={{
            background: "#fff4df",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
          }}
        >
          <h2>
            📝 Day 179 — Final Exam
          </h2>

          {!finalUnlocked && !isParent ? (
            <div
              style={{
                padding: "20px",
                background: "#fff0ed",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >
              🔒 Complete Days 177 and 178
              before taking the Final Exam.
            </div>
          ) : (
            <>
              <p>
                Choose how the Final Exam will be
                given:
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
                🎯 80% or higher = PASS
                <br />
                📖 79% or lower = NOT PASSED
              </p>
            </>
          )}
        </section>

        {/* =========================
            PARENT-LED EXAM
        ========================= */}

        {mode === "parent" &&
          (finalUnlocked || isParent) && (
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
                👩‍🏫 Parent-Led Final Exam
              </h2>

              <p>
                Print the blank Final Exam and
                give it to the student.
              </p>

              <button
                onClick={printFinalExam}
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
                🖨️ Print Blank Final Exam
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
                💾 Save Final Exam Score
              </button>

              {parentSaved && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "20px",
                    borderRadius: "15px",
                    background:
                      Number(parentScore) >=
                      PASSING_SCORE
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
                    {Number(parentScore) >=
                    PASSING_SCORE
                      ? "🎉🏆🌳"
                      : "📖💪"}
                  </div>

                  <h2>
                    {Number(parentScore) >=
                    PASSING_SCORE
                      ? "Final Exam Passed!"
                      : "Keep Studying"}
                  </h2>

                  <p>
                    Score:{" "}
                    <strong>
                      {parentScore}%
                    </strong>
                  </p>

                  <p>
                    {Number(parentScore) >=
                    PASSING_SCORE
                      ? "Great job! Day 179 is complete!"
                      : "Review your study guides and try again."}
                  </p>
                </div>
              )}
            </section>
          )}

        {/* =========================
            SYSTEM-LED EXAM
        ========================= */}

        {mode === "system" &&
          (finalUnlocked || isParent) && (
            <ExamContent
              answers={answers}
              setAnswers={setAnswers}
              score={score}
              calculateScore={calculateScore}
              resetExam={resetExam}
            />
          )}

        {/* =========================
            ATTEMPT HISTORY
        ========================= */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginTop: "20px",
          }}
        >
          <h2>
            📊 My Final Exam Attempts
          </h2>

          {attempts.length === 0 ? (
            <p>
              No Final Exam attempts yet.
            </p>
          ) : (
            attempts.map(
              (attempt, index) => (
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
                    {attempt.mode} •{" "}
                    {attempt.date}
                  </p>

                  {attempt.incorrect
                    ?.length > 0 && (
                    <div>
                      <strong>
                        Questions missed:
                      </strong>

                      <ul>
                        {attempt.incorrect.map(
                          (item) => (
                            <li
                              key={item.number}
                            >
                              #{item.number} —{" "}
                              {item.question}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {attempt.incorrect
                    ?.length === 0 && (
                    <p>
                      ✅ No questions missed.
                    </p>
                  )}
                </div>
              )
            )
          )}
        </section>

        {/* =========================
            NAVIGATION
        ========================= */}

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

        <div
          style={{
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          <button
            onClick={() =>
              setIsParent(!isParent)
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
            {isParent
              ? "👧 Student View"
              : "👩‍🏫 Parent Preview"}
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================
   PROGRESS ROW
========================= */

function ProgressRow({
  day,
  label,
  complete,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "12px 15px",
        borderRadius: "12px",
        background: complete
          ? "#e9f4ed"
          : "#f7f7f7",
      }}
    >
      <div>
        <strong>
          Day {day}
        </strong>

        <div
          style={{
            fontSize: "14px",
            color: "#666",
            marginTop: "3px",
          }}
        >
          {label}
        </div>
      </div>

      <div
        style={{
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        {complete
          ? "✅ Complete"
          : "🔒 Incomplete"}
      </div>
    </div>
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
        💻 System-Led Final Exam
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
                name={`final-question-${index}`}
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
        🏆 Submit Final Exam
      </button>

      {score !== null && (
        <div
          style={{
            marginTop: "25px",
            padding: "25px",
            borderRadius: "15px",
            background:
              score >= PASSING_SCORE
                ? "#e9f4ed"
                : "#fff0ed",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "55px",
            }}
          >
            {score >= PASSING_SCORE
              ? "🎉🏆🌳"
              : "📖💪"}
          </div>

          <h2>
            Final Score: {score}%
          </h2>

          <h2>
            {score >= PASSING_SCORE
              ? "🎉 You Passed!"
              : "📖 Keep Studying"}
          </h2>

          <p>
            {score >= PASSING_SCORE
              ? "Congratulations! You passed your Final Exam!"
              : "You need 80% or higher to pass. Review your study guides and try again."}
          </p>

          {score >= PASSING_SCORE && (
            <>
              <p
                style={{
                  fontWeight: "bold",
                }}
              >
                🌳 Day 179 is complete!
              </p>

              <p>
                🏆 Day 180 is your
                Celebration / Completion Day!
              </p>
            </>
          )}

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

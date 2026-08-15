"use client";

import { useEffect, useState } from "react";

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
    question: "Who trusted God and followed Him to a new land?",
    answers: ["Abraham", "Jonah", "Samuel", "Solomon"],
    correct: "Abraham",
  },
  {
    question: "Who was known for forgiving his brothers?",
    answers: ["Joseph", "Joshua", "Daniel", "Elijah"],
    correct: "Joseph",
  },
  {
    question: "Who was called to lead God's people out of Egypt?",
    answers: ["David", "Moses", "Peter", "Paul"],
    correct: "Moses",
  },
  {
    question: "What did God tell Joshua to be?",
    answers: ["Rich", "Famous", "Strong and courageous", "Angry"],
    correct: "Strong and courageous",
  },
  {
    question: "Who defeated Goliath?",
    answers: ["David", "Saul", "Samuel", "Joshua"],
    correct: "David",
  },
  {
    question: "Who was thrown into the lions' den?",
    answers: ["Daniel", "Joseph", "Moses", "Peter"],
    correct: "Daniel",
  },
  {
    question: "What did Jesus teach us to do for our neighbors?",
    answers: ["Ignore them", "Love them", "Avoid them", "Judge them"],
    correct: "Love them",
  },
  {
    question: "What is one important thing prayer does?",
    answers: [
      "Keeps us close to God",
      "Makes us famous",
      "Makes us perfect",
      "Makes us rich",
    ],
    correct: "Keeps us close to God",
  },
];

export default function Midterm() {
  const [isParent, setIsParent] = useState(false);
  const [studentUnlocked, setStudentUnlocked] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const savedCompleted = localStorage.getItem("faithTreeCompleted");

    if (savedCompleted) {
      const completed = JSON.parse(savedCompleted);

      // Student unlocks after Day 90
      if (completed.length >= 90) {
        setStudentUnlocked(true);
      }
    }

    const savedScore = localStorage.getItem("faithMidtermScore");

    if (savedScore) {
      setScore(Number(savedScore));
    }
  }, []);

  function calculateScore() {
    let total = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        total++;
      }
    });

    const finalScore = total * 10;

    setScore(finalScore);
    localStorage.setItem(
      "faithMidtermScore",
      String(finalScore)
    );
  }

  function resetExam() {
    setAnswers({});
    setScore(null);
    localStorage.removeItem("faithMidtermScore");
  }

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
          <div style={{ fontSize: "60px" }}>📚🌳</div>

          <h1 style={{ color: "#315c48" }}>
            Midterm Bible Review & Exam
          </h1>

          <p>
            Faith Foundations: The M&M Adventure
          </p>
        </header>

        {!isParent && !studentUnlocked && (
          <section
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,.1)",
            }}
          >
            <div style={{ fontSize: "55px" }}>🔒</div>

            <h2>Midterm Exam Locked</h2>

            <p>
              Keep growing your Faith Tree!
            </p>

            <p>
              Your Midterm Exam will unlock after you
              complete <strong>Day 90</strong>.
            </p>
          </section>
        )}

        {!isParent && studentUnlocked && (
          <>
            <section
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "25px",
                marginBottom: "20px",
                boxShadow: "0 4px 15px rgba(0,0,0,.1)",
              }}
            >
              <h2>📖 Midterm Review</h2>

              <p>
                Review the Bible stories and lessons you have
                learned so far. Ask your parent to help you
                remember your favorite stories and memory
                verses.
              </p>

              <p>
                ⭐ Take your time. The goal is to learn God's
                Word and grow in faith!
              </p>
            </section>

            <ExamContent
              answers={answers}
              setAnswers={setAnswers}
              score={score}
              calculateScore={calculateScore}
              resetExam={resetExam}
            />
          </>
        )}

        {isParent && (
          <>
            <section
              style={{
                background: "#fff4df",
                borderRadius: "20px",
                padding: "25px",
                marginBottom: "25px",
              }}
            >
              <h2>👩‍🏫 Parent Preview</h2>

              <p>
                This review and exam are available for you
                to preview at any time.
              </p>

              <p>
                🔒 Student unlocks the Midterm Exam after
                completing <strong>Day 90</strong>.
              </p>
            </section>

            <ExamContent
              answers={answers}
              setAnswers={setAnswers}
              score={score}
              calculateScore={calculateScore}
              resetExam={resetExam}
            />
          </>
        )}

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={() => setIsParent(!isParent)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "none",
              background: "#315c48",
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
        boxShadow: "0 4px 15px rgba(0,0,0,.1)",
      }}
    >
      <h2>📝 Midterm Exam</h2>

      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            marginTop: "25px",
            paddingBottom: "20px",
            borderBottom: "1px solid #ddd",
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
                checked={answers[index] === answer}
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
            background: "#e9f4ed",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "50px" }}>
            {score >= 70 ? "🎉🏆" : "📖💪"}
          </div>

          <h2>Your Score: {score}%</h2>

          <p>
            {score >= 70
              ? "Great job! Keep growing in God's Word!"
              : "Keep studying and try again. You can do it!"}
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

"use client";

import { useEffect, useState } from "react";

const questions = [
  {
    question: "Who is the Creator of everything?",
    answers: ["Moses", "God", "David", "Paul"],
    correct: "God",
  },
  {
    question: "What did Jesus teach us to do for others?",
    answers: ["Ignore them", "Love them", "Judge them", "Avoid them"],
    correct: "Love them",
  },
  {
    question: "Who built the ark?",
    answers: ["Abraham", "Noah", "Moses", "Joshua"],
    correct: "Noah",
  },
  {
    question: "Who defeated Goliath?",
    answers: ["David", "Samuel", "Saul", "Solomon"],
    correct: "David",
  },
  {
    question: "Who was known for praying even when it was dangerous?",
    answers: ["Daniel", "Joseph", "Jonah", "Peter"],
    correct: "Daniel",
  },
  {
    question: "What is one fruit of the Spirit?",
    answers: ["Anger", "Jealousy", "Love", "Pride"],
    correct: "Love",
  },
  {
    question: "What does the Bible tell us to do with God's Word?",
    answers: [
      "Forget it",
      "Hide it in our hearts",
      "Ignore it",
      "Only read it once",
    ],
    correct: "Hide it in our hearts",
  },
  {
    question: "What happened after Jesus died?",
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
    question: "What should we do when we finish this Bible adventure?",
    answers: [
      "Stop learning",
      "Keep growing in faith",
      "Forget what we learned",
      "Never read the Bible again",
    ],
    correct: "Keep growing in faith",
  },
];

export default function Final() {
  const [isParent, setIsParent] = useState(false);
  const [studentUnlocked, setStudentUnlocked] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const savedCompleted = localStorage.getItem("faithTreeCompleted");

    if (savedCompleted) {
      const completed = JSON.parse(savedCompleted);

      // Student unlocks after completing Day 180
      if (completed.length >= 180) {
        setStudentUnlocked(true);
      }
    }

    const savedScore = localStorage.getItem("faithFinalScore");

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
      "faithFinalScore",
      String(finalScore)
    );
  }

  function resetExam() {
    setAnswers({});
    setScore(null);
    localStorage.removeItem("faithFinalScore");
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
          <div style={{ fontSize: "65px" }}>🏆🌳📖</div>

          <h1 style={{ color: "#315c48" }}>
            Final Bible Review & Exam
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
            <div style={{ fontSize: "60px" }}>🔒</div>

            <h2>Final Exam Locked</h2>

            <p>
              Keep growing your Faith Tree!
            </p>

            <p>
              Your Final Review and Exam will unlock after
              you complete <strong>Day 180</strong>.
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
              <h2>📖 Final Review</h2>

              <p>
                Congratulations on completing your 180-day
                Faith Foundations adventure!
              </p>

              <p>
                Review your favorite Bible stories, lessons,
                memory verses, and ways God has helped you
                grow.
              </p>

              <p>
                ⭐ Take your time and remember: finishing the
                course is an accomplishment, but growing in
                faith continues every day!
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
                The Final Review and Exam are available for
                you to preview at any time.
              </p>

              <p>
                🔒 Student unlocks the Final Review and Exam
                after completing <strong>Day 180</strong>.
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

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
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
      <h2>📝 Final Exam</h2>

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
                name={`final-question-${index}`}
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
        🏆 Submit Final Exam
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
          <div style={{ fontSize: "55px" }}>
            {score >= 70 ? "🎉🏆🌳" : "📖💪"}
          </div>

          <h2>Final Score: {score}%</h2>

          <p>
            {score >= 70
              ? "🎉 Congratulations! You completed your Faith Foundations adventure!"
              : "Keep studying God's Word and try again. You can do it!"}
          </p>

          {score >= 70 && (
            <p style={{ fontWeight: "bold" }}>
              🌳 Your Faith Tree has fully grown! 🌳
            </p>
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

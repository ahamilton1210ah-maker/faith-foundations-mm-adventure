"use client";

import { useEffect, useState } from "react";

export default function ParentProgress() {
  const [completedDays, setCompletedDays] = useState([]);
  const [midtermScore, setMidtermScore] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    const savedDays = localStorage.getItem("faithTreeCompleted");

    if (savedDays) {
      try {
        setCompletedDays(JSON.parse(savedDays));
      } catch {
        setCompletedDays([]);
      }
    }

    const savedMidterm = localStorage.getItem("faithMidtermScore");
    const savedFinal = localStorage.getItem("faithFinalScore");

    if (savedMidterm !== null) {
      setMidtermScore(Number(savedMidterm));
    }

    if (savedFinal !== null) {
      setFinalScore(Number(savedFinal));
    }
  }, []);

  const completed = completedDays.length;

  const percentage = Math.round((completed / 180) * 100);

  let tree = "🌱";
  let treeMessage = "Your faith is taking root!";

  if (completed >= 180) {
    tree = "🌳🏆";
    treeMessage = "Your Faith Tree has fully grown!";
  } else if (completed >= 150) {
    tree = "🌲🌳🌲";
    treeMessage = "Your Faith Tree is almost fully grown!";
  } else if (completed >= 120) {
    tree = "🌳🌳🌳";
    treeMessage = "Your Faith Tree is growing strong!";
  } else if (completed >= 60) {
    tree = "🌳";
    treeMessage = "Look how much your Faith Tree has grown!";
  }

  const currentDay =
    completed >= 180 ? 180 : completed + 1;

  function printReport() {
    window.print();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f1e8",
        padding: "30px 15px 60px",
        fontFamily: "Arial, sans-serif",
        color: "#24313a"
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto"
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          <div style={{ fontSize: "65px" }}>
            🌳📚
          </div>

          <h1
            style={{
              color: "#315c48",
              marginBottom: "8px"
            }}
          >
            👩‍🏫 Parent Dashboard
          </h1>

          <p>
            Faith Foundations: The M&M Adventure
          </p>
        </header>

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            marginBottom: "22px",
            boxShadow: "0 4px 15px rgba(0,0,0,.1)"
          }}
        >
          <div style={{ fontSize: "75px" }}>
            {tree}
          </div>

          <h2>{treeMessage}</h2>

          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold"
            }}
          >
            {completed} / 180 Lessons Complete
          </p>

          <div
            style={{
              width: "100%",
              height: "28px",
              background: "#ddd",
              borderRadius: "20px",
              overflow: "hidden",
              marginTop: "15px"
            }}
          >
            <div
              style={{
                width: `${percentage}%`,
                height: "100%",
                background: "#315c48",
                transition: "width .5s"
              }}
            />
          </div>

          <p
            style={{
              fontSize: "18px",
              marginTop: "12px"
            }}
          >
            {percentage}% Complete
          </p>
        </section>

        <section
          style={{
            background: "#fffaf0",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px"
          }}
        >
          <h2>📅 Current Progress</h2>

          <p>
            📖 Next lesson:{" "}
            <strong>
              Day {currentDay}
            </strong>
          </p>

          <p>
            ⭐ Lessons completed:{" "}
            <strong>{completed}</strong>
          </p>

          <p>
            📈 Lessons remaining:{" "}
            <strong>{180 - completed}</strong>
          </p>

          <p>
            🌳 Faith Tree progress:{" "}
            <strong>{percentage}%</strong>
          </p>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px"
          }}
        >
          <h2>📝 Exams & Reviews</h2>

          <div
            style={{
              padding: "18px",
              background: "#f0f7ff",
              borderRadius: "15px",
              marginBottom: "15px"
            }}
          >
            <h3>📚 Midterm</h3>

            <p>
              👀 Parent Preview:{" "}
              <strong>Available Now</strong>
            </p>

            <p>
              🔒 Student Unlocks:{" "}
              <strong>Day 90</strong>
            </p>

            <p>
              📝 Student Score:{" "}
              <strong>
                {midtermScore === null
                  ? "Not Taken"
                  : `${midtermScore}%`}
              </strong>
            </p>

            <a
              href="/Midterm"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: "12px",
                background: "#315c48",
                color: "white",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              👀 Preview Midterm
            </a>
          </div>

          <div
            style={{
              padding: "18px",
              background: "#fff4df",
              borderRadius: "15px"
            }}
          >
            <h3>🏆 Final Exam</h3>

            <p>
              👀 Parent Preview:{" "}
              <strong>Available Now</strong>
            </p>

            <p>
              🔒 Student Unlocks:{" "}
              <strong>Day 180</strong>
            </p>

            <p>
              🏆 Student Score:{" "}
              <strong>
                {finalScore === null
                  ? "Not Taken"
                  : `${finalScore}%`}
              </strong>
            </p>

            <a
              href="/Final"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: "12px",
                background: "#315c48",
                color: "white",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              👀 Preview Final
            </a>
          </div>
        </section>

        <section
          style={{
            background: "#eef7e9",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px"
          }}
        >
          <h2>🌟 Course Status</h2>

          {completed === 0 && (
            <p>
              🌱 The adventure is ready to begin!
            </p>
          )}

          {completed > 0 && completed < 90 && (
            <p>
              🌱 Your child is building a strong
              foundation of faith.
            </p>
          )}

          {completed >= 90 && completed < 180 && (
            <p>
              🎉 Great progress! Your child has reached
              the middle of the Faith Foundations adventure.
            </p>
          )}

          {completed === 180 && (
            <p>
              🎓🏆 Congratulations! All 180 Bible lessons
              are complete!
            </p>
          )}
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "25px"
          }}
        >
          <h2>🖨️ Printable Progress Report</h2>

          <p>
            Use the button below to print or save this
            progress report.
          </p>

          <button
            onClick={printReport}
            style={{
              padding: "14px 22px",
              border: "none",
              borderRadius: "12px",
              background: "#315c48",
              color: "white",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            🖨️ Print Progress Report
          </button>
        </section>

        <p
          style={{
            textAlign: "center",
            fontSize: "18px"
          }}
        >
          🌳 Every lesson helps your Faith Tree grow!
        </p>
      </div>
    </main>
  );
}

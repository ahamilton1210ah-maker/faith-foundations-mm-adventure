"use client";

import { useEffect, useState } from "react";

export default function Parent() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    function loadProgress() {
      const saved = localStorage.getItem("faithTreeCompleted");

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setCompleted(parsed);
          }
        } catch {
          setCompleted([]);
        }
      }
    }

    loadProgress();

    window.addEventListener(
      "faithTreeProgressUpdated",
      loadProgress
    );

    window.addEventListener("storage", loadProgress);

    return () => {
      window.removeEventListener(
        "faithTreeProgressUpdated",
        loadProgress
      );

      window.removeEventListener("storage", loadProgress);
    };
  }, []);

  const count = completed.length;

  const percentage = Math.round(
    (count / 180) * 100
  );

  let tree = "🌱";
  let message = "Your faith is taking root!";

  if (count >= 180) {
    tree = "🌳🏆";
    message = "Your Faith Tree is fully grown!";
  } else if (count >= 120) {
    tree = "🌳🌳🌳";
    message = "Your Faith Tree is growing strong!";
  } else if (count >= 60) {
    tree = "🌳";
    message = "Look how much your Faith Tree has grown!";
  }

  function printReport() {
    const completedDays = [...completed].sort(
      (a, b) => a - b
    );

    const today = new Date().toLocaleDateString();

    const reportWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!reportWindow) {
      alert(
        "Please allow pop-ups for this website so the printable report can open."
      );

      return;
    }

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Faith Foundations Progress Report</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #24313a;
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
          }

          .tree {
            font-size: 70px;
            margin: 10px;
          }

          h1 {
            color: #315c48;
            margin-bottom: 5px;
          }

          h2 {
            color: #315c48;
          }

          .box {
            border: 2px solid #ddd;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
          }

          .progress-container {
            width: 100%;
            height: 25px;
            background: #ddd;
            border-radius: 20px;
            overflow: hidden;
          }

          .progress {
            width: ${percentage}%;
            height: 100%;
            background: #315c48;
          }

          .percentage {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-top: 10px;
          }

          .days {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 6px;
            margin-top: 15px;
          }

          .day {
            border: 1px solid #ccc;
            padding: 7px 3px;
            text-align: center;
            border-radius: 5px;
            font-size: 12px;
          }

          .completed {
            background: #e9f4ed;
            border: 1px solid #6b9e5b;
            font-weight: bold;
          }

          .signature {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
          }

          .line {
            border-top: 1px solid #333;
            width: 40%;
            padding-top: 8px;
          }

          @media print {
            body {
              padding: 20px;
            }

            button {
              display: none;
            }
          }
        </style>
      </head>

      <body>

        <div class="header">
          <div class="tree">${tree}</div>

          <h1>Faith Foundations</h1>

          <h2>The M&M Adventure</h2>

          <p>
            <strong>Parent Progress Report</strong>
          </p>

          <p>
            Report Date: ${today}
          </p>
        </div>

        <div class="box">

          <h2>🌳 Faith Progress</h2>

          <p>
            <strong>${count}</strong> / 180
            Bible lessons completed
          </p>

          <div class="progress-container">
            <div class="progress"></div>
          </div>

          <div class="percentage">
            ${percentage}% Complete
          </div>

          <p>
            ${message}
          </p>

        </div>

        <div class="box">

          <h2>📚 Course Progress</h2>

          <p>
            📖 Bible Lessons:
            <strong>${count} / 180</strong>
          </p>

          <p>
            📝 Midterm Review:
            <strong>
              ${
                count >= 88
                  ? "Completed / Ready"
                  : "Not yet completed"
              }
            </strong>
          </p>

          <p>
            📝 Midterm Exam:
            <strong>
              ${
                count >= 89
                  ? "Completed / Ready"
                  : "Not yet completed"
              }
            </strong>
          </p>

          <p>
            🏆 Final Review:
            <strong>
              ${
                count >= 178
                  ? "Completed / Ready"
                  : "Not yet completed"
              }
            </strong>
          </p>

          <p>
            🏆 Final Exam:
            <strong>
              ${
                count >= 179
                  ? "Completed / Ready"
                  : "Not yet completed"
              }
            </strong>
          </p>

        </div>

        <div class="box">

          <h2>📖 Completed Lessons</h2>

          ${
            completedDays.length === 0
              ? "<p>No lessons completed yet.</p>"
              : `
                <p>
                  The following days have been completed:
                </p>

                <div class="days">

                  ${Array.from(
                    { length: 180 },
                    (_, index) => {
                      const day = index + 1;

                      const isDone =
                        completedDays.includes(day);

                      return `
                        <div
                          class="day ${
                            isDone
                              ? "completed"
                              : ""
                          }"
                        >
                          Day ${day}
                          ${
                            isDone
                              ? " ✓"
                              : ""
                          }
                        </div>
                      `;
                    }
                  ).join("")}

                </div>
              `
          }

        </div>

        <div class="box">

          <h2>🌱 Faith Tree Milestones</h2>

          <p>
            ${
              count >= 10
                ? "✅"
                : "🔒"
            }
            First Steps — 10 Lessons
          </p>

          <p>
            ${
              count >= 25
                ? "✅"
                : "🔒"
            }
            Growing Strong — 25 Lessons
          </p>

          <p>
            ${
              count >= 50
                ? "✅"
                : "🔒"
            }
            Faith Builder — 50 Lessons
          </p>

          <p>
            ${
              count >= 90
                ? "✅"
                : "🔒"
            }
            Halfway Hero — 90 Lessons
          </p>

          <p>
            ${
              count >= 135
                ? "✅"
                : "🔒"
            }
            Faith Champion — 135 Lessons
          </p>

          <p>
            ${
              count >= 180
                ? "🏆"
                : "🔒"
            }
            Faith Foundations Champion — 180 Lessons
          </p>

        </div>

        <div class="signature">

          <div class="line">
            Parent Signature
          </div>

          <div class="line">
            Date
          </div>

        </div>

        <br />

        <p style="text-align:center;">
          🌳 Every lesson helps your Faith Tree grow!
        </p>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>

      </body>
      </html>
    `);

    reportWindow.document.close();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px 20px 60px",
        textAlign: "center",
        background: "#f8f5ed",
        fontFamily: "Arial, sans-serif",
        color: "#24313a",
      }}
    >

      <h1>👩‍🏫 Parent Dashboard</h1>

      <h2>
        Faith Foundations: The M&M Adventure
      </h2>

      {/* PRINT REPORT BUTTON */}

      <button
        onClick={printReport}
        style={{
          marginTop: "15px",
          padding: "15px 25px",
          border: "none",
          borderRadius: "15px",
          background: "#315c48",
          color: "white",
          fontSize: "17px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow:
            "0 4px 10px rgba(0,0,0,.15)",
        }}
      >
        🖨️ Print Progress Report
      </button>

      {/* FAITH TREE */}

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          margin: "25px auto",
          maxWidth: "600px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,.12)",
        }}
      >

        <div
          style={{
            fontSize: "70px",
            margin: "15px",
          }}
        >
          {tree}
        </div>

        <h2>{message}</h2>

        <p style={{ fontSize: "22px" }}>
          <strong>{count}</strong> / 180
          lessons completed
        </p>

        <div
          style={{
            width: "100%",
            height: "25px",
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
              transition: "width .5s",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "18px",
            marginTop: "12px",
          }}
        >
          {percentage}% Complete
        </p>

      </div>

      {/* COURSE PROGRESS */}

      <div
        style={{
          background: "#fff4df",
          borderRadius: "20px",
          padding: "25px",
          margin: "20px auto",
          maxWidth: "600px",
        }}
      >

        <h2>📚 Course Progress</h2>

        <p>
          📖 Bible Lessons:
          <strong> {count} / 180</strong>
        </p>

        <p>
          📝 Midterm Review:{" "}
          <strong>
            {count >= 88
              ? "Ready!"
              : "Complete more lessons first"}
          </strong>
        </p>

        <p>
          📝 Midterm Exam:{" "}
          <strong>
            {count >= 89
              ? "Ready!"
              : "Complete more lessons first"}
          </strong>
        </p>

        <p>
          🏆 Final Review:{" "}
          <strong>
            {count >= 178
              ? "Ready!"
              : "Complete more lessons first"}
          </strong>
        </p>

        <p>
          🏆 Final Exam:{" "}
          <strong>
            {count >= 179
              ? "Ready!"
              : "Complete all 180 lessons"}
          </strong>
        </p>

      </div>

      {/* QUICK SUMMARY */}

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          margin: "20px auto",
          maxWidth: "600px",
        }}
      >

        <h2>🌱 Faith Tree Milestones</h2>

        <p>
          {count >= 10 ? "✅" : "🔒"}
          {" "}First Steps — 10 Lessons
        </p>

        <p>
          {count >= 25 ? "✅" : "🔒"}
          {" "}Growing Strong — 25 Lessons
        </p>

        <p>
          {count >= 50 ? "✅" : "🔒"}
          {" "}Faith Builder — 50 Lessons
        </p>

        <p>
          {count >= 90 ? "✅" : "🔒"}
          {" "}Halfway Hero — 90 Lessons
        </p>

        <p>
          {count >= 135 ? "✅" : "🔒"}
          {" "}Faith Champion — 135 Lessons
        </p>

        <p>
          {count >= 180 ? "🏆" : "🔒"}
          {" "}Faith Foundations Champion — 180 Lessons
        </p>

      </div>

      <p
        style={{
          marginTop: "30px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        🌳 Every lesson helps your Faith Tree grow!
      </p>

    </main>
  );
}

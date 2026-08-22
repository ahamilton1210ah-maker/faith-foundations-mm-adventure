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
  const completedCount = completed.length;
  const percentage = Math.round((completedCount / 180) * 100);

  const courseStatus =
    completedCount === 0
      ? "Not Started"
      : completedCount >= 180
      ? "Completed"
      : "In Progress";

  const faithTree =
    completedCount === 0
      ? "🌱 Taking Root"
      : completedCount < 30
      ? "🌿 Growing"
      : completedCount < 60
      ? "🌳 Growing Strong"
      : completedCount < 90
      ? "🌳🌳 Growing"
      : completedCount < 120
      ? "🌳🌳🌳 Well Established"
      : completedCount < 150
      ? "🌲🌳🌲 Almost Fully Grown"
      : completedCount < 180
      ? "🌲🌳🌲🌳 Nearly Complete"
      : "🌲🌳🌲🌳🌲 Fully Grown";

  const badges = [
    {
      name: "First Steps",
      lessons: 10,
      earned: completedCount >= 10
    },
    {
      name: "Growing Strong",
      lessons: 25,
      earned: completedCount >= 25
    },
    {
      name: "Faith Builder",
      lessons: 50,
      earned: completedCount >= 50
    },
    {
      name: "Halfway Hero",
      lessons: 90,
      earned: completedCount >= 90
    },
    {
      name: "Faith Champion",
      lessons: 135,
      earned: completedCount >= 135
    },
    {
      name: "Faith Foundations Champion",
      lessons: 180,
      earned: completedCount >= 180
    }
  ];

  const reportWindow = window.open("", "_blank");

  if (!reportWindow) {
    alert("Please allow pop-ups to print the progress report.");
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
            color: #24313a;
            padding: 40px;
            max-width: 800px;
            margin: auto;
          }

          h1 {
            text-align: center;
            color: #315c48;
            margin-bottom: 5px;
          }

          h2 {
            color: #315c48;
            border-bottom: 2px solid #315c48;
            padding-bottom: 6px;
            margin-top: 28px;
          }

          .subtitle {
            text-align: center;
            font-size: 18px;
            margin-bottom: 30px;
          }

          .info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 25px;
          }

          .box {
            border: 1px solid #ccc;
            padding: 12px;
            border-radius: 8px;
          }

          .progress {
            font-size: 28px;
            font-weight: bold;
            color: #315c48;
            text-align: center;
            margin: 15px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
          }

          th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
          }

          th {
            background: #e9f4ed;
          }

          .earned {
            color: #315c48;
            font-weight: bold;
          }

          .locked {
            color: #888;
          }

          .notes {
            border: 1px solid #ccc;
            min-height: 100px;
            padding: 10px;
            margin-top: 10px;
          }

          .signature {
            margin-top: 45px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }

          .line {
            border-bottom: 1px solid #333;
            padding-bottom: 8px;
          }

          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 13px;
            color: #666;
          }

          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>

      <body>

        <h1>🌳 Faith Foundations</h1>

        <div class="subtitle">
          <strong>The M&M Adventure</strong><br />
          Bible Curriculum Progress Report
        </div>

        <div class="info">
          <div class="box">
            <strong>Student:</strong><br />
            ______________________________
          </div>

          <div class="box">
            <strong>Grade:</strong><br />
            3rd Grade
          </div>

          <div class="box">
            <strong>School Year:</strong><br />
            2026–2027
          </div>

          <div class="box">
            <strong>Parent/Teacher:</strong><br />
            ______________________________
          </div>
        </div>

        <h2>📚 Course Progress</h2>

        <div class="progress">
          ${completedCount} / 180 Lessons Completed
        </div>

        <p style="text-align:center;">
          <strong>${percentage}% Complete</strong>
        </p>

        <table>
          <tr>
            <th>Current Progress</th>
            <td>${courseStatus}</td>
          </tr>

          <tr>
            <th>Lessons Completed</th>
            <td>${completedCount} of 180</td>
          </tr>

          <tr>
            <th>Faith Tree</th>
            <td>${faithTree}</td>
          </tr>
        </table>

        <h2>🏅 Faith Badges</h2>

        <table>
          <tr>
            <th>Badge</th>
            <th>Requirement</th>
            <th>Status</th>
          </tr>

          ${badges
            .map(
              (badge) => `
                <tr>
                  <td>${badge.name}</td>
                  <td>${badge.lessons} Lessons</td>
                  <td class="${badge.earned ? "earned" : "locked"}">
                    ${badge.earned ? "✅ Earned" : "🔒 Not Yet Earned"}
                  </td>
                </tr>
              `
            )
            .join("")}
        </table>

        <h2>📝 Exams & Reviews</h2>

        <table>
          <tr>
            <th>Assessment</th>
            <th>Status</th>
            <th>Grade</th>
          </tr>

          <tr>
            <td>Midterm Review</td>
            <td>${completedCount >= 90 ? "🔓 Unlocked" : "🔒 Locked"}</td>
            <td>__________</td>
          </tr>

          <tr>
            <td>Midterm Exam</td>
            <td>${completedCount >= 90 ? "🔓 Unlocked" : "🔒 Locked"}</td>
            <td>__________</td>
          </tr>

          <tr>
            <td>Final Review</td>
            <td>${completedCount >= 180 ? "🔓 Unlocked" : "🔒 Locked"}</td>
            <td>__________</td>
          </tr>

          <tr>
            <td>Final Exam</td>
            <td>${completedCount >= 180 ? "🔓 Unlocked" : "🔒 Locked"}</td>
            <td>__________</td>
          </tr>
        </table>

        <h2>📖 Course Status</h2>

        <div class="box">
          <strong>${courseStatus}</strong>
          <br /><br />
          Faith Foundations: The M&M Adventure
          <br />
          180 Bible lessons
          <br />
          Growing in God's Word — one day at a time!
        </div>

        <h2>📝 Parent/Teacher Notes</h2>

        <div class="notes">
          <br /><br /><br /><br />
        </div>

        <div class="signature">
          <div class="line">
            Parent/Teacher Signature
          </div>

          <div class="line">
            Date
          </div>
        </div>

        <div class="footer">
          Faith Foundations: The M&M Adventure<br />
          Growing in God's Word — one day at a time.
        </div>

      </body>
    </html>
  `);

  reportWindow.document.close();

  reportWindow.onload = function () {
    reportWindow.focus();
    reportWindow.print();
  };
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

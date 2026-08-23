"use client";

import { useEffect, useState } from "react";

export default function ParentProgress() {
  const [completedDays, setCompletedDays] = useState([]);
  const [midtermScore, setMidtermScore] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    try {
      const savedDays = localStorage.getItem("faithTreeCompleted");

      if (savedDays) {
        const parsedDays = JSON.parse(savedDays);

        if (Array.isArray(parsedDays)) {
          setCompletedDays(parsedDays);
        } else {
          setCompletedDays([]);
        }
      }
    } catch {
      setCompletedDays([]);
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

  /* =========================
     COURSE PROGRESS
  ========================= */

  const completed = completedDays.length;

  const percentage = Math.min(
    100,
    Math.round((completed / 180) * 100)
  );

  const currentDay =
    completed >= 180 ? 180 : completed + 1;

  /* =========================
     FAITH TREE
  ========================= */

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
  } else if (completed >= 90) {
    tree = "🌳🌳";
    treeMessage = "Your Faith Tree is growing beautifully!";
  } else if (completed >= 60) {
    tree = "🌳";
    treeMessage = "Look how much your Faith Tree has grown!";
  } else if (completed >= 30) {
    tree = "🌿";
    treeMessage = "Your Faith is growing stronger!";
  }

  /* =========================
     COURSE STATUS
  ========================= */

  const courseStatus =
    completed === 0
      ? "Not Started"
      : completed >= 180
      ? "Completed"
      : "In Progress";

  /* =========================
     PRINTABLE REPORT
  ========================= */

  function printReport() {
    // Get the latest saved progress directly from storage
    let savedCompleted = [];

    try {
      const saved = localStorage.getItem("faithTreeCompleted");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          savedCompleted = parsed;
        }
      }
    } catch {
      savedCompleted = [];
    }

    const completedCount = savedCompleted.length;

    const reportPercentage = Math.min(
      100,
      Math.round((completedCount / 180) * 100)
    );

    const reportStatus =
      completedCount === 0
        ? "Not Started"
        : completedCount >= 180
        ? "Completed"
        : "In Progress";

    let reportFaithTree = "🌱 Taking Root";

    if (completedCount >= 180) {
      reportFaithTree = "🌳🏆 Fully Grown";
    } else if (completedCount >= 150) {
      reportFaithTree = "🌲🌳🌲 Almost Fully Grown";
    } else if (completedCount >= 120) {
      reportFaithTree = "🌳🌳🌳 Growing Strong";
    } else if (completedCount >= 90) {
      reportFaithTree = "🌳🌳 Growing";
    } else if (completedCount >= 60) {
      reportFaithTree = "🌳 Growing Strong";
    } else if (completedCount >= 30) {
      reportFaithTree = "🌿 Growing";
    }

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

    const midtermUnlocked = completedCount >= 90;
    const finalUnlocked = completedCount >= 180;

    const reportWindow = window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );

    if (!reportWindow) {
      alert(
        "Please allow pop-ups for this website so the progress report can open."
      );
      return;
    }

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Faith Foundations Progress Report</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, sans-serif;
              color: #24313a;
              background: white;
              padding: 35px;
              max-width: 850px;
              margin: 0 auto;
            }

            h1 {
              text-align: center;
              color: #315c48;
              margin: 0;
              font-size: 30px;
            }

            h2 {
              color: #315c48;
              border-bottom: 2px solid #315c48;
              padding-bottom: 7px;
              margin-top: 30px;
            }

            .subtitle {
              text-align: center;
              font-size: 18px;
              margin-top: 8px;
              margin-bottom: 28px;
            }

            .info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-bottom: 25px;
            }

            .box {
              border: 1px solid #ccc;
              padding: 13px;
              border-radius: 8px;
            }

            .big-progress {
              text-align: center;
              font-size: 27px;
              font-weight: bold;
              color: #315c48;
              margin: 18px 0 8px;
            }

            .percentage {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 18px;
            }

            .progress-bar {
              height: 22px;
              width: 100%;
              background: #e1e1e1;
              border-radius: 20px;
              overflow: hidden;
              margin: 10px 0 18px;
            }

            .progress-fill {
              height: 100%;
              width: ${reportPercentage}%;
              background: #315c48;
              border-radius: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
            }

            th,
            td {
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

            .status-box {
              border: 1px solid #ccc;
              border-radius: 8px;
              padding: 18px;
              font-size: 16px;
              line-height: 1.6;
            }

            .notes {
              border: 1px solid #ccc;
              min-height: 120px;
              padding: 10px;
              margin-top: 10px;
            }

            .signature {
              margin-top: 45px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 50px;
            }

            .signature-line {
              border-bottom: 1px solid #333;
              padding-bottom: 8px;
            }

            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #ddd;
              font-size: 13px;
              color: #666;
            }

            @media print {
              body {
                padding: 20px;
              }

              @page {
                margin: 0.5in;
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
              <strong>Student:</strong><br /><br />
              __________________________________
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
              <strong>Parent/Teacher:</strong><br /><br />
              __________________________________
            </div>

          </div>

          <h2>📚 Course Progress</h2>

          <div class="big-progress">
            ${completedCount} / 180 Lessons Completed
          </div>

          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>

          <div class="percentage">
            ${reportPercentage}% Complete
          </div>

          <table>
            <tr>
              <th>Current Progress</th>
              <td>${reportStatus}</td>
            </tr>

            <tr>
              <th>Lessons Completed</th>
              <td>${completedCount} of 180</td>
            </tr>

            <tr>
              <th>Lessons Remaining</th>
              <td>${180 - completedCount}</td>
            </tr>

            <tr>
              <th>Next Lesson</th>
              <td>
                ${
                  completedCount >= 180
                    ? "Course Complete"
                    : `Day ${completedCount + 1}`
                }
              </td>
            </tr>

            <tr>
              <th>Faith Tree</th>
              <td>${reportFaithTree}</td>
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
                    <td class="${
                      badge.earned ? "earned" : "locked"
                    }">
                      ${
                        badge.earned
                          ? "✅ Earned"
                          : "🔒 Not Yet Earned"
                      }
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
              <td>
                ${
                  midtermUnlocked
                    ? "🔓 Unlocked"
                    : "🔒 Locked — Unlocks after Day 90"
                }
              </td>
              <td>
                ${
                  midtermScore !== null
                    ? `${midtermScore}%`
                    : "Not Taken"
                }
              </td>
            </tr>

            <tr>
              <td>Midterm Exam</td>
              <td>
                ${
                  midtermUnlocked
                    ? "🔓 Unlocked"
                    : "🔒 Locked — Unlocks after Day 90"
                }
              </td>
              <td>
                ${
                  midtermScore !== null
                    ? `${midtermScore}%`
                    : "Not Taken"
                }
              </td>
            </tr>

            <tr>
              <td>Final Review</td>
              <td>
                ${
                  finalUnlocked
                    ? "🔓 Unlocked"
                    : "🔒 Locked — Unlocks after Day 180"
                }
              </td>
              <td>
                ${
                  finalScore !== null
                    ? `${finalScore}%`
                    : "Not Taken"
                }
              </td>
            </tr>

            <tr>
              <td>Final Exam</td>
              <td>
                ${
                  finalUnlocked
                    ? "🔓 Unlocked"
                    : "🔒 Locked — Unlocks after Day 180"
                }
              </td>
              <td>
                ${
                  finalScore !== null
                    ? `${finalScore}%`
                    : "Not Taken"
                }
              </td>
            </tr>

          </table>

          <h2>📖 Course Status</h2>

          <div class="status-box">

            <strong>${reportStatus}</strong>

            <br /><br />

            <strong>Faith Foundations: The M&M Adventure</strong>

            <br />

            180 Bible lessons

            <br />

            Growing in God's Word — one day at a time!

          </div>

          <h2>📝 Parent/Teacher Notes</h2>

          <div class="notes">
          </div>

          <div class="signature">

            <div class="signature-line">
              Parent/Teacher Signature
            </div>

            <div class="signature-line">
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

    setTimeout(() => {
      reportWindow.focus();
      reportWindow.print();
    }, 500);
  }

  /* =========================
     DASHBOARD
  ========================= */

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

        {/* FAITH TREE */}

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

        {/* CURRENT PROGRESS */}

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
              {completed >= 180
                ? "Course Complete"
                : `Day ${currentDay}`}
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

        {/* EXAMS */}

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
              <strong>After Day 90</strong>
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
              <strong>After Day 180</strong>
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

        {/* COURSE STATUS */}

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

          {completed >= 180 && (
            <p>
              🎓🏆 Congratulations! All 180 Bible lessons
              are complete!
            </p>
          )}
        </section>

        {/* PRINT REPORT */}

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
            Print a clean school-style report showing
            lessons completed, progress percentage,
            Faith Tree growth, badges, exams, and
            parent/teacher notes.
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

"use client";

import { useEffect, useState } from "react";

const PARENT_PASSWORD = "M&M2026";
const STORAGE_KEY = "faithTreeCompleted";
const NOTES_KEY = "faithParentNotes";

export default function Parent() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const parentAccess = sessionStorage.getItem("parentAccess");

    if (parentAccess === "true") {
      setUnlocked(true);
    }

    const savedNotes = localStorage.getItem(NOTES_KEY);

    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;

    function loadProgress() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
          setCompleted([]);
          return;
        }

        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCompleted(parsed);
        } else {
          setCompleted([]);
        }
      } catch {
        setCompleted([]);
      }
    }

    loadProgress();

    window.addEventListener(
      "faithTreeProgressUpdated",
      loadProgress
    );

    window.addEventListener(
      "storage",
      loadProgress
    );

    return () => {
      window.removeEventListener(
        "faithTreeProgressUpdated",
        loadProgress
      );

      window.removeEventListener(
        "storage",
        loadProgress
      );
    };
  }, [unlocked]);

  function handleLogin(e) {
    e.preventDefault();

    if (password === PARENT_PASSWORD) {
      sessionStorage.setItem("parentAccess", "true");

      setUnlocked(true);
      setError("");
      setPassword("");
    } else {
      setError("❌ Incorrect password. Please try again.");
      setPassword("");
    }
  }

  function logout() {
    sessionStorage.removeItem("parentAccess");

    setUnlocked(false);
    setPassword("");
  }

  function saveNotes(value) {
    setNotes(value);
    localStorage.setItem(NOTES_KEY, value);
  }

  /*
   * IMPORTANT:
   * Your folder is app/Lessons
   * so the URL must be /Lessons
   */
  function previewLessons() {
    window.location.href = "/Lessons?parent=true";
  }

  function printReport() {
    const reportWindow = window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );

    if (!reportWindow) {
      alert(
        "Please allow pop-ups for this website so the report can open."
      );
      return;
    }

    const count = completed.length;

    const percentage = Math.min(
      100,
      Math.round((count / 180) * 100)
    );

    let tree = "🌱";
    let treeMessage = "Your faith is taking root!";

    if (count >= 180) {
      tree = "🌳🏆";
      treeMessage = "Your Faith Tree is fully grown!";
    } else if (count >= 150) {
      tree = "🌲🌳🌲";
      treeMessage = "Your Faith Tree is almost fully grown!";
    } else if (count >= 120) {
      tree = "🌳🌳🌳";
      treeMessage = "Your Faith Tree is growing strong!";
    } else if (count >= 90) {
      tree = "🌳🌳";
      treeMessage = "Your Faith Tree is growing beautifully!";
    } else if (count >= 60) {
      tree = "🌳";
      treeMessage = "Look how much your Faith Tree has grown!";
    } else if (count >= 30) {
      tree = "🌿";
      treeMessage = "Your faith is growing stronger!";
    }

    const status =
      count === 0
        ? "Not Started"
        : count >= 180
        ? "Completed"
        : "In Progress";

    const badges = [
      ["First Steps", 10],
      ["Growing Strong", 25],
      ["Faith Builder", 50],
      ["Halfway Hero", 90],
      ["Faith Champion", 135],
      ["Faith Foundations Champion", 180],
    ];

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
            margin: 0;
            padding: 35px;
          }

          .report {
            max-width: 850px;
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
            padding-bottom: 7px;
            margin-top: 30px;
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
          }

          .box {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            min-height: 70px;
          }

          .center {
            text-align: center;
          }

          .tree {
            text-align: center;
            font-size: 70px;
            margin-top: 15px;
          }

          .tree-message {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
          }

          .progress-number {
            text-align: center;
            font-size: 25px;
            font-weight: bold;
            color: #315c48;
            margin: 15px;
          }

          .progress {
            width: 100%;
            height: 25px;
            background: #ddd;
            border-radius: 20px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            width: ${percentage}%;
            background: #315c48;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
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
            font-weight: bold;
            color: #315c48;
          }

          .locked {
            color: #888;
          }

          .notes {
            border: 1px solid #999;
            border-radius: 8px;
            min-height: 160px;
            padding: 15px;
            white-space: pre-wrap;
          }

          .signature {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            margin-top: 55px;
          }

          .signature-line {
            border-bottom: 1px solid #333;
            padding-bottom: 8px;
          }

          .footer {
            text-align: center;
            margin-top: 45px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 13px;
          }

          @media print {

            body {
              padding: 0;
            }

            .report {
              max-width: none;
            }

            @page {
              margin: 0.5in;
            }

          }

        </style>

      </head>

      <body>

        <div class="report">

          <h1>🌳 Faith Foundations</h1>

          <div class="subtitle">
            <strong>The M&M Adventure</strong><br>
            Bible Curriculum Progress Report
          </div>

          <div class="info">

            <div class="box">
              <strong>Student:</strong><br><br>
              M&M
            </div>

            <div class="box">
              <strong>Grade:</strong><br><br>
              3rd Grade
            </div>

            <div class="box">
              <strong>School Year:</strong><br><br>
              2026–2027
            </div>

            <div class="box">
              <strong>Parent/Teacher:</strong><br><br>
              ______________________________
            </div>

          </div>

          <h2>📚 Course Progress</h2>

          <div class="tree">
            ${tree}
          </div>

          <div class="tree-message">
            ${treeMessage}
          </div>

          <div class="progress-number">
            ${count} / 180 Lessons Completed
          </div>

          <div class="progress">
            <div class="progress-fill"></div>
          </div>

          <p class="center">
            <strong>${percentage}% Complete</strong>
          </p>

          <table>

            <tr>
              <th>Course Status</th>
              <td>${status}</td>
            </tr>

            <tr>
              <th>Lessons Completed</th>
              <td>${count} of 180</td>
            </tr>

            <tr>
              <th>Lessons Remaining</th>
              <td>${Math.max(0, 180 - count)}</td>
            </tr>

            <tr>
              <th>Next Lesson</th>
              <td>
                ${
                  count >= 180
                    ? "Course Complete"
                    : `Day ${count + 1}`
                }
              </td>
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
                ([name, requirement]) => `
                  <tr>
                    <td>${name}</td>
                    <td>${requirement} Lessons</td>
                    <td class="${
                      count >= requirement
                        ? "earned"
                        : "locked"
                    }">
                      ${
                        count >= requirement
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
            </tr>

            <tr>
              <td>Midterm Review</td>
              <td>
                ${
                  count >= 90
                    ? "🔓 Ready"
                    : "🔒 Unlocks after Day 90"
                }
              </td>
            </tr>

            <tr>
              <td>Midterm Exam</td>
              <td>
                ${
                  count >= 90
                    ? "🔓 Ready"
                    : "🔒 Unlocks after Day 90"
                }
              </td>
            </tr>

            <tr>
              <td>Final Review</td>
              <td>
                ${
                  count >= 180
                    ? "🔓 Ready"
                    : "🔒 Unlocks after Day 180"
                }
              </td>
            </tr>

            <tr>
              <td>Final Exam</td>
              <td>
                ${
                  count >= 180
                    ? "🔓 Ready"
                    : "🔒 Unlocks after Day 180"
                }
              </td>
            </tr>

          </table>

          <h2>📝 Parent/Teacher Notes</h2>

          <div class="notes">
            ${
              notes
                ? notes
                : "No parent/teacher notes entered."
            }
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

            Faith Foundations: The M&M Adventure<br>
            Growing in God's Word — one day at a time.

          </div>

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

  const count = completed.length;

  const percentage = Math.min(
    100,
    Math.round((count / 180) * 100)
  );

  let tree = "🌱";
  let message = "Your faith is taking root!";

  if (count >= 180) {
    tree = "🌳🏆";
    message = "Your Faith Tree is fully grown!";
  } else if (count >= 150) {
    tree = "🌲🌳🌲";
    message = "Your Faith Tree is almost fully grown!";
  } else if (count >= 120) {
    tree = "🌳🌳🌳";
    message = "Your Faith Tree is growing strong!";
  } else if (count >= 90) {
    tree = "🌳🌳";
    message = "Your Faith Tree is growing beautifully!";
  } else if (count >= 60) {
    tree = "🌳";
    message = "Look how much your Faith Tree has grown!";
  } else if (count >= 30) {
    tree = "🌿";
    message = "Your faith is growing stronger!";
  }

  if (!unlocked) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f5f1e8",
          padding: "30px 20px",
          fontFamily: "Arial, sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            background: "white",
            borderRadius: "25px",
            padding: "35px 25px",
            textAlign: "center",
            boxShadow: "0 5px 25px rgba(0,0,0,.12)",
          }}
        >
          <div style={{ fontSize: "70px" }}>
            🔐
          </div>

          <h1 style={{ color: "#315c48" }}>
            Parent Dashboard
          </h1>

          <h2>Faith Foundations</h2>

          <p>
            This area is for parents only.
            <br />
            Enter the parent password to continue.
          </p>

          <form onSubmit={handleLogin}>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Parent password"
              autoComplete="off"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px",
                marginTop: "15px",
                borderRadius: "12px",
                border: "2px solid #ddd",
                fontSize: "17px",
                textAlign: "center",
              }}
            />

            {error && (
              <p
                style={{
                  color: "#b3261e",
                  fontWeight: "bold",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "16px",
                border: "none",
                borderRadius: "14px",
                background: "#315c48",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              🔓 Enter Parent Dashboard
            </button>

          </form>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              marginTop: "20px",
              border: "none",
              background: "transparent",
              color: "#315c48",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ← Back to Home
          </button>

        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px 20px 60px",
        background: "#f8f5ed",
        fontFamily: "Arial, sans-serif",
        color: "#24313a",
      }}
    >

      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >

        <header
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >

          <div style={{ fontSize: "65px" }}>
            👩‍🏫
          </div>

          <h1 style={{ color: "#315c48" }}>
            Parent Dashboard
          </h1>

          <h2>
            Faith Foundations: The M&M Adventure
          </h2>

          <p>
            Monitor your child's Bible learning journey.
          </p>

        </header>

        <section
          className="no-print"
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)",
          }}
        >

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >

            <button
              onClick={previewLessons}
              style={{
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background: "#315c48",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              👀 Preview Student Lessons
            </button>

            <button
              onClick={printReport}
              style={{
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background: "#6b9e5b",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🖨️ Print Progress Report
            </button>

            <button
              onClick={logout}
              style={{
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background: "#777",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🔒 Lock Parent Dashboard
            </button>

          </div>

        </section>

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            marginBottom: "22px",
            boxShadow: "0 4px 15px rgba(0,0,0,.1)",
          }}
        >

          <div style={{ fontSize: "75px" }}>
            {tree}
          </div>

          <h2>{message}</h2>

          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {count} / 180 Lessons Complete
          </p>

          <div
            style={{
              width: "100%",
              height: "28px",
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
              }}
            />

          </div>

          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
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
            marginBottom: "22px",
          }}
        >

          <h2>📅 Current Progress</h2>

          <p>
            📖 Next lesson:{" "}
            <strong>
              {count >= 180
                ? "Course Complete"
                : `Day ${count + 1}`}
            </strong>
          </p>

          <p>
            ⭐ Lessons completed:{" "}
            <strong>{count}</strong>
          </p>

          <p>
            📈 Lessons remaining:{" "}
            <strong>{180 - count}</strong>
          </p>

        </section>

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px",
          }}
        >

          <h2>📝 Exams & Reviews</h2>

          <p>
            📚 Midterm Review:{" "}
            <strong>
              {count >= 90
                ? "Ready!"
                : "🔒 Unlocks after Day 90"}
            </strong>
          </p>

          <p>
            📝 Midterm Exam:{" "}
            <strong>
              {count >= 90
                ? "Ready!"
                : "🔒 Unlocks after Day 90"}
            </strong>
          </p>

          <p>
            🏆 Final Review:{" "}
            <strong>
              {count >= 180
                ? "Ready!"
                : "🔒 Unlocks after Day 180"}
            </strong>
          </p>

          <p>
            🏆 Final Exam:{" "}
            <strong>
              {count >= 180
                ? "Ready!"
                : "🔒 Unlocks after Day 180"}
            </strong>
          </p>

        </section>

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px",
          }}
        >

          <h2>✅ Completed Lessons</h2>

          {completed.length === 0 ? (
            <p>No lessons completed yet.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >

              {completed.map((day) => (
                <span
                  key={day}
                  style={{
                    background: "#e9f4ed",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontWeight: "bold",
                  }}
                >
                  Day {day} ✅
                </span>
              ))}

            </div>
          )}

        </section>

        {/* REAL NOTES BOX */}

        <section
          className="no-print"
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "22px",
          }}
        >

          <h2>📝 Parent/Teacher Notes</h2>

          <p>
            Type notes here. They will automatically save
            on this device and will also appear on the
            printable report.
          </p>

          <textarea
            value={notes}
            onChange={(e) =>
              saveNotes(e.target.value)
            }
            placeholder="Enter parent/teacher notes here..."
            rows={7}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              borderRadius: "12px",
              border: "2px solid #ccc",
              fontSize: "16px",
              fontFamily: "Arial, sans-serif",
              resize: "vertical",
              background: "white",
              color: "#24313a",
            }}
          />

          <p
            style={{
              fontSize: "13px",
              color: "#666",
            }}
          >
            ✅ Notes saved automatically.
          </p>

        </section>

        <footer
          style={{
            textAlign: "center",
            padding: "20px",
          }}
        >

          <div style={{ fontSize: "55px" }}>
            🌳
          </div>

          <p style={{ fontWeight: "bold" }}>
            Every lesson helps your Faith Tree grow!
          </p>

          <p style={{ color: "#777" }}>
            Faith Foundations: The M&M Adventure
          </p>

        </footer>

      </div>

    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

const PARENT_PASSWORD = "M&M2026";
const STORAGE_KEY = "faithTreeCompleted";

export default function Parent() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const parentAccess =
      sessionStorage.getItem("parentAccess");

    if (parentAccess === "true") {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;

    function loadProgress() {
      try {
        const saved =
          localStorage.getItem(STORAGE_KEY);

        if (!saved) {
          setCompleted([]);
          return;
        }

        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCompleted(parsed);
        }
      } catch {
        setCompleted([]);
      }
    }

    loadProgress();

    function syncProgress() {
      loadProgress();
    }

    window.addEventListener(
      "faithTreeProgressUpdated",
      syncProgress
    );

    window.addEventListener(
      "storage",
      syncProgress
    );

    return () => {
      window.removeEventListener(
        "faithTreeProgressUpdated",
        syncProgress
      );

      window.removeEventListener(
        "storage",
        syncProgress
      );
    };
  }, [unlocked]);

  function handleLogin(e) {
    e.preventDefault();

    if (password === PARENT_PASSWORD) {
      sessionStorage.setItem(
        "parentAccess",
        "true"
      );

      setUnlocked(true);
      setError("");
      setPassword("");
    } else {
      setError(
        "❌ Incorrect password. Please try again."
      );

      setPassword("");
    }
  }

  function logout() {
    sessionStorage.removeItem(
      "parentAccess"
    );

    setUnlocked(false);
    setPassword("");
  }

  function printReport() {
    window.print();
  }

  function openStudentLessons() {
    window.location.href =
      "/lessons?parent=true";
  }

  const count = completed.length;

  const percentage = Math.round(
    (count / 180) * 100
  );

  let tree = "🌱";
  let message =
    "Your faith is taking root!";

  if (count >= 180) {
    tree = "🌳🏆";
    message =
      "Your Faith Tree is fully grown!";
  } else if (count >= 120) {
    tree = "🌳🌳🌳";
    message =
      "Your Faith Tree is growing strong!";
  } else if (count >= 60) {
    tree = "🌳";
    message =
      "Look how much your Faith Tree has grown!";
  }

  /* --------------------------------
     PASSWORD SCREEN
  -------------------------------- */

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
            boxShadow:
              "0 5px 25px rgba(0,0,0,.12)",
          }}
        >
          <div
            style={{
              fontSize: "70px",
            }}
          >
            🔐
          </div>

          <h1
            style={{
              color: "#315c48",
            }}
          >
            Parent Dashboard
          </h1>

          <h2
            style={{
              fontSize: "20px",
              color: "#555",
            }}
          >
            Faith Foundations
          </h2>

          <p
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
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

  /* --------------------------------
     PARENT DASHBOARD
  -------------------------------- */

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
          <div
            style={{
              fontSize: "65px",
            }}
          >
            👩‍🏫
          </div>

          <h1
            style={{
              color: "#315c48",
            }}
          >
            Parent Dashboard
          </h1>

          <h2>
            Faith Foundations: The M&M Adventure
          </h2>

          <p>
            Monitor your child's Bible learning
            journey.
          </p>
        </header>

        {/* BUTTONS */}

        <section
          className="no-print"
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            <button
              onClick={openStudentLessons}
              style={{
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background: "#315c48",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
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
              }}
            >
              🔒 Lock Parent Dashboard
            </button>
          </div>
        </section>

        {/* REPORT */}

        <div id="printReport">
          <section
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "20px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,.12)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#315c48",
              }}
            >
              📋 Student Progress Report
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "15px",
              }}
            >
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <strong>Student:</strong>
                <br />
                M&M
              </div>

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <strong>Course:</strong>
                <br />
                Faith Foundations
              </div>

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <strong>Total Lessons:</strong>
                <br />
                180
              </div>

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <strong>Completed:</strong>
                <br />
                {count}
              </div>
            </div>
          </section>

          {/* TREE */}

          <section
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "25px",
              textAlign: "center",
              marginBottom: "20px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,.12)",
            }}
          >
            <div
              style={{
                fontSize: "70px",
              }}
            >
              {tree}
            </div>

            <h2>{message}</h2>

            <p
              style={{
                fontSize: "22px",
              }}
            >
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
                }}
              />
            </div>

            <p
              style={{
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {percentage}% Complete
            </p>
          </section>

          {/* COURSE PROGRESS */}

          <section
            style={{
              background: "#fff4df",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "20px",
            }}
          >
            <h2>📚 Course Progress</h2>

            <p>
              📖 Bible Lessons:{" "}
              <strong>
                {count} / 180
              </strong>
            </p>

            <p>
              📝 Midterm Review:{" "}
              <strong>
                {count >= 88
                  ? "Ready!"
                  : "Not yet unlocked"}
              </strong>
            </p>

            <p>
              📝 Midterm Exam:{" "}
              <strong>
                {count >= 89
                  ? "Ready!"
                  : "Not yet unlocked"}
              </strong>
            </p>

            <p>
              🏆 Final Review:{" "}
              <strong>
                {count >= 178
                  ? "Ready!"
                  : "Not yet unlocked"}
              </strong>
            </p>

            <p>
              🏆 Final Exam:{" "}
              <strong>
                {count >= 179
                  ? "Ready!"
                  : "Not yet unlocked"}
              </strong>
            </p>
          </section>

          {/* COMPLETED DAYS */}

          <section
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                textAlign: "center",
              }}
            >
              ✅ Completed Lessons
            </h2>

            {completed.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                }}
              >
                No lessons completed yet.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
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

          {/* PARENT NOTES */}

          <section
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "20px",
            }}
          >
            <h2>📝 Parent Notes</h2>

            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                minHeight: "120px",
                padding: "15px",
                background: "#fafafa",
              }}
            >
              Write notes here after printing.
            </div>
          </section>

          <footer
            style={{
              textAlign: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "55px",
              }}
            >
              🌳
            </div>

            <p
              style={{
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Every lesson helps your Faith Tree
              grow!
            </p>

            <p
              style={{
                color: "#777",
              }}
            >
              Faith Foundations: The M&M Adventure
            </p>
          </footer>
        </div>
      </div>

      {/* PRINTING */}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          main {
            background: white !important;
            padding: 0 !important;
          }

          section {
            box-shadow: none !important;
            break-inside: avoid;
          }

          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </main>
  );
}

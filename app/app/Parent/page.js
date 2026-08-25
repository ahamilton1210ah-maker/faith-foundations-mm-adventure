"use client";

import { useEffect, useState } from "react";

const PARENT_PIN = "7777";
const PARENT_LOGIN_KEY = "faithParentLoggedIn";

export default function Parent() {
  const [completed, setCompleted] = useState([]);
  const [pin, setPin] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if parent is already logged in on this device
    const parentLoggedIn =
      localStorage.getItem(PARENT_LOGIN_KEY);

    if (parentLoggedIn === "true") {
      setLoggedIn(true);
    }

    // Load student progress
    const saved = localStorage.getItem(
      "faithTreeCompleted"
    );

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
  }, []);

  function handleLogin() {
    if (pin === PARENT_PIN) {
      localStorage.setItem(
        PARENT_LOGIN_KEY,
        "true"
      );

      setLoggedIn(true);
      setError("");
      setPin("");
    } else {
      setError("❌ Incorrect PIN. Please try again.");
      setPin("");
    }
  }

  function logout() {
    localStorage.removeItem(PARENT_LOGIN_KEY);
    setLoggedIn(false);
  }

  // =========================
  // PARENT LOGIN SCREEN
  // =========================

  if (!loggedIn) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "30px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f5ed",
          fontFamily: "Arial, sans-serif",
          color: "#24313a",
        }}
      >
        <div
          style={{
            background: "white",
            width: "100%",
            maxWidth: "450px",
            borderRadius: "25px",
            padding: "35px 25px",
            textAlign: "center",
            boxShadow:
              "0 5px 20px rgba(0,0,0,.12)",
          }}
        >
          <div
            style={{
              fontSize: "65px",
              marginBottom: "10px",
            }}
          >
            🔐
          </div>

          <h1
            style={{
              color: "#315c48",
              marginBottom: "8px",
            }}
          >
            Parent Login
          </h1>

          <h2
            style={{
              fontSize: "20px",
              marginTop: "5px",
            }}
          >
            🌳 Faith Foundations
          </h2>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              marginTop: "20px",
            }}
          >
            This area is for parents only.
            <br />
            Enter your Parent PIN to continue.
          </p>

          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            placeholder="Enter Parent PIN"
            maxLength={10}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "14px",
              border: "2px solid #ddd",
              fontSize: "20px",
              textAlign: "center",
              letterSpacing: "5px",
            }}
          />

          {error && (
            <p
              style={{
                color: "#b42318",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "16px",
              border: "none",
              borderRadius: "16px",
              background: "#315c48",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔓 Enter Parent Dashboard
          </button>

          <p
            style={{
              marginTop: "25px",
              fontSize: "14px",
              color: "#777",
            }}
          >
            Parents only ❤️
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // PARENT DASHBOARD
  // =========================

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
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={logout}
            style={{
              padding: "10px 15px",
              border: "none",
              borderRadius: "12px",
              background: "#777",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔒 Lock Dashboard
          </button>
        </div>

        <div
          style={{
            marginTop: "15px",
          }}
        >
          <div style={{ fontSize: "60px" }}>
            🌳
          </div>

          <h1
            style={{
              color: "#315c48",
              margin: "5px 0",
            }}
          >
            👩‍🏫 Parent Dashboard
          </h1>

          <h2
            style={{
              fontSize: "21px",
            }}
          >
            Faith Foundations: The M&M Adventure
          </h2>

          <p>
            Monitor your student's Bible
            learning journey.
          </p>
        </div>

        {/* FAITH TREE */}

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            margin: "25px auto",
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
                transition: "width .5s",
              }}
            />
          </div>

          <p
            style={{
              fontSize: "18px",
              marginTop: "12px",
              fontWeight: "bold",
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
          }}
        >
          <h2>📚 Course Progress</h2>

          <p
            style={{
              fontSize: "18px",
            }}
          >
            📖 Bible Lessons: {count} / 180
          </p>

          <p
            style={{
              fontSize: "18px",
            }}
          >
            📝 Midterm Review:{" "}
            {count >= 88
              ? "✅ Ready!"
              : "🔒 Keep learning"}
          </p>

          <p
            style={{
              fontSize: "18px",
            }}
          >
            📝 Midterm Exam:{" "}
            {count >= 89
              ? "✅ Ready!"
              : "🔒 Keep learning"}
          </p>

          <p
            style={{
              fontSize: "18px",
            }}
          >
            🏆 Final Review:{" "}
            {count >= 178
              ? "✅ Ready!"
              : "🔒 Keep learning"}
          </p>

          <p
            style={{
              fontSize: "18px",
            }}
          >
            🏆 Final Exam:{" "}
            {count >= 179
              ? "✅ Ready!"
              : "🔒 Keep learning"}
          </p>
        </div>

        {/* QUICK LINKS */}

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginTop: "20px",
          }}
        >
          <h2>📊 Parent Tools</h2>

          <button
            onClick={() =>
              (window.location.href =
                "/Lessons?parent=true")
            }
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "10px",
              border: "none",
              borderRadius: "14px",
              background: "#315c48",
              color: "white",
              fontSize: "17px",
              fontWeight: "bold",
            }}
          >
            👀 Preview Lessons
          </button>

          <button
            onClick={() =>
              window.print()
            }
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "10px",
              border: "none",
              borderRadius: "14px",
              background: "#6b9e5b",
              color: "white",
              fontSize: "17px",
              fontWeight: "bold",
            }}
          >
            🖨️ Print Progress Report
          </button>
        </div>

        <p
          style={{
            marginTop: "30px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          🌳 Every lesson helps your Faith
          Tree grow!
        </p>

        <p
          style={{
            fontSize: "15px",
            color: "#777",
          }}
        >
          Keep encouraging your student
          along the way. ❤️
        </p>
      </div>
    </main>
  );
}

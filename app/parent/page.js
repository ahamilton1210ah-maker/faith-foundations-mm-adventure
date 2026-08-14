"use client";

import { useState } from "react";

export default function ParentProgress() {
  const [completedDays, setCompletedDays] = useState("");
  const [grade, setGrade] = useState("");
  const [notes, setNotes] = useState("");

  const completed = Math.max(
    0,
    Math.min(180, Number(completedDays) || 0)
  );

  const percentage = Math.round((completed / 180) * 100);

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
          maxWidth: "800px",
          margin: "0 auto"
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "25px"
          }}
        >
          <div style={{ fontSize: "60px" }}>👩‍🏫🌳</div>

          <h1
            style={{
              color: "#315c48",
              marginBottom: "5px"
            }}
          >
            Parent Progress
          </h1>

          <p>
            Faith Foundations: The M&M Adventure
          </p>
        </header>

        <section
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <h2>📊 Student Progress</h2>

          <label
            style={{
              display: "block",
              marginTop: "18px",
              fontWeight: "bold"
            }}
          >
            Completed Bible Days
          </label>

          <input
            type="number"
            min="0"
            max="180"
            value={completedDays}
            onChange={(e) => setCompletedDays(e.target.value)}
            placeholder="Example: 45"
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "8px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "17px",
              boxSizing: "border-box"
            }}
          />

          <div
            style={{
              marginTop: "20px",
              background: "#e9f4ed",
              borderRadius: "15px",
              padding: "18px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "42px" }}>
              {percentage >= 100
                ? "🏆"
                : percentage >= 75
                ? "🌲"
                : percentage >= 50
                ? "🌳"
                : percentage >= 25
                ? "🌿"
                : "🌱"}
            </div>

            <h3>
              {completed} / 180 Days
            </h3>

            <p>{percentage}% Complete</p>

            <div
              style={{
                height: "18px",
                background: "#ddd",
                borderRadius: "20px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  background: "#6b9e5b",
                  transition: "width .3s"
                }}
              />
            </div>
          </div>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <h2>📝 Grade</h2>

          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "17px"
            }}
          >
            <option value="">Select Grade</option>
            <option>A — Excellent</option>
            <option>B — Very Good</option>
            <option>C — Good</option>
            <option>D — Needs Improvement</option>
            <option>Incomplete</option>
          </select>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <h2>✏️ Parent Notes</h2>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write notes about the student's progress..."
            rows="7"
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
              boxSizing: "border-box",
              resize: "vertical"
            }}
          />
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <h2>🏆 Course Status</h2>

          <p>
            {completed === 180
              ? "🎉 The entire 180-day Bible course is complete!"
              : `Keep going! ${180 - completed} lesson${
                  180 - completed === 1 ? "" : "s"
                } remaining.`}
          </p>
        </section>

        <button
          onClick={printReport}
          style={{
            width: "100%",
            padding: "17px",
            border: "none",
            borderRadius: "15px",
            background: "#315c48",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          🖨️ Print Progress Report
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            fontSize: "14px"
          }}
        >
          Faith Foundations: The M&M Adventure
        </p>
      </div>
    </main>
  );
}

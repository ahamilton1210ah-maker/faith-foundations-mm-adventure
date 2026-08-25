"use client";

import { useEffect, useState } from "react";

const PARENT_PASSWORD = "M&M2026";

export default function Parent() {
const [password, setPassword] = useState("");
const [unlocked, setUnlocked] = useState(false);
const [completed, setCompleted] = useState([]);

useEffect(() => {
const parentAccess =
sessionStorage.getItem("parentAccess");

```
if (parentAccess === "true") {
  setUnlocked(true);
}
```

}, []);

useEffect(() => {
if (!unlocked) return;

```
function loadProgress() {
  try {
    const saved =
      localStorage.getItem("faithTreeCompleted");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setCompleted(parsed);
      }
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
```

}, [unlocked]);

function handleLogin(e) {
e.preventDefault();

```
if (password === PARENT_PASSWORD) {
  sessionStorage.setItem(
    "parentAccess",
    "true"
  );

  setUnlocked(true);
  setPassword("");
} else {
  alert("❌ Incorrect parent password.");
  setPassword("");
}
```

}

function logout() {
sessionStorage.removeItem("parentAccess");
setUnlocked(false);
}

if (!unlocked) {
return (
<main
style={{
minHeight: "100vh",
padding: "30px 20px",
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "#f8f5ed",
fontFamily: "Arial, sans-serif",
}}
>
<div
style={{
background: "white",
borderRadius: "25px",
padding: "35px 25px",
width: "100%",
maxWidth: "450px",
textAlign: "center",
boxShadow:
"0 5px 20px rgba(0,0,0,.12)",
}}
>
<div style={{ fontSize: "65px" }}>
🌳 </div>

```
      <h1
        style={{
          color: "#315c48",
          marginBottom: "8px",
        }}
      >
        Parent Dashboard
      </h1>

      <h2
        style={{
          fontSize: "20px",
          marginTop: "5px",
        }}
      >
        Faith Foundations
      </h2>

      <p
        style={{
          fontSize: "17px",
          marginTop: "20px",
          lineHeight: "1.5",
        }}
      >
        🔐 This area is for parents only.
      </p>

      <form onSubmit={handleLogin}>
        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Enter parent password"
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

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "15px",
            border: "none",
            borderRadius: "14px",
            background: "#315c48",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🔓 Enter Parent Dashboard
        </button>
      </form>

      <p
        style={{
          marginTop: "20px",
          fontSize: "14px",
          color: "#777",
        }}
      >
        Parent access is protected by a password.
      </p>
    </div>
  </main>
);
```

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

return (
<main
style={{
minHeight: "100vh",
padding: "30px 20px 60px",
textAlign: "center",
background: "#f8f5ed",
fontFamily: "Arial, sans-serif",
}}
>
<div
style={{
maxWidth: "700px",
margin: "0 auto",
}}
>
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
borderRadius: "10px",
background: "#777",
color: "white",
fontWeight: "bold",
}}
>
🔒 Lock Dashboard </button> </div>

```
    <h1>👩‍🏫 Parent Dashboard</h1>

    <h2>
      Faith Foundations: The M&M Adventure
    </h2>

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

      <p style={{ fontSize: "22px" }}>
        <strong>{count}</strong> / 180 lessons
        completed
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

    <div
      style={{
        background: "#fff4df",
        borderRadius: "20px",
        padding: "25px",
        margin: "20px auto",
      }}
    >
      <h2>📚 Course Progress</h2>

      <p>
        📖 Bible Lessons: {count} / 180
      </p>

      <p>
        📝 Midterm:
        {" "}
        {count >= 89
          ? "Ready!"
          : "Keep completing lessons"}
      </p>

      <p>
        🏆 Final:
        {" "}
        {count >= 180
          ? "Ready!"
          : "Complete all 180 lessons"}
      </p>
    </div>

    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "25px",
        marginTop: "20px",
      }}
    >
      <h2>🌱 Parent Information</h2>

      <p>
        The student has completed{" "}
        <strong>{count}</strong> of 180 lessons.
      </p>

      <p>
        Keep encouraging them to read God's Word,
        complete their activities, and grow in faith.
      </p>
    </div>

    <p
      style={{
        marginTop: "30px",
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      🌳 Every lesson helps the Faith Tree grow!
    </p>
  </div>
</main>
```

);
}

"use client";
const lesson = {
  day: 1,
  title: "God Creates the World",
  bibleReference: "Genesis 1",
  theme: "God is the Creator",
  memoryVerse:
    "In the beginning God created the heaven and the earth. — Genesis 1:1",
  lesson:
    "God created the world and everything in it. He made the light, sky, land, plants, animals, and people. Everything God made was good. God also made you special and loves you very much.",
  activity:
    "Go outside and find five things God created. Draw a picture of your favorite one.",
  kindnessMission:
    "Tell someone today one thing you are thankful God created.",
  prayer:
    "Dear God, thank You for creating this beautiful world and for creating me. Help me remember that You love me. Amen.",
};

export default function Lessons() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f1e8",
        padding: "30px 20px 50px",
        fontFamily: "Arial, sans-serif",
        color: "#3d4b35",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "60px" }}>🌳</div>

          <p style={{ fontWeight: "bold" }}>DAY {lesson.day}</p>

          <h1>{lesson.title}</h1>

          <p style={{ fontSize: "18px" }}>
            📖 {lesson.bibleReference}
          </p>
        </div>

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "25px",
            marginTop: "25px",
          }}
        >
          <h2>⭐ Today's Theme</h2>
          <p>{lesson.theme}</p>

          <h2>📖 Let's Learn</h2>
          <p style={{ lineHeight: "1.7" }}>{lesson.lesson}</p>

          <h2>💡 Memory Verse</h2>
          <p
            style={{
              background: "#eef7e9",
              padding: "18px",
              borderRadius: "15px",
              lineHeight: "1.6",
            }}
          >
            {lesson.memoryVerse}
          </p>

          <h2>🎨 Today's Activity</h2>
          <p style={{ lineHeight: "1.7" }}>{lesson.activity}</p>

          <h2>💚 Kindness Mission</h2>
          <p style={{ lineHeight: "1.7" }}>
            {lesson.kindnessMission}
          </p>

          <h2>🙏 Today's Prayer</h2>
          <p style={{ lineHeight: "1.7" }}>{lesson.prayer}</p>

          <button
onClick={() => alert("🎉 Great job! You completed Day 1! 🌱")}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "16px",
              border: "none",
              borderRadius: "16px",
              background: "#6b9e5b",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            🌱 Complete Day 1
          </button>
        </section>
      </div>
    </main>
  );
}

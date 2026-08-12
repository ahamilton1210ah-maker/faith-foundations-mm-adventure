"use client";

import { useState } from "react";

const themes = [
  ["God Created the World", "Genesis 1", "God is the Creator"],
  ["God Made Me Special", "Psalm 139:13-14", "God made each person wonderfully"],
  ["Noah Obeyed God", "Genesis 6-9", "Obedience matters"],
  ["Abraham Trusted God", "Genesis 12:1-9", "Trust God even when you cannot see the whole plan"],
  ["Isaac and God's Promise", "Genesis 21", "God keeps His promises"],
  ["Jacob Learns to Trust God", "Genesis 28", "God is with us wherever we go"],
  ["Joseph Forgives", "Genesis 37-50", "God can use hard things for good"],
  ["Moses Is Called", "Exodus 3", "God can use ordinary people"],
  ["God Leads His People", "Exodus 13-14", "God makes a way"],
  ["The Ten Commandments", "Exodus 20", "God teaches us how to live"],
  ["Joshua Is Courageous", "Joshua 1", "Be strong and courageous"],
  ["Rahab Helps God's People", "Joshua 2", "Courage and faith go together"],
  ["Ruth Is Faithful", "Ruth 1-4", "Faithfulness matters"],
  ["Samuel Listens to God", "1 Samuel 3", "Listen when God speaks"],
  ["David Has Courage", "1 Samuel 17", "God is bigger than our problems"],
  ["David Shows Kindness", "1 Samuel 24", "Choose kindness"],
  ["Solomon Asks for Wisdom", "1 Kings 3", "Wisdom is more valuable than riches"],
  ["Elijah Trusts God", "1 Kings 17-18", "God provides"],
  ["Daniel Prays", "Daniel 6", "Keep praying"],
  ["Shadrach, Meshach and Abednego", "Daniel 3", "Stand for what is right"],
  ["Esther Is Brave", "Esther 4-7", "God can give us courage"],
  ["Jonah Learns Obedience", "Jonah 1-4", "We should obey God"],
  ["God's Love", "Psalm 136", "God's love never fails"],
  ["God Is Our Shepherd", "Psalm 23", "God cares for us"],
  ["God Gives Wisdom", "Proverbs 2", "Ask God for wisdom"],
  ["A Servant's Heart", "Mark 10:35-45", "Greatness means serving others"],
  ["Jesus Loves Children", "Mark 10:13-16", "Jesus loves children"],
  ["Jesus Calms the Storm", "Mark 4:35-41", "Trust Jesus when you are afraid"],
  ["Jesus Feeds the Five Thousand", "John 6:1-14", "God can use what we give Him"],
  ["The Good Samaritan", "Luke 10:25-37", "Love your neighbor"],
  ["The Lost Sheep", "Luke 15:1-7", "God cares about every person"],
  ["The Prodigal Son", "Luke 15:11-32", "God forgives"],
  ["Jesus Is Born", "Luke 2:1-20", "Jesus is God's gift"],
  ["Jesus Is Risen", "Matthew 28:1-10", "Jesus is alive"],
  ["The Great Commission", "Matthew 28:18-20", "Tell others about Jesus"],
  ["The Early Church", "Acts 2:42-47", "Believers grow together"],
  ["Paul's Conversion", "Acts 9:1-22", "God can change hearts"],
  ["The Fruit of the Spirit", "Galatians 5:22-23", "Let God's Spirit grow good fruit"],
  ["The Armor of God", "Ephesians 6:10-18", "God gives us spiritual protection"],
  ["The Love Chapter", "1 Corinthians 13", "Love is patient and kind"],
  ["Be Kind", "Ephesians 4:32", "Kindness reflects God's love"],
  ["Be Thankful", "1 Thessalonians 5:18", "Give thanks in every situation"],
  ["Pray Always", "1 Thessalonians 5:17", "Prayer keeps us close to God"],
  ["Shine for Jesus", "Matthew 5:14-16", "Let your light shine"],
  ["Finish Strong", "Philippians 3:13-14", "Keep growing in faith"]
];

const lessonTypes = [
  {
    title: "Learn",
    activity: "Read the Bible passage with a parent. Talk about what happened and what it teaches us about God.",
  },
  {
    title: "Explore",
    activity: "Draw a picture of today's Bible story. Label three things you learned from the passage.",
  },
  {
    title: "Practice",
    activity: "Choose one lesson from today's Bible story and practice it at home today.",
  },
  {
    title: "Live It",
    activity: "Tell someone in your family what you learned. Then find one way to live out today's lesson.",
  }
];

const days = Array.from({ length: 180 }, (_, index) => {
  const day = index + 1;
  const week = Math.floor(index / 4);
  const dayOfWeek = index % 4;
  const theme = themes[week % themes.length];
  const type = lessonTypes[dayOfWeek];

  return {
    day,
    title: theme[0],
    bibleReference: theme[1],
    theme: theme[2],
    lessonType: type.title,
    lesson: `Today we are learning about ${theme[0].toLowerCase()}. Read ${theme[1]} in your KJV Bible. Think about what this passage teaches us about God and how you can apply it to your life.`,
    activity: type.activity,
    memoryVerse: `Today's memory passage: ${theme[1]}`,
    kindnessMission:
      dayOfWeek === 0
        ? "Do one helpful thing for someone without being asked."
        : dayOfWeek === 1
        ? "Give someone a genuine compliment today."
        : dayOfWeek === 2
        ? "Help with a household job with a cheerful attitude."
        : "Pray for someone who needs encouragement.",
    prayer: `Dear God, thank You for teaching me through Your Word. Help me remember what I learned today and live in a way that honors You. Give me wisdom, courage, kindness, and a heart that wants to follow You. In Jesus' name, Amen.`
  };
});

export default function Lessons() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completed, setCompleted] = useState([]);

  const lesson = days[currentDay - 1];
  const isCompleted = completed.includes(currentDay);

  function toggleComplete() {
    if (isCompleted) {
      setCompleted(completed.filter((day) => day !== currentDay));
    } else {
      setCompleted([...completed, currentDay]);
    }
  }

  function previousDay() {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function nextDay() {
    if (currentDay < 180) {
      setCurrentDay(currentDay + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f1e8",
        padding: "25px 15px 60px",
        fontFamily: "Arial, sans-serif",
        color: "#24313a"
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto"
        }}
      >
        <header
          style={{
            textAlign: "center",
            padding: "25px 10px"
          }}
        >
          <div style={{ fontSize: "58px" }}>🌳</div>

          <h1
            style={{
              fontSize: "36px",
              margin: "5px 0",
              color: "#315c48"
            }}
          >
            Faith Foundations
          </h1>

          <h2
            style={{
              fontSize: "23px",
              margin: "5px 0 10px"
            }}
          >
            The M&M Adventure
          </h2>

          <p style={{ fontSize: "17px" }}>
            Growing in God's Word — one day at a time!
          </p>
        </header>

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "22px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <button
              onClick={previousDay}
              disabled={currentDay === 1}
              style={{
                padding: "10px 15px",
                borderRadius: "12px",
                border: "none",
                background: currentDay === 1 ? "#ddd" : "#315c48",
                color: "white",
                fontWeight: "bold"
              }}
            >
              ← Previous
            </button>

            <strong style={{ fontSize: "18px" }}>
              Day {currentDay} of 180
            </strong>

            <button
              onClick={nextDay}
              disabled={currentDay === 180}
              style={{
                padding: "10px 15px",
                borderRadius: "12px",
                border: "none",
                background: currentDay === 180 ? "#ddd" : "#315c48",
                color: "white",
                fontWeight: "bold"
              }}
            >
              Next →
            </button>
          </div>

          <div
            style={{
              marginTop: "18px",
              background: "#e9f4ed",
              borderRadius: "15px",
              padding: "12px",
              textAlign: "center"
            }}
          >
            <label>
              <strong>Jump to a day: </strong>
              <select
                value={currentDay}
                onChange={(e) => setCurrentDay(Number(e.target.value))}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              >
                {days.map((item) => (
                  <option key={item.day} value={item.day}>
                    Day {item.day}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <div
            style={{
              textAlign: "center",
              background: "#e9f4ed",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "22px"
            }}
          >
            <div style={{ fontSize: "50px" }}>📖</div>

            <p
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                margin: "5px"
              }}
            >
              DAY {lesson.day}
            </p>

            <h1
              style={{
                fontSize: "30px",
                margin: "8px 0"
              }}
            >
              {lesson.title}
            </h1>

            <p style={{ fontSize: "19px", margin: "5px" }}>
              📖 {lesson.bibleReference}
            </p>
          </div>

          <section
            style={{
              background: "#fffaf0",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "18px"
            }}
          >
            <h2>⭐ Today's Theme</h2>
            <p style={{ fontSize: "18px" }}>{lesson.theme}</p>
          </section>

          <section style={{ marginBottom: "18px" }}>
            <h2>📚 Let's Learn</h2>
            <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
              {lesson.lesson}
            </p>
          </section>

          <section
            style={{
              background: "#f0f7ff",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "18px"
            }}
          >
            <h2>✏️ Today's Activity</h2>
            <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
              {lesson.activity}
            </p>
          </section>

          <section
            style={{
              background: "#eef7e9",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "18px"
            }}
          >
            <h2>💡 Memory Verse</h2>
            <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
              {lesson.memoryVerse}
            </p>
            <p style={{ fontSize: "15px" }}>
              Read the passage in your KJV Bible and practice remembering it.
            </p>
          </section>

          <section
            style={{
              background: "#fff4e8",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "18px"
            }}
          >
            <h2>💚 Kindness Mission</h2>
            <p style={{ fontSize: "18px" }}>{lesson.kindnessMission}</p>
          </section>

          <section
            style={{
              background: "#f5f0ff",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "22px"
            }}
          >
            <h2>🙏 Prayer</h2>
            <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
              {lesson.prayer}
            </p>
          </section>

          <button
          onClick={() => {
  toggleComplete();
  if (!isCompleted) {
    alert(
      lesson.day === 180
        ? "🎉 YOU DID IT! 🎉\n\n🏆 All 180 Bible lessons are complete!\n🌳 Your Faith Tree has fully grown!"
        : `🎉 Congratulations! 🎉\n\nDay ${lesson.day} Complete!\n🌳 Your Faith Tree is growing!\n⭐ Keep going — you're doing great!`
    );
  }
}}
            style={{
              width: "100%",
              padding: "17px",
              border: "none",
              borderRadius: "16px",
              background: isCompleted ? "#315c48" : "#6b9e5b",
              color: "white",
              fontSize: "19px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {isCompleted
              ? "✅ Day Completed!"
              : "🌱 Complete Day " + lesson.day}
          </button>
        </section>

        <footer
          style={{
            textAlign: "center",
            marginTop: "25px",
            fontSize: "15px"
          }}
        >
          <p>🌳 Every lesson helps your Faith Tree grow!</p>
          <p>
            Completed: {completed.length} / 180 days
          </p>
        </footer>
      </div>
    </main>
  );
}

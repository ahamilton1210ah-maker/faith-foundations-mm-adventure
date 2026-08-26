"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "faithTreeCompleted";

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

const lessonTypes = ["Learn", "Explore", "Practice", "Live It"];

const days = Array.from({ length: 180 }, (_, index) => {
  const day = index + 1;

  if (day === 88) {
    return {
      day,
      title: "Midterm Review",
      bibleReference: "Review Days 1–87",
      theme: "Look back at everything you have learned!",
      lessonType: "Review",
      lesson:
        "Today we review the Bible stories, truths, memory passages, and faith lessons from the first half of our adventure.",
      activity:
        "Ask a parent to review your favorite Bible stories with you. Tell them three things you remember learning about God.",
      memoryVerse:
        "Choose your favorite memory passage from Days 1–87.",
      kindnessMission:
        "Encourage someone by telling them something kind about them.",
      prayer:
        "Dear God, thank You for everything I have learned. Help me remember Your Word and continue growing in faith. Amen."
    };
  }

  if (day === 89) {
    return {
      day,
      title: "Midterm Exam",
      bibleReference: "Review Days 1–88",
      theme: "Show what you have learned!",
      lessonType: "Exam",
      lesson:
        "Today is your midterm Bible exam. Do your best and remember that learning God's Word is more important than getting every answer perfect.",
      activity:
        "Complete your parent-provided midterm exam or review questions.",
      memoryVerse:
        "Choose one memory passage to recite to your parent.",
      kindnessMission:
        "Thank someone who has helped you learn.",
      prayer:
        "Dear God, please help me remember what I have learned and do my very best. Thank You for helping me grow. Amen."
    };
  }

  if (day === 178) {
    return {
      day,
      title: "Final Review",
      bibleReference: "Review Days 1–177",
      theme: "Look how far you have come!",
      lessonType: "Review",
      lesson:
        "Today we review the most important lessons from our entire Faith Foundations adventure.",
      activity:
        "Choose your three favorite Bible stories and explain what each one taught you about God.",
      memoryVerse:
        "Choose your favorite memory passage from the entire course.",
      kindnessMission:
        "Encourage someone who is still learning.",
      prayer:
        "Dear God, thank You for carrying me through this journey. Help me keep Your Word in my heart. Amen."
    };
  }

  if (day === 179) {
    return {
      day,
      title: "Final Exam",
      bibleReference: "Review Days 1–178",
      theme: "You are almost there!",
      lessonType: "Final Exam",
      lesson:
        "Today is your final Bible exam. Remember everything you have learned and do your very best.",
      activity:
        "Complete your parent-provided final exam or review questions.",
      memoryVerse:
        "Recite your favorite memory verse to your parent.",
      kindnessMission:
        "Celebrate someone else's accomplishment today.",
      prayer:
        "Dear God, thank You for helping me learn Your Word. Help me continue following You every day. Amen."
    };
  }

  if (day === 180) {
    return {
      day,
      title: "YOU DID IT!",
      bibleReference: "Philippians 3:13-14",
      theme: "Keep growing in faith!",
      lessonType: "Celebration",
      lesson:
        "You completed all 180 Bible lessons! Your Faith Foundations adventure is complete, but your journey with God continues every day.",
      activity:
        "Celebrate with your family. Share your favorite lesson, favorite memory verse, and one way you want to keep growing in faith.",
      memoryVerse:
        "Philippians 3:14 — Press toward the mark for the prize of the high calling of God in Christ Jesus.",
      kindnessMission:
        "Celebrate someone else and encourage them to keep growing too.",
      prayer:
        "Dear God, thank You for helping me complete my 180 Bible lessons. Help me keep reading Your Word, praying, obeying You, and growing in faith. In Jesus' name, Amen."
    };
  }

  const week = Math.floor(index / 4);
  const dayOfWeek = index % 4;
  const theme = themes[week % themes.length];

  return {
    day,
    title: theme[0],
    bibleReference: theme[1],
    theme: theme[2],
    lessonType: lessonTypes[dayOfWeek],

    lesson:
      `Today we are learning about ${theme[0].toLowerCase()}. Read ${theme[1]} in your KJV Bible. Think about what this passage teaches us about God and how you can apply it to your life.`,

    activity:
      dayOfWeek === 0
        ? `Read ${theme[1]} in your KJV Bible with a parent. Talk about what happened and what it teaches us about God.`
        : dayOfWeek === 1
        ? `Draw a picture about ${theme[0]}. Label three things you learned from today's Bible passage.`
        : dayOfWeek === 2
        ? `Choose one lesson from ${theme[0]} and practice it today. Tell your parent how you put God's Word into action.`
        : `Tell someone what you learned about ${theme[0]}. Then find one way to live out today's Bible lesson.`,

    memoryVerse:
      `Read ${theme[1]} in your KJV Bible and choose one verse or truth from the passage to remember.`,

    kindnessMission:
      dayOfWeek === 0
        ? "Do one helpful thing for someone without being asked."
        : dayOfWeek === 1
        ? "Give someone a genuine compliment today."
        : dayOfWeek === 2
        ? "Help with a household job with a cheerful attitude."
        : "Pray for someone who needs encouragement.",

    prayer:
      `Dear God, thank You for teaching me through Your Word. Help me remember what I learned today and live in a way that honors You. Give me wisdom, courage, kindness, and a heart that wants to follow You. In Jesus' name, Amen.`
  };
});

const badges = [
  ["🌱", "First Steps", 10],
  ["🌿", "Growing Strong", 25],
  ["🌳", "Faith Builder", 50],
  ["🏆", "Halfway Hero", 90],
  ["⭐", "Faith Champion", 135],
  ["🏆", "Faith Foundations Champion", 180]
];

function getCompleted() {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const data = JSON.parse(saved);

    if (!Array.isArray(data)) return [];

    return [...new Set(
      data
        .map(Number)
        .filter(
          n =>
            Number.isInteger(n) &&
            n >= 1 &&
            n <= 180
        )
    )].sort((a, b) => a - b);
  } catch {
    return [];
  }
}

function saveCompleted(list) {
  if (typeof window === "undefined") return;

  const clean = [...new Set(list)].sort((a, b) => a - b);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(clean)
  );

  window.dispatchEvent(
    new CustomEvent("faithTreeProgressUpdated")
  );
}

export default function Lessons() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [parentPreview, setParentPreview] = useState(false);

  useEffect(() => {
    setCompleted(getCompleted());

    const params = new URLSearchParams(
      window.location.search
    );

    setParentPreview(
      params.get("parent") === "true"
    );
  }, []);

  useEffect(() => {
    const update = () => {
      setCompleted(getCompleted());
    };

    window.addEventListener(
      "faithTreeProgressUpdated",
      update
    );

    window.addEventListener(
      "storage",
      update
    );

    return () => {
      window.removeEventListener(
        "faithTreeProgressUpdated",
        update
      );

      window.removeEventListener(
        "storage",
        update
      );
    };
  }, []);

  const lesson = days[currentDay - 1];
  const isCompleted =
    completed.includes(currentDay);

  const percentage = Math.round(
    (completed.length / 180) * 100
  );

  function completeLesson() {
    if (parentPreview) return;

    if (isCompleted) return;

    const updated = [...completed, currentDay]
      .filter(
        (value, index, array) =>
          array.indexOf(value) === index
      )
      .sort((a, b) => a - b);

    setCompleted(updated);
    saveCompleted(updated);

    let message =
      `🎉 Congratulations! 🎉\n\n` +
      `Day ${currentDay} Complete!\n\n` +
      `🌳 Your Faith Tree is growing!\n\n` +
      `${updated.length} of 180 lessons completed!`;

    if (updated.length === 10) {
      message =
        `🌱 AMAZING! 🌱\n\n` +
        `You completed 10 Bible lessons!\n\n` +
        `🏅 First Steps Badge Earned!`;
    }

    if (updated.length === 25) {
      message =
        `🌿 GREAT JOB! 🌿\n\n` +
        `You completed 25 Bible lessons!\n\n` +
        `🏅 Growing Strong Badge Earned!`;
    }

    if (updated.length === 50) {
      message =
        `🌳 FAITH BUILDER! 🌳\n\n` +
        `You completed 50 Bible lessons!\n\n` +
        `🏅 Faith Builder Badge Earned!`;
    }

    if (updated.length === 90) {
      message =
        `🎉 HALF WAY THERE! 🎉\n\n` +
        `You completed 90 Bible lessons!\n\n` +
        `🏆 Halfway Hero Badge Earned!`;
    }

    if (updated.length === 135) {
      message =
        `🌟 AMAZING PROGRESS! 🌟\n\n` +
        `You completed 135 Bible lessons!\n\n` +
        `🏅 Faith Champion Badge Earned!`;
    }

    if (updated.length === 180) {
      message =
        `🎉 YOU DID IT! 🎉\n\n` +
        `🏆 All 180 Bible lessons are complete!\n\n` +
        `🌳 Your Faith Tree has fully grown!\n\n` +
        `🏅 Faith Foundations Champion!`;
    }

    alert(message);

    if (currentDay < 180) {
      setCurrentDay(currentDay + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }

  function previousDay() {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }

  function nextDay() {
    if (currentDay >= 180) return;

    if (
      !parentPreview &&
      !completed.includes(currentDay)
    ) {
      alert(
        `🔒 Day ${currentDay + 1} is locked!\n\n` +
        `Complete Day ${currentDay} first to unlock the next lesson.`
      );
      return;
    }

    setCurrentDay(currentDay + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function readAloud() {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const text =
      `${lesson.title}. ` +
      `${lesson.theme}. ` +
      `${lesson.lesson}. ` +
      `Today's activity: ${lesson.activity}. ` +
      `Kindness mission: ${lesson.kindnessMission}. ` +
      `Prayer: ${lesson.prayer}`;

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  function stopReading() {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f1e8",
        padding: "20px 15px 60px",
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

        {/* HEADER */}

        <header
          style={{
            textAlign: "center",
            padding: "20px 10px"
          }}
        >
          <div style={{ fontSize: "60px" }}>
            🌳
          </div>

          <h1
            style={{
              color: "#315c48",
              margin: "5px 0",
              fontSize: "36px"
            }}
          >
            Faith Foundations
          </h1>

          <h2 style={{ margin: "5px 0" }}>
            The M&M Adventure
          </h2>

          <p>
            Growing in God's Word — one day at a time!
          </p>

          {parentPreview && (
            <div
              style={{
                background: "#fff4df",
                padding: "12px",
                borderRadius: "12px",
                fontWeight: "bold"
              }}
            >
              👀 Parent Preview Mode
            </div>
          )}
        </header>

        {/* PROGRESS */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "20px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold"
            }}
          >
            <span>🌳 Faith Progress</span>

            <span>
              {completed.length} / 180
            </span>
          </div>

          <div
            style={{
              height: "18px",
              background: "#ddd",
              borderRadius: "20px",
              overflow: "hidden",
              marginTop: "10px"
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${percentage}%`,
                background: "#6b9e5b"
              }}
            />
          </div>

          <p
            style={{
              textAlign: "center",
              fontWeight: "bold"
            }}
          >
            {percentage}% Complete
          </p>
        </section>

        {/* NAVIGATION */}

        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "20px"
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
              style={buttonStyle}
            >
              ← Previous
            </button>

            <strong>
              Day {currentDay} of 180
            </strong>

            <button
              onClick={nextDay}
              disabled={currentDay === 180}
              style={buttonStyle}
            >
              Next →
            </button>
          </div>

          <div
            style={{
              marginTop: "18px",
              padding: "12px",
              background: "#e9f4ed",
              borderRadius: "15px",
              textAlign: "center"
            }}
          >
            <strong>
              Jump to a day:{" "}
            </strong>

            <select
              value={currentDay}
              onChange={(e) => {
                const selected =
                  Number(e.target.value);

                if (parentPreview) {
                  setCurrentDay(selected);
                  return;
                }

                const maxUnlocked =
                  Math.min(
                    completed.length + 1,
                    180
                  );

                if (selected <= maxUnlocked) {
                  setCurrentDay(selected);
                } else {
                  alert(
                    "🔒 That lesson is locked!\n\nComplete your current lesson first."
                  );
                }
              }}
              style={{
                padding: "8px",
                borderRadius: "8px",
                fontSize: "16px"
              }}
            >
              {days.map((item) => {
                const unlocked =
                  parentPreview ||
                  item.day <=
                    Math.min(
                      completed.length + 1,
                      180
                    );

                return (
                  <option
                    key={item.day}
                    value={item.day}
                    disabled={!unlocked}
                  >
                    Day {item.day}
                    {!unlocked ? " 🔒" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        </section>

        {/* LESSON */}

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "25px"
          }}
        >
          <div
            style={{
              textAlign: "center",
              background: "#e9f4ed",
              borderRadius: "20px",
              padding: "20px"
            }}
          >
            <div style={{ fontSize: "50px" }}>
              📖
            </div>

            <strong>
              DAY {lesson.day}
            </strong>

            <h1>
              {lesson.title}
            </h1>

            <p style={{ fontSize: "18px" }}>
              📖 {lesson.bibleReference}
            </p>

            <p>
              <strong>
                Lesson Type:
              </strong>{" "}
              {lesson.lessonType}
            </p>
          </div>

          {/* THEME */}

          <section
            style={{
              background: "#fffaf0",
              padding: "20px",
              borderRadius: "18px",
              marginTop: "20px"
            }}
          >
            <h2>⭐ Today's Theme</h2>

            <p style={{ fontSize: "18px" }}>
              {lesson.theme}
            </p>
          </section>

          {/* LESSON */}

          <section>
            <h2>📚 Let's Learn</h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.7"
              }}
            >
              {lesson.lesson}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >
              <button
                onClick={readAloud}
                style={greenButton}
              >
                🔊 Read Lesson Aloud
              </button>

              <button
                onClick={stopReading}
                style={grayButton}
              >
                ⏹️ Stop
              </button>
            </div>
          </section>

          {/* ACTIVITY */}

          <section
            style={{
              background: "#f0f7ff",
              padding: "20px",
              borderRadius: "18px",
              marginTop: "20px"
            }}
          >
            <h2>✏️ Today's Activity</h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.7"
              }}
            >
              {lesson.activity}
            </p>
          </section>

          {/* MEMORY */}

          <section
            style={{
              background: "#eef7e9",
              padding: "20px",
              borderRadius: "18px",
              marginTop: "20px"
            }}
          >
            <h2>💡 Memory Verse</h2>

            <p style={{ fontSize: "18px" }}>
              {lesson.memoryVerse}
            </p>
          </section>

          {/* KINDNESS */}

          <section
            style={{
              background: "#fff4e8",
              padding: "20px",
              borderRadius: "18px",
              marginTop: "20px"
            }}
          >
            <h2>💚 Kindness Mission</h2>

            <p style={{ fontSize: "18px" }}>
              {lesson.kindnessMission}
            </p>
          </section>

          {/* PRAYER */}

          <section
            style={{
              background: "#f5f0ff",
              padding: "20px",
              borderRadius: "18px",
              marginTop: "20px"
            }}
          >
            <h2>🙏 Prayer</h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.7"
              }}
            >
              {lesson.prayer}
            </p>
          </section>

          {/* COMPLETE */}

          {!parentPreview && (
            <button
              onClick={completeLesson}
              disabled={isCompleted}
              style={{
                width: "100%",
                marginTop: "25px",
                padding: "18px",
                border: "none",
                borderRadius: "16px",
                background: isCompleted
                  ? "#315c48"
                  : "#6b9e5b",
                color: "white",
                fontSize: "19px",
                fontWeight: "bold"
              }}
            >
              {isCompleted
                ? "✅ Day Completed!"
                : `🌱 Complete Day ${lesson.day}`}
            </button>
          )}

          {/* BOTTOM NAV */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px"
            }}
          >
            <button
              onClick={previousDay}
              disabled={currentDay === 1}
              style={{
                ...buttonStyle,
                flex: 1
              }}
            >
              ⬅️ Previous
            </button>

            <button
              onClick={nextDay}
              disabled={currentDay === 180}
              style={{
                ...buttonStyle,
                flex: 1
              }}
            >
              Next ➡️
            </button>
          </div>
        </section>

        {/* BADGES */}

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "25px",
            marginTop: "20px"
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            🏅 Faith Badges
          </h2>

          <p style={{ textAlign: "center" }}>
            Keep completing lessons to earn badges!
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(135px,1fr))",
              gap: "12px"
            }}
          >
            {badges.map(
              ([icon, name, requirement]) => {
                const earned =
                  completed.length >= requirement;

                return (
                  <div
                    key={name}
                    style={{
                      padding: "15px",
                      textAlign: "center",
                      borderRadius: "16px",
                      background: earned
                        ? "#e9f4ed"
                        : "#f3f3f3",
                      border: earned
                        ? "2px solid #6b9e5b"
                        : "2px solid #ddd",
                      opacity: earned ? 1 : 0.55
                    }}
                  >
                    <div
                      style={{
                        fontSize: "40px"
                      }}
                    >
                      {icon}
                    </div>

                    <strong>
                      {name}
                    </strong>

                    <div>
                      {requirement} Lessons
                    </div>

                    <div style={{ marginTop: "6px" }}>
                      {earned
                        ? "✅ Earned"
                        : "🔒 Locked"}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* TREE */}

        <footer
          style={{
            textAlign: "center",
            marginTop: "30px"
          }}
        >
          <div style={{ fontSize: "65px" }}>
            {completed.length === 0
              ? "🌱"
              : completed.length < 30
              ? "🌿"
              : completed.length < 60
              ? "🌳"
              : completed.length < 90
              ? "🌳🌳"
              : completed.length < 120
              ? "🌳🌳🌳"
              : completed.length < 150
              ? "🌲🌳🌲"
              : completed.length < 180
              ? "🌲🌳🌲🌳"
              : "🌲🌳🌲🌳🌲"}
          </div>

          <h3>
            🌳 Your Faith Tree is growing!
          </h3>

          <p>
            Completed: {completed.length} / 180
          </p>

          <p>
            {completed.length === 0
              ? "Start your Bible adventure!"
              : completed.length < 60
              ? "Your faith is taking root! 🌱"
              : completed.length < 120
              ? "Look how much your Faith Tree has grown! 🌳"
              : completed.length < 180
              ? "Your Faith Tree is almost fully grown! ⭐"
              : "🏆 Your Faith Tree is fully grown! You did it!"}
          </p>
        </footer>

      </div>
    </main>
  );
}

const buttonStyle = {
  padding: "12px 15px",
  border: "none",
  borderRadius: "12px",
  background: "#315c48",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

const greenButton = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#315c48",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold"
};

const grayButton = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#777",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold"
};

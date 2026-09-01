"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "faithTreeCompleted";

/* =========================
   BIBLE LESSON THEMES
========================= */

const themes = [
  ["God Created the World", "Genesis 1", "God is the Creator"],
  ["God Made Me Special", "Psalm 139:13-14", "God made each person wonderfully"],
  ["Noah Obeyed God", "Genesis 6-9", "Obedience matters"],
  [
    "Abraham Trusted God",
    "Genesis 12:1-9",
    "Trust God even when you cannot see the whole plan"
  ],
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
  [
    "Solomon Asks for Wisdom",
    "1 Kings 3",
    "Wisdom is more valuable than riches"
  ],
  ["Elijah Trusts God", "1 Kings 17-18", "God provides"],
  ["Daniel Prays", "Daniel 6", "Keep praying"],
  [
    "Shadrach, Meshach and Abednego",
    "Daniel 3",
    "Stand for what is right"
  ],
  ["Esther Is Brave", "Esther 4-7", "God can give us courage"],
  ["Jonah Learns Obedience", "Jonah 1-4", "We should obey God"],
  ["God's Love", "Psalm 136", "God's love never fails"],
  ["God Is Our Shepherd", "Psalm 23", "God cares for us"],
  ["God Gives Wisdom", "Proverbs 2", "Ask God for wisdom"],
  ["A Servant's Heart", "Mark 10:35-45", "Greatness means serving others"],
  ["Jesus Loves Children", "Mark 10:13-16", "Jesus loves children"],
  [
    "Jesus Calms the Storm",
    "Mark 4:35-41",
    "Trust Jesus when you are afraid"
  ],
  [
    "Jesus Feeds the Five Thousand",
    "John 6:1-14",
    "God can use what we give Him"
  ],
  ["The Good Samaritan", "Luke 10:25-37", "Love your neighbor"],
  ["The Lost Sheep", "Luke 15:1-7", "God cares about every person"],
  ["The Prodigal Son", "Luke 15:11-32", "God forgives"],
  ["Jesus Is Born", "Luke 2:1-20", "Jesus is God's gift"],
  ["Jesus Is Risen", "Matthew 28:1-10", "Jesus is alive"],
  [
    "The Great Commission",
    "Matthew 28:18-20",
    "Tell others about Jesus"
  ],
  ["The Early Church", "Acts 2:42-47", "Believers grow together"],
  ["Paul's Conversion", "Acts 9:1-22", "God can change hearts"],
  [
    "The Fruit of the Spirit",
    "Galatians 5:22-23",
    "Let God's Spirit grow good fruit"
  ],
  [
    "The Armor of God",
    "Ephesians 6:10-18",
    "God gives us spiritual protection"
  ],
  [
    "The Love Chapter",
    "1 Corinthians 13",
    "Love is patient and kind"
  ],
  ["Be Kind", "Ephesians 4:32", "Kindness reflects God's love"],
  [
    "Be Thankful",
    "1 Thessalonians 5:18",
    "Give thanks in every situation"
  ],
  [
    "Pray Always",
    "1 Thessalonians 5:17",
    "Prayer keeps us close to God"
  ],
  ["Shine for Jesus", "Matthew 5:14-16", "Let your light shine"],
  [
    "Finish Strong",
    "Philippians 3:13-14",
    "Keep growing in faith"
  ]
];

const lessonTypes = [
  "Learn",
  "Explore",
  "Practice",
  "Live It"
];

/* =========================
   CREATE 180 LESSONS
========================= */

const days = Array.from(
  { length: 180 },
  (_, index) => {
    const day = index + 1;

    /* =========================
       MIDTERM REVIEW
    ========================= */

    if (day === 88) {
      return {
        day,
        title: "Midterm Review",
        bibleReference: "Review Days 1–87",
        theme: "Look back at everything you have learned!",
        lessonType: "Review",
        lesson:
          "Today we are taking time to remember the Bible stories, truths, memory passages, and faith lessons you have learned during the first part of your Faith Foundations adventure. Think about how God has been teaching you through His Word.",
        activity:
          "Ask a parent to review your favorite Bible stories from Days 1–87 with you. Tell your parent three things you remember learning about God.",
        memoryVerse:
          "Choose your favorite memory passage from Days 1–87 and practice saying it to your parent.",
        kindnessMission:
          "Encourage someone by telling them something kind about them.",
        prayer:
          "Dear God, thank You for everything I have learned from Your Word. Help me remember Your truth and continue growing in faith. In Jesus' name, Amen."
      };
    }

    /* =========================
       MIDTERM EXAM
    ========================= */

    if (day === 89) {
      return {
        day,
        title: "Midterm Exam",
        bibleReference: "Review Days 1–88",
        theme: "Show what you have learned!",
        lessonType: "Exam",
        lesson:
          "Today is your Midterm Bible Exam! Do your very best and remember that learning God's Word is more important than getting every answer perfect. Take your time, think carefully, and ask God to help you remember what you have learned.",
        activity:
          "Complete your parent-provided Midterm Exam or review questions.",
        memoryVerse:
          "Recite one of your favorite memory passages from the first half of the course to your parent.",
        kindnessMission:
          "Thank someone who has helped you learn during your Faith Foundations adventure.",
        prayer:
          "Dear God, please help me remember what I have learned and do my very best. Thank You for helping me grow in Your Word. In Jesus' name, Amen."
      };
    }

    /* =========================
       FINAL REVIEW
    ========================= */

    if (day === 178) {
      return {
        day,
        title: "Final Review",
        bibleReference: "Review Days 1–177",
        theme: "Look how far you have come!",
        lessonType: "Review",
        lesson:
          "Today we are looking back over your entire Faith Foundations adventure. Think about the Bible stories you learned, the truths you discovered, and the ways you practiced living for God.",
        activity:
          "Choose your three favorite Bible stories and explain to your parent what each one taught you about God.",
        memoryVerse:
          "Choose your favorite memory passage from the entire course and practice saying it.",
        kindnessMission:
          "Encourage someone who is still learning something new.",
        prayer:
          "Dear God, thank You for carrying me through this journey. Help me keep Your Word in my heart and continue growing in faith. In Jesus' name, Amen."
      };
    }

    /* =========================
       FINAL EXAM
    ========================= */

    if (day === 179) {
      return {
        day,
        title: "Final Exam",
        bibleReference: "Review Days 1–178",
        theme: "You are almost there!",
        lessonType: "Final Exam",
        lesson:
          "Today is your Final Bible Exam! Remember everything you have learned throughout your Faith Foundations adventure. Take your time, do your very best, and remember that God's Word is something you can keep learning from for the rest of your life.",
        activity:
          "Complete your parent-provided Final Exam or review questions.",
        memoryVerse:
          "Recite your favorite memory passage to your parent.",
        kindnessMission:
          "Celebrate someone else's accomplishment and encourage them today.",
        prayer:
          "Dear God, thank You for helping me learn Your Word. Help me remember Your truth and continue following You every day. In Jesus' name, Amen."
      };
    }

    /* =========================
       DAY 180
    ========================= */

    if (day === 180) {
      return {
        day,
        title: "YOU DID IT!",
        bibleReference: "Philippians 3:13-14",
        theme: "Keep growing in faith!",
        lessonType: "Celebration",
        lesson:
          "You completed all 180 Faith Foundations Bible lessons! What an amazing accomplishment! Your Faith Foundations adventure is complete, but your journey with God continues every day. Keep reading God's Word, praying, obeying Him, and growing in faith.",
        activity:
          "Celebrate with your family! Share your favorite lesson, favorite memory verse, and one way you want to continue growing in faith.",
        memoryVerse:
          "Philippians 3:14 — Press toward the mark for the prize of the high calling of God in Christ Jesus.",
        kindnessMission:
          "Celebrate someone else and encourage them to keep growing in faith too.",
        prayer:
          "Dear God, thank You for helping me complete my 180 Bible lessons. Help me keep reading Your Word, praying, obeying You, and growing in faith. In Jesus' name, Amen."
      };
    }

    /* =========================
       REGULAR LESSON
    ========================= */

    /*
      We calculate the instructional lesson number
      separately so the review/exam days do not
      accidentally skip part of a 4-day theme.
    */

    let instructionalDay = day;

    if (day >= 88) {
      instructionalDay -= 2;
    }

    if (day >= 178) {
      instructionalDay -= 2;
    }

    const instructionalIndex =
      instructionalDay - 1;

    const week =
      Math.floor(
        instructionalIndex / 4
      );

    const dayOfWeek =
      instructionalIndex % 4;

    const theme =
      themes[
        week % themes.length
      ];

    return {
      day,
      title: theme[0],
      bibleReference: theme[1],
      theme: theme[2],
      lessonType: lessonTypes[dayOfWeek],

      lesson:
        `Today we are learning about ${theme[0].toLowerCase()}. Read ${theme[1]} in your KJV Bible. Think about what this passage teaches you about God and how you can apply His Word to your life.`,

      activity:
        dayOfWeek === 0
          ? `Read ${theme[1]} in your KJV Bible with a parent. Talk about what happened and what it teaches you about God.`
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
        "Dear God, thank You for teaching me through Your Word. Help me remember what I learned today and live in a way that honors You. Give me wisdom, courage, kindness, and a heart that wants to follow You. In Jesus' name, Amen."
    };
  }
);

/* =========================
   BADGES
========================= */

const badges = [
  {
    icon: "🌱",
    name: "First Steps",
    requirement: 10,
    message: "10 Lessons"
  },
  {
    icon: "🌿",
    name: "Growing Strong",
    requirement: 25,
    message: "25 Lessons"
  },
  {
    icon: "🌳",
    name: "Faith Builder",
    requirement: 50,
    message: "50 Lessons"
  },
  {
    icon: "🏆",
    name: "Halfway Hero",
    requirement: 90,
    message: "90 Lessons"
  },
  {
    icon: "⭐",
    name: "Faith Champion",
    requirement: 135,
    message: "135 Lessons"
  },
  {
    icon: "🏆",
    name: "Faith Foundations Champion",
    requirement: 180,
    message: "180 Lessons"
  }
];

/* =========================
   FAITH TREE
========================= */

function getFaithTree(completedCount) {
  if (completedCount >= 180) {
    return {
      tree: "🏆🌳🏆",
      icon: "🏆",
      title: "Faith Foundations Champion!",
      message:
        "Your Faith Tree is fully grown! You completed all 180 lessons!"
    };
  }

  if (completedCount >= 135) {
    return {
      tree: "🌲🌳🌲",
      icon: "⭐",
      title: "Faith Champion!",
      message:
        "Your faith is shining strong! Keep growing toward 180 lessons!"
    };
  }

  if (completedCount >= 90) {
    return {
      tree: "🌳🌳",
      icon: "🏆",
      title: "Halfway Hero!",
      message:
        "You are halfway through your Faith Foundations adventure!"
    };
  }

  if (completedCount >= 50) {
    return {
      tree: "🌳",
      icon: "🌳",
      title: "Faith Builder!",
      message:
        "Your Faith Tree is growing strong!"
    };
  }

  if (completedCount >= 25) {
    return {
      tree: "🌿",
      icon: "🌿",
      title: "Growing Strong!",
      message:
        "Your faith is growing stronger every day!"
    };
  }

  if (completedCount >= 10) {
    return {
      tree: "🌱",
      icon: "🌱",
      title: "First Steps!",
      message:
        "You have taken your first big steps in your faith adventure!"
    };
  }

  if (completedCount >= 1) {
    return {
      tree: "🌱",
      icon: "🌱",
      title: "Faith Is Taking Root!",
      message:
        "You have started growing in God's Word. Keep going!"
    };
  }

  return {
    tree: "🌰",
    icon: "🌰",
    title: "Ready to Begin?",
    message:
      "Complete your first Bible lesson and begin growing your Faith Tree!"
  };
}

/* =========================
   STORAGE
========================= */

function getSavedCompleted() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return [
      ...new Set(
        parsed
          .map(Number)
          .filter(
            (day) =>
              Number.isInteger(day) &&
              day >= 1 &&
              day <= 180
          )
      )
    ].sort(
      (a, b) => a - b
    );
  } catch {
    return [];
  }
}

function saveCompleted(daysCompleted) {
  if (typeof window === "undefined") {
    return;
  }

  const cleanDays = [
    ...new Set(
      daysCompleted
        .map(Number)
        .filter(
          (day) =>
            Number.isInteger(day) &&
            day >= 1 &&
            day <= 180
        )
    )
  ].sort(
    (a, b) => a - b
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(cleanDays)
  );

  window.dispatchEvent(
    new CustomEvent(
      "faithTreeProgressUpdated",
      {
        detail: {
          completedDays:
            cleanDays,
          completedCount:
            cleanDays.length
        }
      }
    )
  );
}

/* =========================
   HIGHEST CONSECUTIVE DAY
========================= */

function getHighestConsecutiveDay(
  completedDays
) {
  let highest = 0;

  while (
    completedDays.includes(
      highest + 1
    )
  ) {
    highest++;
  }

  return highest;
}

/* =========================
   LESSONS PAGE
========================= */

export default function Lessons() {
  const router = useRouter();

  const [isParentPreview, setIsParentPreview] =
    useState(false);

  const [currentDay, setCurrentDay] =
    useState(1);

  const [completed, setCompleted] =
    useState([]);

  const [loaded, setLoaded] =
    useState(false);

  const [celebration, setCelebration] =
    useState(null);

  /* AUDIO */

  const speechRef =
    useRef(null);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  /* =========================
     LOAD PROGRESS
  ========================= */

  useEffect(() => {
    setCompleted(
      getSavedCompleted()
    );

    setLoaded(true);
  }, []);

  /* =========================
     READ URL
  ========================= */

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const parent =
      params.get("parent") ===
      "true";

    setIsParentPreview(parent);

    const requestedDay =
      Number(
        params.get("day")
      );

    if (
      Number.isInteger(
        requestedDay
      ) &&
      requestedDay >= 1 &&
      requestedDay <= 180
    ) {
      setCurrentDay(
        requestedDay
      );
    }
  }, []);

  /* =========================
     SYNC PROGRESS
  ========================= */

  useEffect(() => {
    function syncProgress() {
      setCompleted(
        getSavedCompleted()
      );
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
  }, []);

  /* =========================
     STOP AUDIO WHEN LEAVING
  ========================= */

  useEffect(() => {
    return () => {
      if (
        typeof window !==
        "undefined"
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const lesson =
    days[currentDay - 1];

  /* =========================
     RESET AUDIO
  ========================= */

  useEffect(() => {
    if (
      typeof window !==
      "undefined"
    ) {
      window.speechSynthesis.cancel();
    }

    speechRef.current = null;

    setIsSpeaking(false);
    setIsPaused(false);
  }, [currentDay]);

  if (
    !loaded ||
    !lesson
  ) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          background:
            "#f5f1e8",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          padding: "30px",
          fontFamily:
            "Arial, sans-serif"
        }}
      >
        <div
          style={{
            background:
              "white",
            padding:
              "30px",
            borderRadius:
              "20px",
            textAlign:
              "center",
            maxWidth:
              "500px"
          }}
        >
          <div
            style={{
              fontSize:
                "60px"
            }}
          >
            🌳
          </div>

          <h2>
            Loading Faith Foundations...
          </h2>

          <p>
            Please wait a moment.
          </p>
        </div>
      </main>
    );
  }

  const isCompleted =
    completed.includes(
      currentDay
    );

  const highestConsecutive =
    getHighestConsecutiveDay(
      completed
    );

  const completionPercent =
    Math.round(
      (completed.length /
        180) *
        100
    );

  const faithTree =
    getFaithTree(
      completed.length
    );

  /* =========================
     HOME
  ========================= */

  function goHome() {
    if (
      typeof window !==
      "undefined"
    ) {
      window.speechSynthesis.cancel();
    }

    router.push("/app");
  }

  /* =========================
     AUDIO TEXT
  ========================= */

  function getLessonSpeech() {
    return `
      ${lesson.title}.
      Today's theme is ${lesson.theme}.
      ${lesson.lesson}
      Today's activity is ${lesson.activity}
      Memory verse: ${lesson.memoryVerse}
      Kindness mission: ${lesson.kindnessMission}
      ${lesson.prayer}
    `;
  }

  /* =========================
     PLAY / RESUME
  ========================= */

  function playLessonAloud() {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const synth =
      window.speechSynthesis;

    if (
      speechRef.current &&
      synth.paused
    ) {
      synth.resume();

      setIsPaused(false);
      setIsSpeaking(true);

      return;
    }

    if (
      speechRef.current &&
      synth.speaking
    ) {
      return;
    }

    synth.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        getLessonSpeech()
      );

    speech.rate = 0.9;
    speech.pitch = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    speech.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      speechRef.current = null;
    };

    speech.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      speechRef.current = null;
    };

    speechRef.current =
      speech;

    synth.speak(speech);

    setIsSpeaking(true);
    setIsPaused(false);
  }

  /* =========================
     PAUSE
  ========================= */

  function pauseLessonAloud() {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const synth =
      window.speechSynthesis;

    if (
      synth.speaking &&
      !synth.paused
    ) {
      synth.pause();

      setIsPaused(true);
      setIsSpeaking(true);
    }
  }

  /* =========================
     START OVER
  ========================= */

  function startLessonOver() {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const synth =
      window.speechSynthesis;

    synth.cancel();

    speechRef.current = null;

    setIsSpeaking(false);
    setIsPaused(false);

    setTimeout(() => {
      const speech =
        new SpeechSynthesisUtterance(
          getLessonSpeech()
        );

      speech.rate = 0.9;
      speech.pitch = 1;

      speech.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      speech.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        speechRef.current =
          null;
      };

      speech.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        speechRef.current =
          null;
      };

      speechRef.current =
        speech;

      synth.speak(speech);

      setIsSpeaking(true);
      setIsPaused(false);
    }, 100);
  }

  /* =========================
     COMPLETE LESSON
  ========================= */

  function toggleComplete() {
    if (isParentPreview) {
      return;
    }

    if (isCompleted) {
      const updated =
        completed.filter(
          (day) =>
            day !== currentDay
        );

      setCompleted(updated);
      saveCompleted(updated);

      return;
    }

    const updated = [
      ...new Set([
        ...completed,
        currentDay
      ])
    ].sort(
      (a, b) => a - b
    );

    setCompleted(updated);
    saveCompleted(updated);

    const previousCount =
      completed.length;

    const newCount =
      updated.length;

    let title =
      "🎉 Congratulations!";

    let message =
      `Day ${currentDay} is complete!`;

    let badge = null;

    if (
      newCount >
        previousCount
    ) {
      const earnedBadge =
        badges.find(
          (item) =>
            item.requirement ===
            newCount
        );

      if (earnedBadge) {
        badge = earnedBadge;

        title =
          `${earnedBadge.icon} Badge Earned!`;

        message =
          `You completed ${newCount} Bible lessons!`;
      }
    }

    if (
      newCount === 180
    ) {
      title =
        "🎉 YOU DID IT! 🎉";

      message =
        "You completed all 180 Bible lessons! Your Faith Tree is fully grown!";

      badge =
        badges.find(
          (item) =>
            item.requirement ===
            180
        );
    }

    setCelebration({
      title,
      message,
      count: newCount,
      badge
    });
  }

  /* =========================
     PREVIOUS DAY
  ========================= */

  function previousDay() {
    if (
      currentDay <= 1
    ) {
      return;
    }

    if (
      typeof window !==
      "undefined"
    ) {
      window.speechSynthesis.cancel();
    }

    setCurrentDay(
      currentDay - 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* =========================
     NEXT DAY
  ========================= */

  function nextDay() {
    if (
      currentDay >= 180
    ) {
      return;
    }

    if (
      !isParentPreview &&
      !completed.includes(
        currentDay
      )
    ) {
      alert(
        `🔒 Day ${currentDay + 1} is locked!\n\n🌱 Complete Day ${currentDay} first to unlock your next Bible adventure!`
      );

      return;
    }

    if (
      typeof window !==
      "undefined"
    ) {
      window.speechSynthesis.cancel();
    }

    setCurrentDay(
      currentDay + 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* =========================
     SELECT DAY
  ========================= */

  function selectDay(
    selectedDay
  ) {
    if (isParentPreview) {
      setCurrentDay(
        selectedDay
      );
      return;
    }

    const maxUnlocked =
      Math.min(
        highestConsecutive +
          1,
        180
      );

    if (
      selectedDay <=
      maxUnlocked
    ) {
      setCurrentDay(
        selectedDay
      );
    } else {
      alert(
        `🔒 Day ${selectedDay} is locked!\n\n🌱 Complete your current lesson first to unlock more days.`
      );
    }
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#f5f1e8",
        padding:
          "25px 15px 60px",
        fontFamily:
          "Arial, sans-serif",
        color:
          "#24313a"
      }}
    >
      <div
        style={{
          maxWidth:
            "760px",
          margin:
            "0 auto"
        }}
      >

        {/* =====================
            HEADER
        ===================== */}

        <header
          style={{
            textAlign:
              "center",
            padding:
              "15px 10px 25px"
          }}
        >
          <div
            style={{
              fontSize:
                "58px"
            }}
          >
            {faithTree.tree}
          </div>

          <h1
            style={{
              fontSize:
                "36px",
              margin:
                "5px 0",
              color:
                "#315c48"
            }}
          >
            Faith Foundations
          </h1>

          <h2
            style={{
              fontSize:
                "23px",
              margin:
                "5px 0 10px"
            }}
          >
            The M&M Adventure
          </h2>

          <p
            style={{
              fontSize:
                "17px"
            }}
          >
            Growing in God's Word —
            one day at a time!
          </p>

          {isParentPreview && (
            <div
              style={{
                background:
                  "#fff4df",
                borderRadius:
                  "12px",
                padding:
                  "12px",
                fontWeight:
                  "bold",
                marginTop:
                  "12px"
              }}
            >
              👀 Parent Preview Mode

              <br />

              <small>
                You can view all 180 lessons.
              </small>
            </div>
          )}

          <button
            onClick={goHome}
            style={{
              marginTop:
                "15px",
              padding:
                "11px 18px",
              border:
                "none",
              borderRadius:
                "12px",
              background:
                "#315c48",
              color:
                "white",
              fontSize:
                "16px",
              fontWeight:
                "bold",
              cursor:
                "pointer"
            }}
          >
            🏠 Back to Home
          </button>
        </header>

        {/* =====================
            PROGRESS
        ===================== */}

        <section
          style={{
            background:
              "white",
            borderRadius:
              "20px",
            padding:
              "20px",
            marginBottom:
              "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              fontWeight:
                "bold",
              marginBottom:
                "8px"
            }}
          >
            <span>
              {faithTree.icon} Faith Progress
            </span>

            <span>
              {completed.length} / 180
            </span>
          </div>

          <div
            style={{
              width:
                "100%",
              height:
                "16px",
              background:
                "#e4e4e4",
              borderRadius:
                "20px",
              overflow:
                "hidden"
            }}
          >
            <div
              style={{
                width:
                  `${completionPercent}%`,
                height:
                  "100%",
                background:
                  "#6b9e5b",
                borderRadius:
                  "20px",
                transition:
                  "width .4s ease"
              }}
            />
          </div>

          <p
            style={{
              textAlign:
                "center",
              margin:
                "8px 0 0",
              fontWeight:
                "bold"
            }}
          >
            {completionPercent}%
            complete
          </p>
        </section>

        {/* =====================
            NAVIGATION
        ===================== */}

        <section
          style={{
            background:
              "white",
            borderRadius:
              "24px",
            padding:
              "22px",
            marginBottom:
              "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap:
                "10px"
            }}
          >
            <button
              onClick={
                previousDay
              }
              disabled={
                currentDay ===
                1
              }
              style={{
                ...navButton,
                opacity:
                  currentDay ===
                  1
                    ? 0.5
                    : 1
              }}
            >
              ← Previous
            </button>

            <strong
              style={{
                fontSize:
                  "18px",
                textAlign:
                  "center"
              }}
            >
              Day {currentDay} of 180
            </strong>

            <button
              onClick={
                nextDay
              }
              disabled={
                currentDay ===
                180
              }
              style={{
                ...navButton,
                opacity:
                  currentDay ===
                  180
                    ? 0.5
                    : 1
              }}
            >
              Next →
            </button>
          </div>

          {/* DAY SELECTOR */}

          <div
            style={{
              marginTop:
                "18px",
              background:
                "#e9f4ed",
              borderRadius:
                "15px",
              padding:
                "14px",
              textAlign:
                "center"
            }}
          >
            <label>
              <strong>
                Jump to a day:{" "}
              </strong>

              <select
                value={
                  currentDay
                }
                onChange={(e) =>
                  selectDay(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={{
                  padding:
                    "8px",
                  borderRadius:
                    "8px",
                  fontSize:
                    "16px"
                }}
              >
                {days.map(
                  (item) => {
                    const unlocked =
                      isParentPreview ||
                      item.day <=
                        Math.min(
                          highestConsecutive +
                            1,
                          180
                        );

                    return (
                      <option
                        key={
                          item.day
                        }
                        value={
                          item.day
                        }
                        disabled={
                          !unlocked
                        }
                      >
                        Day{" "}
                        {
                          item.day
                        }
                        {!unlocked
                          ? " 🔒"
                          : ""}
                      </option>
                    );
                  }
                )}
              </select>
            </label>
          </div>
        </section>

        {/* =====================
            LESSON
        ===================== */}

        <section
          style={{
            background:
              "white",
            borderRadius:
              "24px",
            padding:
              "28px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)"
          }}
        >

          {/* LESSON HEADER */}

          <div
            style={{
              textAlign:
                "center",
              background:
                "#e9f4ed",
              borderRadius:
                "20px",
              padding:
                "20px",
              marginBottom:
                "22px"
            }}
          >
            <div
              style={{
                fontSize:
                  "50px"
              }}
            >
              📖
            </div>

            <p
              style={{
                fontWeight:
                  "bold",
                fontSize:
                  "18px",
                margin:
                  "5px"
              }}
            >
              DAY {lesson.day}
            </p>

            <h1
              style={{
                fontSize:
                  "30px",
                margin:
                  "8px 0"
              }}
            >
              {lesson.title}
            </h1>

            <p
              style={{
                fontSize:
                  "19px",
                margin:
                  "5px"
              }}
            >
              📖{" "}
              {
                lesson.bibleReference
              }
            </p>

            <p
              style={{
                marginTop:
                  "10px",
                fontWeight:
                  "bold"
              }}
            >
              Lesson Type:{" "}
              {
                lesson.lessonType
              }
            </p>
          </div>

          {/* THEME */}

          <section
            style={{
              background:
                "#fffaf0",
              borderRadius:
                "18px",
              padding:
                "20px",
              marginBottom:
                "18px"
            }}
          >
            <h2>
              ⭐ Today's Theme
            </h2>

            <p
              style={{
                fontSize:
                  "18px"
              }}
            >
              {lesson.theme}
            </p>
          </section>

          {/* LESSON */}

          <section
            style={{
              marginBottom:
                "18px"
            }}
          >
            <h2>
              📚 Let's Learn
            </h2>

            <p
              style={{
                fontSize:
                  "18px",
                lineHeight:
                  "1.7"
              }}
            >
              {lesson.lesson}
            </p>

            {/* AUDIO CONTROLS */}

            <div
              style={{
                display:
                  "flex",
                flexWrap:
                  "wrap",
                gap:
                  "8px",
                width:
                  "100%",
                marginTop:
                  "15px"
              }}
            >

              <button
                onClick={
                  playLessonAloud
                }
                style={{
                  ...audioButton,
                  background:
                    isSpeaking &&
                    !isPaused
                      ? "#6b9e5b"
                      : "#315c48"
                }}
              >
                ▶️ Play
              </button>

              <button
                onClick={
                  pauseLessonAloud
                }
                disabled={
                  !isSpeaking ||
                  isPaused
                }
                style={{
                  ...audioButton,
                  background:
                    !isSpeaking ||
                    isPaused
                      ? "#ccc"
                      : "#777",
                  color:
                    !isSpeaking ||
                    isPaused
                      ? "#666"
                      : "white",
                  cursor:
                    !isSpeaking ||
                    isPaused
                      ? "default"
                      : "pointer"
                }}
              >
                ⏸️ Pause
              </button>

              <button
                onClick={
                  startLessonOver
                }
                style={{
                  ...audioButton,
                  background:
                    "#315c48"
                }}
              >
                🔄 Start Over
              </button>
            </div>

            <p
              style={{
                textAlign:
                  "center",
                fontSize:
                  "13px",
                color:
                  "#777",
                marginTop:
                  "8px",
                marginBottom:
                  "0"
              }}
            >
              {isPaused
                ? "⏸️ Lesson paused — press Play to continue."
                : isSpeaking
                ? "🔊 Reading lesson aloud..."
                : "▶️ Press Play to hear the lesson."}
            </p>
          </section>

          {/* ACTIVITY */}

          <section
            style={{
              background:
                "#f0f7ff",
              borderRadius:
                "18px",
              padding:
                "20px",
              marginBottom:
                "18px"
            }}
          >
            <h2>
              ✏️ Today's Activity
            </h2>

            <p
              style={{
                fontSize:
                  "18px",
                lineHeight:
                  "1.7"
              }}
            >
              {
                lesson.activity
              }
            </p>
          </section>

          {/* MEMORY VERSE */}

          <section
            style={{
              background:
                "#eef7e9",
              borderRadius:
                "18px",
              padding:
                "20px",
              marginBottom:
                "18px"
            }}
          >
            <h2>
              💡 Memory Verse
            </h2>

            <p
              style={{
                fontSize:
                  "18px",
                lineHeight:
                  "1.6"
              }}
            >
              {
                lesson.memoryVerse
              }
            </p>

            <p
              style={{
                fontSize:
                  "15px"
              }}
            >
              Read the passage in your KJV Bible and practice remembering it.
            </p>
          </section>

          {/* KINDNESS */}

          <section
            style={{
              background:
                "#fff4e8",
              borderRadius:
                "18px",
              padding:
                "20px",
              marginBottom:
                "18px"
            }}
          >
            <h2>
              💚 Kindness Mission
            </h2>

            <p
              style={{
                fontSize:
                  "18px"
              }}
            >
              {
                lesson.kindnessMission
              }
            </p>
          </section>

          {/* PRAYER */}

          <section
            style={{
              background:
                "#f5f0ff",
              borderRadius:
                "18px",
              padding:
                "20px",
              marginBottom:
                "22px"
            }}
          >
            <h2>
              🙏 Prayer
            </h2>

            <p
              style={{
                fontSize:
                  "18px",
                lineHeight:
                  "1.7"
              }}
            >
              {lesson.prayer}
            </p>
          </section>

          {/* COMPLETE */}

          {!isParentPreview && (
            <button
              onClick={
                toggleComplete
              }
              style={{
                width:
                  "100%",
                padding:
                  "17px",
                border:
                  "none",
                borderRadius:
                  "16px",
                background:
                  isCompleted
                    ? "#315c48"
                    : "#6b9e5b",
                color:
                  "white",
                fontSize:
                  "19px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer"
              }}
            >
              {isCompleted
                ? "✅ Day Completed!"
                : `${faithTree.icon} Complete Day ${lesson.day}`}
            </button>
          )}

          {/* BOTTOM NAV */}

          <div
            style={{
              display:
                "flex",
              gap:
                "10px",
              marginTop:
                "15px"
            }}
          >
            <button
              onClick={
                previousDay
              }
              disabled={
                currentDay ===
                1
              }
              style={{
                ...bottomButton,
                background:
                  currentDay ===
                  1
                    ? "#ccc"
                    : "#315c48"
              }}
            >
              ⬅️ Previous
            </button>

            <button
              onClick={
                nextDay
              }
              disabled={
                currentDay ===
                180
              }
              style={{
                ...bottomButton,
                background:
                  currentDay ===
                  180
                    ? "#ccc"
                    : "#6b9e5b"
              }}
            >
              Next ➡️
            </button>
          </div>

          <p
            style={{
              textAlign:
                "center",
              fontSize:
                "15px",
              fontWeight:
                "bold",
              marginTop:
                "12px"
            }}
          >
            {faithTree.icon} Day{" "}
            {currentDay} of 180
          </p>
        </section>

        {/* =====================
            BADGES
        ===================== */}

        <section
          style={{
            background:
              "white",
            borderRadius:
              "24px",
            padding:
              "25px",
            marginTop:
              "22px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <h2
            style={{
              textAlign:
                "center"
            }}
          >
            🏅 Faith Badges
          </h2>

          <p
            style={{
              textAlign:
                "center",
              fontSize:
                "16px",
              marginBottom:
                "20px"
            }}
          >
            Keep completing Bible lessons to earn badges!
          </p>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap:
                "12px"
            }}
          >
            {badges.map(
              (badge) => {
                const earned =
                  completed.length >=
                  badge.requirement;

                return (
                  <div
                    key={
                      badge.name
                    }
                    style={{
                      padding:
                        "18px 10px",
                      borderRadius:
                        "16px",
                      textAlign:
                        "center",
                      background:
                        earned
                          ? "#e9f4ed"
                          : "#f3f3f3",
                      border:
                        earned
                          ? "2px solid #6b9e5b"
                          : "2px solid #ddd",
                      opacity:
                        earned
                          ? 1
                          : 0.55
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "42px",
                        marginBottom:
                          "8px",
                        filter:
                          earned
                            ? "none"
                            : "grayscale(1)"
                      }}
                    >
                      {earned
                        ? badge.icon
                        : "🔒"}
                    </div>

                    <strong
                      style={{
                        display:
                          "block",
                        fontSize:
                          "15px"
                      }}
                    >
                      {
                        badge.name
                      }
                    </strong>

                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "5px"
                      }}
                    >
                      {
                        badge.message
                      }
                    </small>

                    <div
                      style={{
                        marginTop:
                          "8px",
                        fontWeight:
                          "bold",
                        color:
                          earned
                            ? "#315c48"
                            : "#777"
                      }}
                    >
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

        {/* =====================
            FAITH TREE
        ===================== */}

        <section
          style={{
            background:
              "white",
            borderRadius:
              "25px",
            padding:
              "25px",
            marginTop:
              "20px",
            textAlign:
              "center",
            boxShadow:
              "0 4px 15px rgba(0,0,0,.08)"
          }}
        >
          <div
            style={{
              fontSize:
                "70px",
              marginBottom:
                "10px"
            }}
          >
            {faithTree.tree}
          </div>

          <h2
            style={{
              color:
                "#315c48"
            }}
          >
            {
              faithTree.title
            }
          </h2>

          <p
            style={{
              fontSize:
                "17px",
              lineHeight:
                "1.6"
            }}
          >
            {
              faithTree.message
            }
          </p>

          <div
            style={{
              marginTop:
                "15px",
              background:
                "#e9f4ed",
              borderRadius:
                "15px",
              padding:
                "15px"
            }}
          >
            <strong>
              {faithTree.icon} Faith Tree Progress
            </strong>

            <p
              style={{
                margin:
                  "8px 0 0"
              }}
            >
              {
                completed.length
              }{" "}
              / 180 lessons completed
            </p>

            <p
              style={{
                margin:
                  "5px 0 0",
                fontWeight:
                  "bold"
              }}
            >
              {
                completionPercent
              }
              % Complete
            </p>
          </div>

          <p
            style={{
              marginTop:
                "18px",
              fontSize:
                "15px",
              color:
                "#666"
            }}
          >
            {completed.length >=
            25
              ? "Every completed lesson helps your Faith Tree grow stronger! 🌿"
              : "Every completed lesson helps your Faith Tree grow! 🌱"}
          </p>
        </section>

        {/* =====================
            FOOTER
        ===================== */}

        <footer
          style={{
            textAlign:
              "center",
            marginTop:
              "30px",
            padding:
              "10px 10px 20px",
            color:
              "#777",
            fontSize:
              "14px"
          }}
        >
          <p>
            Faith Foundations:
            The M&M Adventure
          </p>

          <p>
            Growing in God's Word —
            one day at a time. 🌱
          </p>
        </footer>
      </div>

      {/* =========================
          CELEBRATION MODAL
      ========================= */}

      {celebration && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.55)",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding:
              "20px",
            zIndex:
              9999
          }}
        >
          <div
            style={{
              background:
                "white",
              borderRadius:
                "25px",
              padding:
                "30px 24px",
              maxWidth:
                "500px",
              width:
                "100%",
              textAlign:
                "center",
              boxShadow:
                "0 10px 40px rgba(0,0,0,.25)"
            }}
          >
            <div
              style={{
                fontSize:
                  "64px",
                marginBottom:
                  "8px"
              }}
            >
              {celebration.badge
                ? celebration.badge.icon
                : "🎉"}
            </div>

            <h2
              style={{
                color:
                  "#315c48",
                fontSize:
                  "28px",
                margin:
                  "5px 0 12px"
              }}
            >
              {
                celebration.title
              }
            </h2>

            <p
              style={{
                fontSize:
                  "18px",
                lineHeight:
                  "1.6"
              }}
            >
              {
                celebration.message
              }
            </p>

            {celebration.badge && (
              <div
                style={{
                  background:
                    "#e9f4ed",
                  borderRadius:
                    "16px",
                  padding:
                    "15px",
                  margin:
                    "18px 0"
                }}
              >
                <strong>
                  🏅{" "}
                  {
                    celebration.badge
                      .name
                  }
                </strong>

                <p
                  style={{
                    margin:
                      "5px 0 0"
                  }}
                >
                  Badge Earned!
                </p>
              </div>
            )}

            <div
              style={{
                background:
                  "#fffaf0",
                borderRadius:
                  "15px",
                padding:
                  "14px",
                marginBottom:
                  "18px"
              }}
            >
              <strong>
                🌳 Faith Tree Progress
              </strong>

              <p
                style={{
                  margin:
                    "6px 0 0"
                }}
              >
                {
                  celebration.count
                }{" "}
                / 180 lessons completed
              </p>
            </div>

            <button
              onClick={() =>
                setCelebration(
                  null
                )
              }
              style={{
                width:
                  "100%",
                padding:
                  "15px",
                border:
                  "none",
                borderRadius:
                  "14px",
                background:
                  "#315c48",
                color:
                  "white",
                fontSize:
                  "18px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer"
              }}
            >
              🌱 Keep Growing!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================
   BUTTON STYLES
========================= */

const navButton = {
  padding:
    "10px 15px",
  borderRadius:
    "12px",
  border:
    "none",
  background:
    "#315c48",
  color:
    "white",
  fontWeight:
    "bold",
  cursor:
    "pointer"
};

const bottomButton = {
  flex: 1,
  padding:
    "14px",
  border:
    "none",
  borderRadius:
    "14px",
  color:
    "white",
  fontSize:
    "16px",
  fontWeight:
    "bold",
  cursor:
    "pointer"
};

const audioButton = {
  flex:
    "1 1 140px",
  minWidth:
    "120px",
  padding:
    "11px 8px",
  border:
    "none",
  borderRadius:
    "11px",
  color:
    "white",
  fontSize:
    "14px",
  fontWeight:
    "bold",
  cursor:
    "pointer",
  whiteSpace:
    "nowrap"
};

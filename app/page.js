export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #e9f7e8 0%, #fff8e7 55%, #f7ead8 100%)",
        fontFamily: "Arial, sans-serif",
        color: "#3d4b35",
        paddingBottom: "40px",
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: "center",
          padding: "45px 20px 25px",
        }}
      >
        <div style={{ fontSize: "70px" }}>🌳</div>

        <h1
          style={{
            fontSize: "38px",
            margin: "5px 0",
            fontWeight: "800",
          }}
        >
          Faith Foundations
        </h1>

        <h2
          style={{
            fontSize: "25px",
            margin: "5px 0 15px",
            fontWeight: "600",
          }}
        >
          The M&M Adventure
        </h2>

        <p
          style={{
            fontSize: "18px",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: "1.5",
          }}
        >
          Every child's faith matters. ❤️
        </p>
      </header>

      {/* Adventure Card */}
      <section
        style={{
          maxWidth: "600px",
          margin: "10px auto",
          padding: "30px 22px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "28px",
            padding: "30px 22px",
            textAlign: "center",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "55px" }}>📖</div>

          <h2 style={{ fontSize: "28px", margin: "10px 0" }}>
            Your Bible Adventure Awaits!
          </h2>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.6",
              marginBottom: "25px",
            }}
          >
            Learn about God, explore the Bible, complete fun activities,
            and watch your Faith Tree grow!
          </p>

         <a
  href="/Lessons"
  style={{
    display: "inline-block",
    textDecoration: "none",
    borderRadius: "18px",
    padding: "16px 30px",
    fontSize: "19px",
    fontWeight: "700",
    background: "#6b9e5b",
    color: "white",
  }}
>
  🌟 Start Today's Adventure
</a>
        </div>
      </section>

      {/* Feature Cards */}
      <section
        style={{
          maxWidth: "700px",
          margin: "10px auto",
          padding: "10px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "15px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "22px 12px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: "38px" }}>📚</div>
          <strong>180 Lessons</strong>
          <p style={{ fontSize: "14px" }}>Learn God's Word</p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "22px 12px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: "38px" }}>🌱</div>
          <strong>Faith Tree</strong>
          <p style={{ fontSize: "14px" }}>Watch your faith grow</p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "22px 12px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: "38px" }}>🏆</div>
          <strong>Rewards</strong>
          <p style={{ fontSize: "14px" }}>Earn badges</p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "22px 12px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: "38px" }}>🙏</div>
          <strong>Prayer</strong>
          <p style={{ fontSize: "14px" }}>Talk with God</p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "35px 20px 10px",
          fontSize: "14px",
        }}
      >
        🌳 Faith Foundations: The M&M Adventure
        <br />
        <em>Growing faith, one adventure at a time.</em>
      </footer>
    </main>
  );
}

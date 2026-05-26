import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        backgroundColor: "#E6F7EF",
        minHeight: "100vh",
        fontFamily: "Calisto MT, serif",
        margin: 0,
        padding: 0,
      }}
    >

     {/* NAVBAR */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px 40px",
  }}
>

  {/* LOGO */}

  <div
    style={{
      fontSize: "28px",
      fontWeight: "700",
      letterSpacing: "1px",
    }}
  >
    MeritOrbit
  </div>


  {/* NAV BUTTONS */}

  <div
    style={{
      display: "flex",
      gap: "14px",
      alignItems: "center",
    }}
  >

    <a
      href="/login"
      style={{
        padding: "8px 18px",
        border: "1px solid gray",
        borderRadius: "8px",
        textDecoration: "none",
        color: "black",
        fontSize: "16px",
      }}
    >
      Login
    </a>

    <a
      href="/signup"
      style={{
        padding: "8px 18px",
        borderRadius: "8px",
        backgroundColor: "black",
        color: "white",
        textDecoration: "none",
        fontSize: "16px",
        fontWeight: "500",
      }}
    >
      Sign Up
    </a>

  </div>

</div>

      {/* HERO */}
      <div style={{ textAlign: "center", marginTop: "120px" }}>

        <h1 style={{ fontSize: "90px", fontWeight: "600" }}>
          MeritOrbit
        </h1>

        <p style={{ fontSize: "22px", marginBottom: "30px" }}>
          Hire verified engineers
        </p>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >

          <Link href="/login">
            <button
              style={{
                padding: "10px 25px",
                borderRadius: "10px",
                border: "1px solid gray",
                background: "white",
                cursor: "pointer",
              }}
            >
              Engineer
            </button>
          </Link>

          <Link href="/recruiter">
            <button
              style={{
                padding: "10px 25px",
                borderRadius: "10px",
                border: "1px solid gray",
                background: "white",
                cursor: "pointer",
              }}
            >
              Recruiter
            </button>
          </Link>

        </div>

        {/* STATS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "80px",
            fontSize: "18px",
          }}
        >
          <div>
            <div style={{ fontSize: "24px", fontWeight: "600" }}>100k+</div>
            <div>Engineers</div>
          </div>

          <div>
            <div style={{ fontSize: "24px", fontWeight: "600" }}>30k+</div>
            <div>Recruiters</div>
          </div>

          <div>
            <div style={{ fontSize: "24px", fontWeight: "600" }}>10k+</div>
            <div>Hires</div>
          </div>
        </div>

      </div>


      {/* WHY MERITLAYER */}
      <div style={{ marginTop: "140px", textAlign: "center" }}>

        <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>
          Why MeritOrbit
        </h2>

        <p style={{ marginBottom: "40px" }}>
          A new way to hire engineers based on proven technical skills.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "80px",
            flexWrap: "wrap",
          }}
        >

          <div style={{ maxWidth: "250px" }}>
            <h3>Skill Verification</h3>
            <p>Engineers prove their abilities through coding challenges.</p>
          </div>

          <div style={{ maxWidth: "250px" }}>
            <h3>Merit Score</h3>
            <p>Every engineer receives a credibility score.</p>
          </div>

          <div style={{ maxWidth: "250px" }}>
            <h3>Trusted Hiring</h3>
            <p>Recruiters hire based on real engineering ability.</p>
          </div>

        </div>
      </div>


      {/* HOW MERITLAYER WORKS */}
      <div style={{ marginTop: "140px", textAlign: "center" }}>

        <h2 style={{ fontSize: "40px", marginBottom: "40px" }}>
          How MeritOrbit Works
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "80px",
            flexWrap: "wrap",
          }}
        >

          <div style={{ maxWidth: "250px" }}>
            <h3>Engineers Complete Challenges</h3>
            <p>Engineers prove their technical ability through coding challenges.</p>
          </div>

          <div style={{ maxWidth: "250px" }}>
            <h3>Merit Score Generated</h3>
            <p>MeritLayer evaluates performance and generates a credibility score.</p>
          </div>

          <div style={{ maxWidth: "250px" }}>
            <h3>Recruiters Hire Engineers</h3>
            <p>Recruiters discover engineers based on proven technical ability.</p>
          </div>

        </div>
      </div>


      {/* WHY ENGINEERS JOIN */}
      <div style={{ marginTop: "140px", textAlign: "center" }}>

        <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>
          Why Engineers Join MeritOrbit
        </h2>

        <p>Prove real skills through coding challenges.</p>
        <p>Build a verified engineering profile.</p>
        <p>Get discovered by recruiters.</p>

      </div>


      {/* WHY RECRUITERS USE */}
      <div style={{ marginTop: "120px", textAlign: "center" }}>

        <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>
          Why Recruiters Use MeritOrbit
        </h2>

        <p>Hire engineers based on real technical ability.</p>
        <p>Discover verified talent faster.</p>
        <p>Reduce hiring time.</p>

      </div>


      {/* FINAL CTA */}
      <div style={{ marginTop: "140px", textAlign: "center" }}>

        <h2 style={{ fontSize: "40px", marginBottom: "30px" }}>
          Start Hiring Verified Engineers
        </h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>

          <Link href="/signup">
            <button
              style={{
                padding: "12px 30px",
                borderRadius: "10px",
                border: "1px solid gray",
                background: "white",
                cursor: "pointer",
              }}
            >
              Join as Engineer
            </button>
          </Link>

          <Link href="/signup">
            <button
              style={{
                padding: "12px 30px",
                borderRadius: "10px",
                border: "1px solid gray",
                background: "white",
                cursor: "pointer",
              }}
            >
              Hire Engineers
            </button>
          </Link>

        </div>
      </div>

{/* CONTACT US */}

<div
  style={{
    marginTop: "120px",
    textAlign: "center",
  }}
>

  <h2
    style={{
      fontSize: "40px",
      marginBottom: "20px",
    }}
  >
    Contact Us
  </h2>

  <p
    style={{
      marginBottom: "30px",
    }}
  >
    For support, partnerships, or hiring inquiries.
  </p>

  <a
    href="mailto:meritorbitofficial@gmail.com"
    style={{
      textDecoration: "none",
    }}
  >

    <button
      style={{
        padding: "12px 30px",
        borderRadius: "10px",
        border: "1px solid gray",
        background: "white",
        cursor: "pointer",
      }}
    >
      Contact Us
    </button>

  </a>

</div>

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          marginTop: "140px",
          paddingBottom: "40px",
        }}
      >
        © 2026 MeritOrbit
      </div>

    </main>
  );
}
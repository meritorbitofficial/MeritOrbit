export default function CodePage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
        Coding Challenge
      </h1>

      <p style={{ marginBottom: "20px" }}>
        Write a function that returns the sum of two numbers.
      </p>

      <textarea
        placeholder="Write your code here..."
        style={{
          width: "100%",
          height: "200px",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <br />

      <button
        style={{
          marginTop: "20px",
          background: "#111",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Submit Solution
      </button>
    </div>
  );
}
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchEmbedding() {
    setError(null);
    setEmbedding(null);

    try {
      const response = await fetch("/api/embedding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmbedding(data.embedding);
      } else {
        setError(data.error || "Failed to fetch embedding");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    <div 
      style={{ 
        textAlign: "center", 
        padding: "50px", 
        background: "linear-gradient(135deg, #e0f3e0 0%, #e6f2f6 100%)",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        color: "#2c3e50"
      }}
    >
      <h1 
        style={{ 
          fontSize: "2.5rem", 
          marginBottom: "30px", 
          color: "#2ecc71", 
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)" 
        }}
      >
        OpenAI Embedding Tester
      </h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        style={{ 
          padding: "12px 15px", 
          width: "300px", 
          marginBottom: "15px", 
          borderRadius: "8px", 
          border: "2px solid #3498db", 
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          fontSize: "16px",
          transition: "all 0.3s ease"
        }}
      />
      <br />
      <button 
        onClick={fetchEmbedding} 
        style={{ 
          padding: "12px 25px", 
          backgroundColor: "#2ecc71", 
          color: "white", 
          border: "none", 
          borderRadius: "8px", 
          cursor: "pointer", 
          fontSize: "16px",
          transition: "all 0.3s ease",
          boxShadow: "0 3px 6px rgba(0,0,0,0.16)"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.backgroundColor = "#27ae60";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#2ecc71";
        }}
      >
        Get Embedding
      </button>

      {error && <p style={{ color: "#e74c3c", marginTop: "15px" }}>{error}</p>}

      {embedding && (
        <div 
          style={{ 
            marginTop: "20px", 
            textAlign: "left", 
            maxWidth: "600px", 
            margin: "auto", 
            backgroundColor: "#f4f6f7", 
            padding: "20px", 
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
        >
          <h3 style={{ color: "#3498db", marginBottom: "10px" }}>Embedding:</h3>
          <pre 
            style={{ 
              whiteSpace: "pre-wrap", 
              backgroundColor: "#ecf0f1", 
              padding: "15px", 
              borderRadius: "6px",
              overflowX: "auto"
            }}
          >
            {JSON.stringify(embedding, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
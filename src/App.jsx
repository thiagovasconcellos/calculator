import Calculator from "./Calculator"

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "400px",
          height: "600px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <Calculator />
      </div>
    </div>
  );
}

export default App

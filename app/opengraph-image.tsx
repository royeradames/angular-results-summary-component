import { ImageResponse } from "next/og";
import results from "./data.json";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const overall = Math.round(results.reduce((total, result) => total + result.score, 0) / results.length);

export const alt = `Results Summary: an overall score of ${overall} out of 100 with ${results.length} category scores`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ecf2ff" }}>
        <div style={{ display: "flex", width: 960, height: 480, borderRadius: 48, background: "#ffffff", boxShadow: "0 30px 60px rgba(61,108,236,0.15)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 480, borderRadius: 48, background: "linear-gradient(#7755ff, #2f2ce9)", color: "#ffffff" }}>
            <div style={{ display: "flex", fontSize: 36, fontWeight: 700, color: "#f0ecff" }}>Your Result</div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 140, fontWeight: 800 }}>{String(overall)}</div>
            <div style={{ display: "flex", fontSize: 32, color: "#f0ecff" }}>of 100</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 56, flex: 1, fontSize: 32, color: "#303b59" }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 700, marginBottom: 24 }}>Summary</div>
            {results.map((result) => (
              <div key={result.category} style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <span>{String(result.category)}</span>
                <span style={{ fontWeight: 700 }}>{`${result.score} / 100`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

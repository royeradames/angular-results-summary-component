import Image from "next/image";
import results from "./data.json";

const overallScore = Math.round(results.reduce((total, result) => total + result.score, 0) / results.length);

export default function Home() {
  return (
    <div className="page-shell">
      <main>
        <article className="results-card" aria-labelledby="result-title" aria-describedby="sample-notice">
          <section className="result-panel">
            <h1 id="result-title">Your Result</h1>
            <p className="overall-score"><strong>{overallScore}</strong><span>of 100</span></p>
            <h2>Great</h2>
            <p className="comparison">You scored higher than 65% of the people who have taken these tests.</p>
          </section>
          <section className="summary-panel" aria-labelledby="summary-title">
            <h2 id="summary-title">Summary</h2>
            <dl className="category-results">
              {results.map((result) => (
                <div className="category-result" data-category={result.category.toLowerCase()} key={result.category}>
                  <dt><Image src={result.icon.replace("./", "/")} width={20} height={20} alt="" unoptimized />{result.category}</dt>
                  <dd><strong>{result.score}</strong><span> / 100</span></dd>
                </div>
              ))}
            </dl>
            <details className="continue-disclosure">
              <summary>Continue<span className="sr-only"> — about this sample</span></summary>
              <p>This is the end of the sample. No assessment is connected and no result is stored.</p>
            </details>
          </section>
        </article>
      </main>
      <footer>
        <p id="sample-notice">Sample results supplied by Frontend Mentor.</p>
        <p>Challenge by <a href="https://www.frontendmentor.io/challenges/results-summary-component-CE_K6s0maV">Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.</p>
      </footer>
    </div>
  );
}

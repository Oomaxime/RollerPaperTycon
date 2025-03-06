export default function ArrowAnimation() {
  return (
    <div className="arrows-container">
      <svg
        className="arrow arrow-left"
        width="120"
        height="150"
        viewBox="0 0 120 150"
      >
        <path
          d="M20,140 Q40,100 30,70 Q25,50 40,30 L30,40 M40,30 L50,35"
          stroke="#333"
          strokeWidth="3"
          fill="none"
        />
      </svg>
      <svg
        className="arrow arrow-right"
        width="120"
        height="150"
        viewBox="0 0 120 150"
      >
        <path
          d="M100,140 Q80,100 90,70 Q95,50 80,30 L90,40 M80,30 L70,35"
          stroke="#333"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  );
}

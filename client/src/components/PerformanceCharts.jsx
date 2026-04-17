import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const CHART_COLORS = [
  "rgba(59, 130, 246, 0.85)",
  "rgba(139, 92, 246, 0.85)",
  "rgba(16, 185, 129, 0.85)",
  "rgba(245, 158, 11, 0.85)",
  "rgba(239, 68, 68, 0.85)",
  "rgba(236, 72, 153, 0.85)",
  "rgba(6, 182, 212, 0.85)",
  "rgba(132, 204, 22, 0.85)",
  "rgba(249, 115, 22, 0.85)",
  "rgba(168, 85, 247, 0.85)",
  "rgba(20, 184, 166, 0.85)",
  "rgba(244, 63, 94, 0.85)",
  "rgba(99, 102, 241, 0.85)",
  "rgba(234, 179, 8, 0.85)",
  "rgba(14, 165, 233, 0.85)",
];

const CHART_BORDERS = CHART_COLORS.map((color) => color.replace("0.85", "1"));

const ComparisonBarChart = ({ academicScore, assessmentScore }) => {
  const data = {
    labels: ["Academic Score (A)", "Assessment Score (B)"],
    datasets: [
      {
        label: "Score (%)",
        data: [academicScore, assessmentScore],
        backgroundColor: [
          "rgba(59, 130, 246, 0.75)",
          "rgba(139, 92, 246, 0.75)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 1.5,
        borderRadius: 8,
        barPercentage: 0.55,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        callbacks: {
          label: (context) => `${context.parsed.x.toFixed(1)}%`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (value) => `${value}%`,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#e2e8f0",
          font: { size: 12, weight: "500" },
        },
      },
    },
  };

  return (
    <div style={{ height: "160px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

const TopicDoughnutChart = ({ areaScores }) => {
  if (!areaScores || areaScores.length === 0) {
    return null;
  }

  const data = {
    labels: areaScores.map((area) => area.area),
    datasets: [
      {
        data: areaScores.map((area) => area.score),
        backgroundColor: CHART_COLORS.slice(0, areaScores.length),
        borderColor: CHART_BORDERS.slice(0, areaScores.length),
        borderWidth: 1.5,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#cbd5e1",
          font: { size: 11 },
          padding: 10,
          usePointStyle: true,
          pointStyleWidth: 12,
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        callbacks: {
          label: (context) => {
            const area = areaScores[context.dataIndex];
            return `${area.score} / ${area.maxScore}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

const PerformanceCharts = ({ analysis }) => {
  const perf = analysis?.performance_analysis;
  const hasComparison = perf?.available && perf.academicScore != null && perf.assessmentScore != null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="dashboard-card p-6">
        <p className="section-label">Comparison</p>
        <h3 className="mt-2 text-lg font-semibold text-white">Academic vs Assessment</h3>
        {hasComparison ? (
          <div className="mt-4">
            <ComparisonBarChart
              academicScore={perf.academicScore}
              assessmentScore={perf.assessmentScore}
            />
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            {perf?.message || "Academic data not available for comparison."}
          </p>
        )}
      </div>

      <div className="dashboard-card p-6">
        <p className="section-label">Distribution</p>
        <h3 className="mt-2 text-lg font-semibold text-white">Topic Score Breakdown</h3>
        {analysis?.areaScores?.length > 0 ? (
          <div className="mt-4">
            <TopicDoughnutChart areaScores={analysis.areaScores} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">No topic data available.</p>
        )}
      </div>
    </div>
  );
};

export { PerformanceCharts };

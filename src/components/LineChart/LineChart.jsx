import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { labelSevenDaysAgo } from '../../utils/chartLabel';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      fullSize: true,
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false
      }
    }
  },
  elements: {
    line: {
      tension: 0.4 // smooth lines
    }
  }
};
const labels = labelSevenDaysAgo();

const LineChart = ({ dataArr = [] }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Message',
        data: dataArr,
        borderColor: '#f34a5e',
        fill: true,
        backgroundColor: 'rgba(243, 74, 94, 0.1)'
      }
    ]
  };
  return <Line data={data} options={options} />;
};

export default LineChart;

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import COLOR from '../../constants/color';
ChartJS.register(ArcElement, Tooltip, Legend);
const options = {
  responsive: true,
  offset: 12
};
const DoughnutChart = ({ dataArr = [] }) => {
  const data = {
    labels: ['Single', 'Group'],
    datasets: [
      {
        label: 'My First Dataset',
        data: dataArr,
        backgroundColor: ['#f48eb1', '#8eb1f4'],
        borderColor: COLOR.PINK_LIGHT,
        hoverOffset: 4
      }
    ]
  };
  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;

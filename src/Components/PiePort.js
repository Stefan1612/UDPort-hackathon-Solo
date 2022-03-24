/* 
 // Unnecessary code for now, but can be useful in the future
import { Line, Pie, Chart } from 'react-chartjs-2';

import { Chart as ChartJS } from 'chart.js/auto'



const PiePort = (props) => {


  
  const options = {
    legend: {
      plugins : {
        display: true,
        position: "bottom"
        }
      }
      
  }
  return <div>
      <div className="col-md-6 offset-md-5 graph">
      <Pie 
      data={props.pieDataMarketCap}
      options={options} />
      </div>
     
  </div>;
};

export default PiePort; 
*/

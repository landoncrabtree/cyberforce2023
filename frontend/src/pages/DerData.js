import { useParams } from 'react-router-dom';
import '../styles/DerData.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import DoughnutChart from '../components/charts/Doughnut';
import EffGauge from '../components/charts/EffGauge';
import BatteryTempGuage from '../components/charts/BatteryTempGuage';
import HealthGuage from '../components/charts/HealthGuage';
import PowerConsumption from '../components/charts/PowerConsumption';
import SolarIrradiance from '../components/charts/SolarIrradiance';

function DerData() {
  const { role } = useContext(AuthContext);
  const { id } = useParams();

  const userBasedContent = () => {
    if (!role) {
      return (
        <div className='der-wrapper'>
          <div className='title' colSpan={2}>
            <h2>DER8.9</h2>
            <h2>Charts Examples</h2>
          </div>
          <div className='box'>
            <h3>Grid Health</h3>
            <HealthGuage />
          </div>
          <div className='box'>
            <h3>Battery Temperature (avg)</h3>
            <BatteryTempGuage />
          </div>
        </div>
      );
    }
    if (role === 'user') {
      return (
        <div className='der-wrapper'>
          <div className='title'>
            <h2>{role} Charts</h2>
          </div>
          <div className='box'>
            <h3>Grid Health</h3>
            <HealthGuage />
          </div>
          <div className='box'>
            <h3>Battery Temperature (avg)</h3>
            <BatteryTempGuage />
          </div>
          <div className='box'>
            <h3>Live Solar Irradiance</h3>
            <SolarIrradiance />
          </div>
        </div>
      );
    }
    if (role === 'admin') {
      return (
        <div className='der-wrapper'>
          <div className='title'>
            <h2>{role} Charts</h2>
          </div>
          <div className='box'>
            <h3>Grid Health</h3>
            <HealthGuage />
          </div>
          <div className='box'>
            <h3>Battery Temperature (avg)</h3>
            <BatteryTempGuage />
          </div>
          <div className='box'>
            <h3>Live Power Consumption</h3>
            <PowerConsumption />
          </div>
          <div className='box'>
            <h3>Live Solar Irradiance</h3>
            <SolarIrradiance />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className='der-wrapper'>
          <div className='title' colSpan={2}>
            <h2>DER8.9</h2>
            <h2>Charts Examples</h2>
          </div>
          <div className='box'>
            <h3>Grid Health</h3>
            <HealthGuage />
          </div>
          <div className='box'>
            <h3>Battery Temperature (avg)</h3>
            <BatteryTempGuage />
          </div>
        </div>
      );
    }
  };
  return <div className='content-container '>{userBasedContent()}</div>;
}

export default DerData;

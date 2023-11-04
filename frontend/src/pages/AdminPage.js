import React, { useEffect, useContext } from 'react';
import '../styles/AdminPage.css';
import { AdminContext } from '../context/AdminContext';
import { AuthContext } from '../context/AuthContext';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import DoughnutChart from '../components/charts/Doughnut';
import EffGauge from '../components/charts/EffGauge';
import TempGauge from '../components/charts/BatteryTempGuage';
import AdminSideBar from '../components/AdminSidbar';
import AdminReqCards from '../components/AdminReqCards';
import AdminUserCards from '../components/AdminUserCards';


function AdminPage() {
  const { role } = useContext(AuthContext);
  const {
    fetchContactRequests,
    fetchUsers,
    registeredUsers,
    activeTab,
  } = useContext(AdminContext);

  useEffect(() => {
    if (activeTab === 'contactSubmissions') {
      fetchContactRequests();

    }
    if (activeTab === 'registeredUsers') {
      fetchUsers();
    }
  }, [activeTab]);

  const renderContent = () => {
    if (activeTab === 'contactSubmissions') {
      return <AdminReqCards />;
    }
    if (activeTab === 'registeredUsers') {
      return <AdminUserCards />;
    }
    else {
      switch (activeTab) {
        case 'dashboard':
          return <div>
            <h2>Admin Dashboard</h2>

            <div className="adminPageParagraphs">JakaaGen Inc, DER8.9, stands as a prominent leader in the utility sector, known for its commitment to excellence. Our innovative Distributed Energy Resources (DER) solutions have made a significant impact on the industry, seamlessly integrating with the energy grid to enhance efficiency and sustainability. Through a forward-thinking approach, we've fostered cross-functional collaboration, creating an environment where employees are encouraged to explore creative ideas and embrace the potential of the utility of the future. Our dedication to harnessing the capabilities of Big Data, IoT, and AI has resulted in remarkable operational excellence and high customer satisfaction. JakaaGen Inc, DER8.9, offers more than just a workplace; it provides a transformative journey where we work towards reshaping the energy landscape, all while upholding our core values of sustainability, innovation, and a strong focus on our customers. Join us in our mission to create a brighter, greener, and more connected future.</div>

            <div className="adminPageParagraphs">Creating new job positions is essential for expanding a company's capabilities and responding to evolving market demands. These positions offer opportunities for both current employees seeking growth and external talent to contribute their expertise and drive organizational success.</div>

            <ul className="adminJobPositions">
              <li><b>Solutions Engineer</b>: As a DER Solutions Engineer, you will be responsible for designing and implementing distributed energy resource solutions, ensuring seamless integration with the energy grid. Your role involves collaborating with cross-functional teams to optimize DER performance and customer satisfaction.</li>
              <li><b>Data Scientist</b>: Join our team as a Data Scientist specializing in DER Analytics. You will play a pivotal role in harnessing the power of data to drive insights, optimize operations, and improve the efficiency of our distributed energy resources.</li>
              <li><b>Software Engineer</b>: As a Software Engineer, you will be responsible for developing and maintaining software solutions for our DER products. You will work closely with the product development team to ensure that our software solutions meet the highest standards of quality and performance.</li>
              <li><b>IoT Specialist</b>: We are seeking an IoT Specialist to develop and manage our Internet of Things infrastructure for DER applications. Your role will include designing, implementing, and maintaining IoT systems that enhance our operational excellence and customer experiences.</li>
              <li><b>AI Specialist</b>: Join our team as an AI Specialist to develop and manage our Artificial Intelligence infrastructure for DER applications. Your role will include designing, implementing, and maintaining AI systems that enhance our operational excellence and customer experiences.</li>
              <li><b>Renewable Energy Specialist</b>: As a Renewable Energy Analyst, you will be tasked with evaluating and forecasting renewable energy trends and their impact on our DER solutions. Your insights will guide our decision-making processes.</li>
            </ul>

            <div className="adminPageParagraphs">If you, or anyone you know, would be fit for any of these positions, please reach out to HR with a resume and cover letter.</div>

          </div >;
        case 'settings':
          return <h2>Settings Content</h2>;
        default:
          return <div>No data available or an error occurred.</div>;
      }
    }
  };

  return (
    <div className='content-container flex'>
      <AdminSideBar />

      <div className='admin-container'>{renderContent()}</div>
    </div>
  );
}

export default AdminPage;

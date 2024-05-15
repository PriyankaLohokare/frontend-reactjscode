import './App.css';
import EmployeeList from './components/EmployeeList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <ToastContainer />
    <EmployeeList />
    </>
  );
}

export default App;

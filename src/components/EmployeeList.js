import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import AddEditEmployee from './AddEditEmployee';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeList() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployeeData = () => {
    axios.get('https://localhost:44396/api/Employee')
      .then((response) => {

        setData(response.data);

      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
      });
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const addEmployee = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const editEmployee = (employeeId) => {
    const employee = data.find(emp => emp.id === employeeId);
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const deleteEmployee = (employeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      axios.delete(`https://localhost:44396/api/Employee/${employeeId}`)
        .then(() => {
          fetchEmployeeData();
          toast.success('Employee deleted successfully!');
        })
        .catch((error) => {
          toast.error('Failed to dalete employee.');
          console.error('Error deleting employee:', error);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <>
      <br />
      <button className='btn btn-success' onClick={addEmployee}>
        <FontAwesomeIcon icon={faPlusCircle} /> Add Employee
      </button>
      <br />
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birth Date</th>
            <th>Joining Date</th>
            <th>Address</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? data.map((employee, index) => {
            return (
              <tr key={employee.id}>
                <td>{index + 1}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{formatDate(employee.birthDate)}</td> {/* Format birthDate */}
                <td>{formatDate(employee.joiningDate)}</td> {/* Format joiningDate */}
                <td>{employee.address}</td>
                <td>{employee.salary}</td>
                <td colSpan={3}>
                  <button className='btn btn-primary' onClick={() => editEmployee(employee.id)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  {'\u00A0'}
                  <button className='btn btn-danger' onClick={() => deleteEmployee(employee.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            );
          }) : 'No Data Found..'}
        </tbody>
        {showModal &&
          <AddEditEmployee show={showModal} handleClose={handleCloseModal} employee={selectedEmployee} fetchEmployeeData={fetchEmployeeData} />}
      </Table>
    </>
  );
}

export default EmployeeList;

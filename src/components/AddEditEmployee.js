import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DEFAULT_EMPLOYEE_DATA = {
  firstName: '',
  lastName: '',
  birthDate: '',
  joiningDate: '',
  address: '',
  salary: '',
}

function AddEditEmployee({ show, handleClose, employee, fetchEmployeeData }) {

  const [formData, setFormData] = useState({});
  const [fieldError, setFieldErrors] = useState({});

  useEffect(() => {
    setFormData(employee || DEFAULT_EMPLOYEE_DATA);
    return (() => setFieldErrors({}))
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };

  const validate = (fieldName, value) => {
    let formIsValid = true;
    const errors = {};

    if (!formData.firstName) {
      errors.firstName = 'First name is required.';
      formIsValid = false;
    } else if (!/^[a-zA-Z]+$/.test(formData.firstName)) {
      errors.firstName = 'First name should only contain letters.';
      formIsValid = false;
    }

    if (!formData.lastName) {
      errors.lastName = 'Last name is required.';
      formIsValid = false;
    } else if (!/^[a-zA-Z]+$/.test(formData.lastName)) {
      errors.lastName = 'Last name should only contain letters.';
      formIsValid = false;
    }

    if (!formData.salary) {
      errors.salary = 'Salary is required.';
      formIsValid = false;
    }

    if (!formData.birthDate) {
      errors.birthDate = 'Birth Date is required.';
      formIsValid = false;
    }

    if (!formData.joiningDate) {
      errors.joiningDate = 'Joining Date is required.';
      formIsValid = false;
    }
    setFieldErrors(errors);
    return formIsValid;
  };

  const handleSubmit = () => {

    if (validate()) {
      if (employee) {
        editEmployee()
      } else {
        addEmployee()
      }
    }
  };

  const addEmployee = () => {
    axios.post('https://localhost:44396/api/Employee', formData)
      .then((response) => {
        handleClose();
        fetchEmployeeData();
        toast.success('Employee added successfully!');
      })
      .catch((error) => {
        toast.error('Failed to add employee.');
      });
  }


  const editEmployee = () => {
    axios.put(`https://localhost:44396/api/Employee/${employee.id}`, formData)
      .then((response) => {
        handleClose();
        fetchEmployeeData();
        toast.success('Employee updated successfully!');
      })
      .catch((error) => {
        toast.error('Failed to update employee.');
      });
  }


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{employee ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {Object.keys(formData).map(property => {
            if (property.toLowerCase() === 'id') {
              return null;
            }
            return (
              <Form.Group controlId={`form${property}`} key={property}>
                <Form.Label>{capitalizeFirstLetter(property)}</Form.Label>
                {property === 'birthDate' || property === 'joiningDate' ? (
                  <>
                    <br /><DatePicker
                      selected={formData[property] ? new Date(formData[property]) : null}
                      onChange={(date) => handleDateChange(date, property)}
                      dateFormat="MM/dd/yyyy"
                      placeholderText={`Select ${property}`}
                      className="form-control"
                    />
                  </>
                ) : (
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${property}`}
                    name={property}
                    value={formData[property]}
                    onChange={handleChange}
                  />
                )}
                {fieldError[property] && <div className="text-danger">{fieldError[property]}</div>}
              </Form.Group>
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}


export default AddEditEmployee;

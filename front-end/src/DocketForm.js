import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import {Button,Form,Row,Col,Container, FormSelect, Navbar, Modal, Table } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'


export const DocketForm = ({ onDocketSubmit }) => {
  const [dockets, setDockets] = useState([]);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [ratePerHour, setRatePerHour] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch the CSV data from Flask and set it in the state
  useEffect(() => {
    fetch('/api/csv-data')
      .then(response => response.json())
      .then(data => {
        setCsvData(data);
        const uniqueSuppliers = [...new Set(data.map(row => row.Supplier))];
        setSuppliers(uniqueSuppliers);
      })
      .catch(error => {
        console.error('Error fetching CSV data:', error);
      });
  }, []);

  // Update the Purchase Orders dropdown when the selected Supplier changes
  useEffect(() => {
    if (selectedSupplier) {
      const filteredPurchaseOrders = csvData
        .filter(row => row.Supplier === selectedSupplier)
        .map(row => row['PO Number']);
      setPurchaseOrders(filteredPurchaseOrders);
    } else {
      setPurchaseOrders([]);
    }
  }, [selectedSupplier, csvData]);

//------------------------------------------------------------------------------------

useEffect(() => {
    if (selectedSupplier && selectedPurchaseOrder) {
        // Fetch Description when both selectedSupplier and selectedPurchaseOrder are set.
        axios
            .get('/get_description', {
                params: {
                    selectedSupplier,
                    selectedPurchaseOrder,
                },
            })
            .then((response) => {
                setDescription(response.data.Description);
            })
            .catch((error) => {
                console.error('Error fetching Description:', error);
            });
    } else {
        // Clear the Description if either selectedSupplier or selectedPurchaseOrder is empty.
        setDescription('');
    }
}, [selectedSupplier, selectedPurchaseOrder]);

//------------------------------------------------------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    
    try {
    // Send form data to the Flask API
    axios.post('/submit', {
        name : name,
        startTime : startTime,
        endTime: endTime,
        hoursWorked: hoursWorked,
        ratePerHour: ratePerHour,
        selectedSupplier: selectedSupplier,
        selectedPurchaseOrder: selectedPurchaseOrder,
        description: description,
      })
      .then((response) => {
        console.log('Response:', response.data);
        // Optionally, perform actions like showing a success message
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error;
          const { response } = axiosError;
          if (response) {
            console.log('Error Response:', response.data);
            setErrorMessage(response.data.message);
          } else {
            console.error('Network Error:', axiosError.message);
            setErrorMessage('Network Error');
          }
        } else {
          console.error('Non-Axios Error:', error);
          setErrorMessage('An error occurred');
        }
      });
    } catch (error) {
      console.error('Non-Axios Error:', error);
      setErrorMessage('An error occurred');
    }

    // // Create a new docket object
    // const newDocket = {
    //   name,
    //   startTime,
    //   endTime,
    //   hoursWorked,
    //   ratePerHour,
    //   selectedSupplier,
    //   selectedPurchaseOrder,
    // };

    // // Add the new docket to the list of dockets
    // setDockets([...dockets, newDocket]);

    // Clear the form fields
    setName('');
    setStartTime('');
    setEndTime('');
    setHoursWorked('');
    setRatePerHour('');
    setSelectedSupplier('');
    setSelectedPurchaseOrder('');
    setDescription('')
  };



  return (
    <div>
      <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand >Parshva async Assessment</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Candidate name: Mani Bharathy
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <br></br>
    <Container>
        <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3 ">
            <Form.Label column sm={2}>Name:</Form.Label>
            <Col sm={10}>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ">
            <Form.Label column sm={2}>Start Time:</Form.Label>
            <Col sm={10}>
            <Form.Control type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ">
            <Form.Label column sm={2}>End Time:</Form.Label>
            <Col sm={10}>
            <Form.Control type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ">
            <Form.Label column sm={2}>No. of Hours Worked:</Form.Label>
            <Col sm={10}>
            <Form.Control type="number" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} />
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ">
            <Form.Label column sm={2}>Rate per Hour:</Form.Label>
            <Col sm={10}>
            <Form.Control type="number" value={ratePerHour} onChange={(e) => setRatePerHour(e.target.value)} />
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ">
        <Form.Label column sm={2}>Select a Supplier:</Form.Label>
        <Col sm={10}>
        <FormSelect value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
            <option value="">Select a Supplier</option>
            {suppliers.map((supplier, index) => (
            <option key={index} value={supplier}>
                {supplier}
            </option>
            ))}
        </FormSelect>
        </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ">
        <Form.Label column sm={2}>Select a Purchase Order:</Form.Label>
        <Col sm={10}>
        <FormSelect value={selectedPurchaseOrder} onChange={e => setSelectedPurchaseOrder(e.target.value)}>
            <option value="">Select a Purchase Order</option>
            {purchaseOrders.map((purchaseOrder, index) => (
            <option key={index} value={purchaseOrder}>
                {purchaseOrder}
            </option>
            ))}
        </FormSelect>
        </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>Description:</Form.Label>
            <Col sm={10}>
            <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
            {/* <Form.Text>{description}</Form.Text> */}
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
        <Col sm={{ span: 10, offset: 2 }}>
        <Button type="submit">Submit</Button>
        </Col>
        </Form.Group>
        </Form>
        </Container>

        {/* <h2>Created Dockets</h2>
      <ul>
        {dockets.map((docket, index) => (
          <li key={index}>
            <strong>Name:</strong> {docket.name}<br />
            <strong>Start Time:</strong> {docket.startTime}<br />
            <strong>End Time:</strong> {docket.endTime}<br />
            <strong>No. of Hours Worked:</strong> {docket.hoursWorked}<br />
            <strong>Rate per Hour:</strong> {docket.ratePerHour}<br />
            <strong>Supplier Name:</strong> {docket.selectedSupplier}<br />
            <strong>Purchase Order:</strong> {docket.selectedPurchaseOrder}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default DocketForm;

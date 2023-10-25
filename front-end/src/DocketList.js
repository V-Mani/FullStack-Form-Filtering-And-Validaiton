import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Modal,Button } from 'react-bootstrap';

function App() {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      //fetch all docket from database to view in table

      const fetchData = async () => {
        try {
          const response = await fetch('/api/get_all_data');
          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
      // fetch('/api/get_all_data')
      //   .then(response => response.json())
      //   .then(data => setData(data))
      //   .catch(error => console.error(error));
    }, []);

    const handleShowModal = (id) => {
      // Fetch data for selected ID and update selectedData state for modal view
      fetch(`api/get_selected_data/${id}`)
        .then(response => response.json())
        .then(data => {
          setSelectedId(id);
          setSelectedData(data);
          setShowModal(true);
        });
    };
    const handleCloseModal = () => {
      setShowModal(false);
    };

    return (
        <div>
          <Container>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>No. of Hours Worked</th>
                        <th>Rate per Hour</th>
                        <th>Supplier Name</th>
                        <th>Purchase Order</th>
                        <th>Decription</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.startTime}</td>
                            <td>{row.endTime}</td>
                            <td>{row.hoursWorked}</td>
                            <td>{row.ratePerHour}</td>
                            <td>{row.selectedSupplier}</td>
                            <td>{row.selectedPurchaseOrder}</td>
                            <td>{row.decription}</td>
                            <td>
                            <Button variant="primary" onClick={() => handleShowModal(row.id)}>View</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                <Modal.Title>DOCKET - ID: {selectedId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div>
                  <p>ID: {selectedData.id}</p>
                  <p>Name: {selectedData.name}</p>
                  <p>Start Time: {selectedData.startTime}</p>
                  <p>End Time: {selectedData.endTime}</p>
                  <p>Hours Worked: {selectedData.hoursWorked}</p>
                  <p>Rate Per Hour: {selectedData.ratePerHour}</p>
                  <p>Selected Supplier: {selectedData.selectedSupplier}</p>
                  <p>Selected Purchase Order: {selectedData.selectedPurchaseOrder}</p>
                  <p>Description: {selectedData.description}</p>
                </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
              </Modal>
            </Container>
        </div>
    );
}

export default App;

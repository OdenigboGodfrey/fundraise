import React from 'react';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import getImageForFundRaise from '../utils/get-image-for-fund-raise';

import './Home.css';

export function Home({
  closeModal,
  onChange,
  onSubmit,
  modalVisible,
  openModal,
  fundRaises,
  onClickCard
}) {
  return (
    <Container fluid="lg" className="home">
      <CreateModal
        onChange={onChange}
        onClose={closeModal}
        onSubmit={onSubmit}
        show={modalVisible}
      />
      <Row>
        <Col className="home-top-section">
          <div className="home-top-section-overlay"></div>
          <div className="home-button-header-container">
            <h2>Welcome to Decentra-fund</h2>
            <p>A decentralized fund raising app running on the blockchain.</p>
            <Button onClick={openModal} variant="primary">Create Fund Raise</Button>
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col>
          <h2>Fund Raises</h2>
        </Col>
      </Row>
      <Row>
        {fundRaises.map((description) => (
          <Col key={description.id} style={{ marginBottom: '10px' }}>
            <FundRaise
              fundRaiseId={description.id}
              title={description.title}
              onClickCard={onClickCard}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

function FundRaise({
  fundRaiseId,
  title,
  onClickCard
}) {
  const fundRaiseImage = getImageForFundRaise(fundRaiseId);

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={fundRaiseImage}/>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Button onClick={() => onClickCard(fundRaiseId)} variant="primary">See Fund Raise</Button>
      </Card.Body>
    </Card>
  );
}

export default function CreateModal({
  onChange,
  onClose,
  onSubmit,
  show
}) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>Decentra-fund</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" onChange={onChange}/>
          </Form.Group>
          <Form.Group controlId="goal">
            <Form.Label>Goal (ETH)</Form.Label>
            <Form.Control type="text" name="goal" placeholder="1" onChange={onChange}/>
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Post</Form.Label>
            <Form.Control as="textarea" name="description"  onChange={onChange}/>
          </Form.Group>
          <Button variant="secondary" onClick={onClose} className="me-1 mt-1">Close</Button>
          <Button variant="primary" type="submit" className="mt-1">Submit</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
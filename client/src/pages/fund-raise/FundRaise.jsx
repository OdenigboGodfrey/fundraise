import React from 'react'
import { Container, Col, Row, Button, Modal, Form } from 'react-bootstrap'
import getImageForFundRaise from '../utils/get-image-for-fund-raise'

import './FundRaise.css'

export default function FundRaise({
  title,
  id,
  description,
  current,
  goal,
  donateModal
}) {
  const { onClick, show, onClose, onChange, onSubmit } = donateModal

  return (
    <Container fluid="lg">
      <h1 className="mb-3">{title}</h1>
      <Row>
        <Col lg={8}>
          <div className="fund-raise-image" style={{ backgroundImage: `url("${getImageForFundRaise(id)}")` }}></div>
        </Col>
        <Col>
          <div className="fund-raise-side-panel mt-2 mt-lg-0">
            <div className="fund-raise-goal">{current} raised of {goal}...</div>
            <div className="fund-raise-donate-button-container">
              <Button variant="primary" onClick={onClick}>Donate</Button>
            </div>
          </div>
        </Col>
      </Row>
      <p className="mt-3">{description}</p>
      <DonateModal
        onClose={onClose}
        onChange={onChange}
        onSubmit={onSubmit}
        show={show}
      />
    </Container>
  )
}

function DonateModal({
  show,
  onClose,
  onSubmit,
  onChange
}) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>Donate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control type="text" name="amount" onChange={onChange}/>
          </Form.Group>
          <Button variant="secondary" onClick={onClose} className="me-1 mt-1">Close</Button>
          <Button variant="primary" type="submit" className="mt-1">Submit</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
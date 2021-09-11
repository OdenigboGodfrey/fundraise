import React from 'react'
import { Container, Col, Row, Button } from 'react-bootstrap'
import getImageForFundRaise from '../utils/get-image-for-fund-raise'

import './FundRaise.css'

export default function FundRaise({
  title,
  id,
  description,
  current,
  goal
}) {
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
              <Button variant="primary">Donate</Button>
            </div>
          </div>
        </Col>
      </Row>
      <p className="mt-3">{description}</p>
    </Container>
  )
}
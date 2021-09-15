import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Col, Row, Button, Modal, Form } from 'react-bootstrap'
import getImageForFundRaise from '../utils/get-image-for-fund-raise'
import AppContext from '../../app-context'

import './FundRaise.css'

export default function FundRaise({
  title,
  id,
  description,
  current,
  goal,
  closeModal,
  onChange,
  onSubmit,
  modalVisible,
  openModal,
  userIsFundRaiseCreator,
  withdraw,
  active
}) {
  return (
    <Container fluid="lg">
      <h1 className="mb-3">{title}</h1>
      {
        userIsFundRaiseCreator && active ?
          <Row>
            <Col className="p-2">
              <Button variant="danger" onClick={withdraw}>Withdraw</Button>
            </Col>
          </Row> :
          null
      }
      <Row>
        <Col lg={8}>
          <div className="fund-raise-image" style={{ backgroundImage: `url("${getImageForFundRaise(id)}")` }}></div>
        </Col>
        {
          active ?
          <Col>
            <div className="fund-raise-side-panel mt-2 mt-lg-0">
              <div className="fund-raise-goal">{current} raised of {goal}...</div>
              <div className="fund-raise-donate-button-container">
                <Button variant="primary" onClick={openModal}>Donate</Button>
              </div>
            </div>
          </Col> : 
          null
        }
      </Row>
      <p className="mt-3">{description}</p>
      <DonateModal
        onClose={closeModal}
        onChange={onChange}
        onSubmit={onSubmit}
        show={modalVisible}
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
            <Form.Label>Amount (ETH)</Form.Label>
            <Form.Control type="text" name="amount" onChange={onChange}/>
          </Form.Group>
          <Button variant="secondary" onClick={onClose} className="me-1 mt-1">Close</Button>
          <Button variant="primary" type="submit" className="mt-1">Submit</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export function FundRaiseWrapper() {
  const [donateForm, setDonateForm] = useState('')
  const [loading, setLoading] = useState(true)
  const [uiData, setUiData] = useState({})

  const { id } = useParams()

  const { dependencies } = useContext(AppContext)
  const { fundRaise, account, web3 } = dependencies

  useEffect(() => {
    (async function() {
      setUiData(await getFundRaiseData())
    })()
  }, [])
  
  useEffect(() => {
    if (uiData.current) {
      setupDonateListener()
      setupWithdrawListener()
      setLoading(false)
    }
  }, [uiData])

  async function getFundRaiseData() {
    return await fundRaise.methods.fundRaises(id).call()
  }

  function onChange(event) {
    setDonateForm(event.target.value)
  }

  async function onSubmit(event) {
    event.preventDefault()
    await fundRaise.methods.donate(id).send({ from: account, value: web3.utils.toWei(donateForm, 'ether') })
  }

  function setupDonateListener() {
    fundRaise.events.Donated({}, (error, contractEvent) => {
      const { amount } = contractEvent.returnValues
      const updatedTotal = parseInt(amount) + parseInt(uiData.current) + ''
      setUiData(previousState => ({ ...previousState, current: updatedTotal, modalVisible: false }))
    })
  }
  
  function setupWithdrawListener() {
    fundRaise.events.Withdraw({}, (error, contractEvent) => {
      setUiData(previousState => ({ ...previousState, status: false }))
    })
  }

  async function withdraw() {
    await fundRaise.methods.withdraw(id).send({ from: account })
  }

  return (
    !loading ?
      <FundRaise
        title={uiData.title}
        id={id}
        description={uiData.description}
        current={web3.utils.fromWei(uiData.current, 'ether')}
        goal={web3.utils.fromWei(uiData.goal, 'ether')}
        closeModal={() => setUiData(previousState => ({ ...previousState, modalVisible: false }))}
        onChange={onChange}
        onSubmit={onSubmit}
        modalVisible={uiData.modalVisible}
        openModal={() => setUiData(previousState => ({ ...previousState, modalVisible: true }))}
        userIsFundRaiseCreator={uiData.creator === account}
        withdraw={withdraw}
        active={uiData.status}
      /> :
      <div>loading....</div>
  )
}
const FundRaise = artifacts.require('./FundRaise.sol')
const truffleAssert = require('truffle-assert')

contract('FundRaise', (accounts) => {
  const mockTitleEventOne = 'First Fundraising Event'
  const mockTitleEventTwo = 'Startup'
  const DONATION = 1000000
  let fundRaise
  
  before(async () => {
    fundRaise = await FundRaise.deployed()
  })

  describe('createEvent', () => {
    it('should persist a new event into the blockchain', async () => {
      const mockDescription = 'Raising money for my business'
      const mockGoal = 1000
      
      await fundRaise.createEvent(mockTitleEventOne, mockDescription, mockGoal, { from: accounts[1] })
      
      /**
       * 0 is the ID for first event
       * get the new event to ensure persistence
       */
      const newEvent = await fundRaise.fundRaises(0)

      assert.equal(parseInt(newEvent.id.toString()), 0)
      assert.equal(parseInt(newEvent.current.toString()), 0)
      assert.equal(parseInt(newEvent.goal.toString()), mockGoal)
      assert.equal(newEvent.status, true)
      assert.equal(newEvent.creator, accounts[1])
      assert.equal(newEvent.title, mockTitleEventOne)
      assert.equal(newEvent.description, mockDescription)
    })

    it('should increment the id after creating an event successfully', async () => {
      const id = await fundRaise.eventId()
      assert.equal(parseInt(id.toString()), 1)
    })
  })

  describe('donate', () => {
    before(async () => {
      // Donate 1 million wei to the first event
      await fundRaise.donate(0, { from: accounts[2], value: DONATION })
    })

    it('should increase current balance for event', async () => {
      const newEvent = await fundRaise.fundRaises(0)
      assert.equal(parseInt(newEvent.current.toString()), DONATION)
    })
  })

  describe('withdraw', () => {
    it('should not allow non-event creator to withdraw the money', async () => {
      try {
        await fundRaise.withdraw(0, { from: accounts[2] })
        assert.notOk(false)
      } catch (error) {
        assert.ok(error)
      }
    })

    it('should allow event creator to withdraw the money', async () => {
      const firstUser = accounts[1]
      const originalBalance = await web3.eth.getBalance(firstUser)

      const tx = await fundRaise.withdraw(0, { from: firstUser })

      
      truffleAssert.eventEmitted(tx, 'Withdraw', async () => {
        const updatedBalance = await web3.eth.getBalance(firstUser)
        return (
          parseInt(originalBalance) + DONATION === updatedBalance
        )
      })
    })

    it('should close event once user withdraws the money', async () => {
      const event = await fundRaise.fundRaises(0)
      assert.notOk(event.status)
    })
  })

  describe('getHomeData', () => {
    before(async () => {
      // create another event to simulate multiple events
      await fundRaise.createEvent(mockTitleEventTwo, 'I need money for my startup', 250000, { from: accounts[2] })
    })

    it('should return an array of events\' ids and titles', async () => {
      const homeData = await fundRaise.getHomeData()
      const [firstEvent, secondEvent] = homeData
      assert.equal(firstEvent.title, mockTitleEventOne)
      assert.equal(parseInt(firstEvent.id.toString()), 0)
      assert.equal(secondEvent.title, mockTitleEventTwo)
      assert.equal(parseInt(secondEvent.id.toString()), 1)
    })
  })
})
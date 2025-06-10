import paymentData from '../mockData/payments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PaymentService {
  constructor() {
    this.data = [...paymentData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(payment => payment.id === id)
    if (!item) {
      throw new Error('Payment not found')
    }
    return { ...item }
  }

  async create(paymentData) {
    await delay(500)
    const newPayment = {
      id: `pi_${Date.now()}`,
      ...paymentData,
      created: new Date().toISOString()
    }
    this.data.unshift(newPayment)
    return { ...newPayment }
  }

  async update(id, updateData) {
    await delay(400)
    const index = this.data.findIndex(payment => payment.id === id)
    if (index === -1) {
      throw new Error('Payment not found')
    }
    this.data[index] = { ...this.data[index], ...updateData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.data.findIndex(payment => payment.id === id)
    if (index === -1) {
      throw new Error('Payment not found')
    }
    this.data.splice(index, 1)
    return true
  }
}

export default new PaymentService()
import customerData from '../mockData/customers.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CustomerService {
  constructor() {
    this.data = [...customerData]
  }

  async getAll() {
    await delay(250)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(customer => customer.id === id)
    if (!item) {
      throw new Error('Customer not found')
    }
    return { ...item }
  }

  async create(customerData) {
    await delay(400)
    const newCustomer = {
      id: `cus_${Date.now()}`,
      ...customerData,
      created: new Date().toISOString(),
      totalSpent: 0,
      paymentCount: 0
    }
    this.data.unshift(newCustomer)
    return { ...newCustomer }
  }

  async update(id, updateData) {
    await delay(350)
    const index = this.data.findIndex(customer => customer.id === id)
    if (index === -1) {
      throw new Error('Customer not found')
    }
    this.data[index] = { ...this.data[index], ...updateData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.data.findIndex(customer => customer.id === id)
    if (index === -1) {
      throw new Error('Customer not found')
    }
    this.data.splice(index, 1)
    return true
  }
}

export default new CustomerService()
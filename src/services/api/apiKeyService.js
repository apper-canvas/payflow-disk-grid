import apiKeyData from '../mockData/apiKeys.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ApiKeyService {
  constructor() {
    this.data = [...apiKeyData]
  }

  async getAll() {
    await delay(200)
    return [...this.data]
  }

  async getById(id) {
    await delay(150)
    const item = this.data.find(key => key.id === id)
    if (!item) {
      throw new Error('API key not found')
    }
    return { ...item }
  }

  async create(keyData) {
    await delay(400)
    const prefix = keyData.mode === 'test' ? 'sk_test' : 'sk_live'
    const newKey = {
      id: `key_${Date.now()}`,
      ...keyData,
      key: `${prefix}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString(),
      lastUsed: null
    }
    this.data.unshift(newKey)
    return { ...newKey }
  }

  async update(id, updateData) {
    await delay(300)
    const index = this.data.findIndex(key => key.id === id)
    if (index === -1) {
      throw new Error('API key not found')
    }
    this.data[index] = { ...this.data[index], ...updateData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(key => key.id === id)
    if (index === -1) {
      throw new Error('API key not found')
    }
    this.data.splice(index, 1)
    return true
  }
}

export default new ApiKeyService()
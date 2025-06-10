import { toast } from 'react-toastify'

class ApiKeyService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'api_key'
    
    // All fields from api_key table
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'key', 'mode', 'created', 'last_used'
    ]
    
    // Only Updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'key', 'mode', 'created', 'last_used'
    ]
  }

  async getAll(filters = {}) {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [{ fieldName: 'created', SortType: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      }

      if (filters.mode && filters.mode !== 'all') {
        params.where = [
          { fieldName: 'mode', operator: 'ExactMatch', values: [filters.mode] }
        ]
      }

      if (filters.searchTerm) {
        const searchConditions = {
          operator: 'OR',
          subGroups: [{
            conditions: [
              { fieldName: 'Name', operator: 'Contains', values: [filters.searchTerm] },
              { fieldName: 'key', operator: 'Contains', values: [filters.searchTerm] }
            ],
            operator: ''
          }]
        }
        
        if (params.where) {
          params.whereGroups = [searchConditions]
        } else {
          params.whereGroups = [searchConditions]
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching API keys:', error)
      toast.error('Failed to load API keys')
      return []
    }
  }

  async getById(id) {
    try {
      const params = { fields: this.allFields }
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching API key ${id}:`, error)
      toast.error('Failed to load API key')
      return null
    }
  }

  async create(keyData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (keyData.hasOwnProperty(field)) {
          filteredData[field] = keyData[field]
        }
      })

      // Auto-generate key if not provided
      if (!filteredData.key) {
        const prefix = filteredData.mode === 'test' ? 'sk_test' : 'sk_live'
        filteredData.key = `${prefix}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      }

      // Set created timestamp if not provided
      if (!filteredData.created) {
        filteredData.created = new Date().toISOString()
      }

      const params = { records: [filteredData] }
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} API key records:${failedRecords}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success('API key created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error creating API key:', error)
      toast.error('Failed to create API key')
      return null
    }
  }

  async update(id, updateData) {
    try {
      // Filter to only include updateable fields + Id
      const filteredData = { Id: id }
      this.updateableFields.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
          filteredData[field] = updateData[field]
        }
      })

      const params = { records: [filteredData] }
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} API key records:${failedUpdates}`)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('API key updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error updating API key:', error)
      toast.error('Failed to update API key')
      return null
    }
  }

  async delete(id) {
    try {
      const params = { RecordIds: [id] }
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} API key records:${failedDeletions}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('API key deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error deleting API key:', error)
      toast.error('Failed to delete API key')
      return false
    }
  }
}

export default new ApiKeyService()
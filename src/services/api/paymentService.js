import { toast } from 'react-toastify'

class PaymentService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'payment'
    
    // All fields from payment table
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'amount', 'currency1', 'status', 'created', 'payment_method_id', 'payment_method_type',
      'payment_method_brand', 'payment_method_last4', 'payment_method_expiry_month',
      'payment_method_expiry_year', 'metadata', 'customer'
    ]
    
    // Only Updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'amount', 'currency1', 'status', 'created',
      'payment_method_id', 'payment_method_type', 'payment_method_brand',
      'payment_method_last4', 'payment_method_expiry_month', 'payment_method_expiry_year',
      'metadata', 'customer'
    ]
  }

  async getAll(filters = {}) {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [{ fieldName: 'created', SortType: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      }

      if (filters.status && filters.status !== 'all') {
        params.where = [
          { fieldName: 'status', operator: 'ExactMatch', values: [filters.status] }
        ]
      }

      if (filters.searchTerm) {
        const searchConditions = {
          operator: 'OR',
          subGroups: [{
            conditions: [
              { fieldName: 'Name', operator: 'Contains', values: [filters.searchTerm] },
              { fieldName: 'metadata', operator: 'Contains', values: [filters.searchTerm] }
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
      console.error('Error fetching payments:', error)
      toast.error('Failed to load payments')
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
      console.error(`Error fetching payment ${id}:`, error)
      toast.error('Failed to load payment')
      return null
    }
  }

  async create(paymentData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (paymentData.hasOwnProperty(field)) {
          // Convert customer lookup to integer if present
          if (field === 'customer' && paymentData[field]) {
            filteredData[field] = parseInt(paymentData[field])
          } else {
            filteredData[field] = paymentData[field]
          }
        }
      })

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
          console.error(`Failed to create ${failedRecords.length} payment records:${failedRecords}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Payment created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error creating payment:', error)
      toast.error('Failed to create payment')
      return null
    }
  }

  async update(id, updateData) {
    try {
      // Filter to only include updateable fields + Id
      const filteredData = { Id: id }
      this.updateableFields.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
          // Convert customer lookup to integer if present
          if (field === 'customer' && updateData[field]) {
            filteredData[field] = parseInt(updateData[field])
          } else {
            filteredData[field] = updateData[field]
          }
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
          console.error(`Failed to update ${failedUpdates.length} payment records:${failedUpdates}`)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Payment updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error updating payment:', error)
      toast.error('Failed to update payment')
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
          console.error(`Failed to delete ${failedDeletions.length} payment records:${failedDeletions}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Payment deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast.error('Failed to delete payment')
      return false
    }
  }
}

export default new PaymentService()
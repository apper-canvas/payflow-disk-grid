import { toast } from 'react-toastify'

class CustomerService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'Customer1'
    
    // All fields from Customer1 table
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'email', 'created', 'total_spent', 'payment_count', 'default_payment_method_id',
      'default_payment_method_type', 'default_payment_method_brand', 
      'default_payment_method_last4', 'default_payment_method_expiry_month',
      'default_payment_method_expiry_year'
    ]
    
    // Only Updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'email', 'created', 'total_spent', 'payment_count',
      'default_payment_method_id', 'default_payment_method_type', 
      'default_payment_method_brand', 'default_payment_method_last4',
      'default_payment_method_expiry_month', 'default_payment_method_expiry_year'
    ]
  }

  async getAll(filters = {}) {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      }

      if (filters.searchTerm) {
        params.where = [
          { fieldName: 'Name', operator: 'Contains', values: [filters.searchTerm] }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Failed to load customers')
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
      console.error(`Error fetching customer ${id}:`, error)
      toast.error('Failed to load customer')
      return null
    }
  }

  async create(customerData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (customerData.hasOwnProperty(field)) {
          filteredData[field] = customerData[field]
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
          console.error(`Failed to create ${failedRecords.length} customer records:${failedRecords}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Customer created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error creating customer:', error)
      toast.error('Failed to create customer')
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
          console.error(`Failed to update ${failedUpdates.length} customer records:${failedUpdates}`)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Customer updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error updating customer:', error)
      toast.error('Failed to update customer')
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
          console.error(`Failed to delete ${failedDeletions.length} customer records:${failedDeletions}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Customer deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error('Failed to delete customer')
      return false
    }
  }
}

export default new CustomerService()
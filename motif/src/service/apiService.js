import { fetchRequest } from '../utils/httpCommon'

class ApiService {
  getEmailList() {
    return fetchRequest('/api/email')
  }
  getEmailBody(id) {
    return fetchRequest(`/api/email/${id}`)
  }
}

export default new ApiService();
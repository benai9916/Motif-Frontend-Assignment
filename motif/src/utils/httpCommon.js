const BASE_URL = 'https://6366339879b0914b75cba9c2.mockapi.io'

export function fetchRequest(url) {
  return fetch(`${BASE_URL}${url}`).then(response => {
      return response.json()
    })
}

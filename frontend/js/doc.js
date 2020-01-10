const getParams = () => {
  let dict = {}
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    dict[key] = value
  })

  return dict
}

const params = getParams()
const id = params['id']

const req = new XMLHttpRequest();
const url = 'http://saturten.com/api/vi/' + id

req.open("GET", url)
req.send()

req.onreadystatechange = (event) => {
  if (req.readyState !== XMLHttpRequest.DONE || req.status !== 200 || !req.responseText) {
    return
  }

  const res = req.responseText
  const parsedResponse = JSON.parse(res)

  let name_label = document.getElementById('vi_name')
  let description_label = document.getElementById('vi_description')
  //let path_label = document.getElementById('vi_path')

  // Backend couldn't find the VI in the database
  if (parsedResponse.length == 0) {
    const errMessage = 'No vi with ID ' + id + ' found'
    console.log(errMessage)
    name_label.innerHTML = errMessage
    return
  }

  const vi = parsedResponse[0]

  name_label.innerHTML = vi.name
  description_label.innerHTML = vi.description
}

window.onload = () => {
  document.getElementById('home_button').addEventListener('click', () => {
    window.location = '//saturten.com'
  })
}

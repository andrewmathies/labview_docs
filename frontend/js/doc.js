
const getParams = () => {
  let dict = {}
  let url_parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    dict[key] = value
  })
  
  return dict
}

const params = getParams()
const name = params['name']

const req = new XMLHttpRequest();
const url='http://saturten.com/api/vi/' + name
console.log('requesting VI data from backend')
req.open("GET", url)
req.send()

req.onreadystatechange = (event) => {
  if(req.readyState !== XMLHttpRequest.DONE || req.status !== 200 || !req.responseText) {
    return
  }
  console.log('recieved response from backend')

  let res = req.responseText
  let vi = JSON.parse(res)

  let name_label = document.getElementById('vi_name')
  let description_label = document.getElementById('vi_description')
  //let path_label = document.getElementById('vi_path')

  name_label.value = vi.Name
  description_label.value = vi.Description
}
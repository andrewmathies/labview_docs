const Http = new XMLHttpRequest();
const url='http://saturten.com/api/vi';
Http.open("GET", url);
Http.send();

let viList

Http.onreadystatechange = (err) => {
  let response = Http.responseText
  console.log(response)
  viList = JSON.parse(response)
  viList.sort((a, b) =>  { return a.Name < b.Name })

  console.log('sorted list?')
  console.log(viList)
}
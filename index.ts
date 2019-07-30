import request from 'request'
const fs = require('fs')

const codeOfFirstObject = 0

const outputFilePath = './output/prettyOutput.json'

let dataObject: Array<Object> = []

const startScraper = () => {
  const loop = (nr: number) => {
    if (!dataObject[nr]) {
      console.log(`scraping ${nr}.json`)
      type Response = {
        statusCode: number
      }
      request(`https://earthview.withgoogle.com/_api/${nr}.json`, (error: NodeJS.ErrnoException, response: Response, body: string) => {
        if (error) {
          console.error('error:', error) // Print the error if one occurred
        } else if (response.statusCode !== 404) {
          if (response.statusCode === 200) {
            const dataObj = JSON.parse(body)
            dataObject.push({
              id: dataObj.id,
              primaryColor: dataObj.primaryColor,
              country: dataObj.country,
              image: dataObj.photoUrl,
              thumb: dataObj.thumbUrl,
              map: dataObj.mapsLink,
              region: dataObj.region
            })
            console.log('image at ' + nr)
            fs.writeFile(outputFilePath, JSON.stringify(dataObject, null, 2), function (err: NodeJS.ErrnoException) {
              if (err) {
                return console.log(err)
              }
              console.log('The output file was saved!')
              loop(nr + 1)
            })
          } else {
            loop(nr + 1)
          }
        } else {
          loop(nr + 1)
        }
      })
    } else {
      loop(nr + 1)
    }
  }
  loop(codeOfFirstObject)
}

(() => {
  fs.readFile(outputFilePath, function (err: NodeJS.ErrnoException, data: string) {
    if (err) {
      if (err.code !== 'ENOENT') {
        throw err
      } else {
        startScraper()
      }
    } else {
      dataObject = JSON.parse(data)
      startScraper()
    }
    console.log(data)
  })
})()

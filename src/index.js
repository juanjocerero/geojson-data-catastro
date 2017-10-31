import moment from 'moment'
import path from 'path'
import stringify from 'csv-stringify'
import * as arr from 'd3-array'
import * as fs from 'fs'

const exportAsCsv = data => {
  stringify(data, (error, output) => {
    if (error) {
      throw new Error(error)
    }
    try {
      fs.writeFileSync(
        path.join(
          __dirname,
          `/../output/ruins_granada.csv`
        ),
        output
      )
    } catch (error) {
      throw new Error(error)
    }
  })
}

const csv = () => fs.readFileSync(
  path.join(__dirname, './../18900-granada.geojson'),
  { encoding: 'utf8' }
)

const features = JSON.parse(csv()).features

const items = features.map(f => f.properties).map(p => ({
  condition: p.conditionOfConstruction,
  beginning: p.beginning,
  end: p.end,
  currentUse: p.currentUse,
  buildingUnits: p.numberOfBuildingUnits,
  dwellings: p.numberOfDwellings,
  documentLink: p.documentLink,
  informationSystem: p.informationSystem,
  area: `${p.value} ${p.value_uom}`
}))

const dates = items.map(i => ({
  end: i.end,
  end_date: moment(new Date(i.end)).add(1, 'days')
}))

const datesPlusAges = dates.map(i => ({
  end_date: i.end_date,
  age: moment().diff(i.end_date, 'years')
}))

const ages = datesPlusAges.map(i => i.age).filter(i => i > 0)

// console.log(datesPlusAges)

// console.log(ages.toString())

// console.log(arr.median(ages).toFixed(2))

// console.log(items.filter(i => i.condition !== 'functional'))

exportAsCsv(items.filter(i => i.condition === 'ruin'))

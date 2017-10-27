import moment from 'moment'
import path from 'path'
import * as arr from 'd3-array'
import * as fs from 'fs'

const csv = () => fs.readFileSync(
  path.join(__dirname, './../41900-sevilla.geojson'),
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

console.log(arr.median(ages).toFixed(2))

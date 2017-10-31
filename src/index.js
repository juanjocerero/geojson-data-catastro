import moment from 'moment'
import path from 'path'
import stringify from 'csv-stringify'
import * as arr from 'd3-array'
import _ from 'lodash'
import * as fs from 'fs'

const DATA_FOLDER = '../data'

const exportAsCsv = (data, outputName) => {
  stringify(data, (error, output) => {
    if (error) {
      throw new Error(error)
    }
    try {
      fs.writeFileSync(
        path.join(
          __dirname,
          `/../output/${outputName}.csv`
        ),
        output
      )
    } catch (error) {
      throw new Error(error)
    }
  })
}

const csv = file => fs.readFileSync(path.join(__dirname, `../data/${file}`), { encoding: 'utf8' })

const features = csv => JSON.parse(csv).features

const items = features => features.map(f => f.properties).map(p => ({
  condition: p.conditionOfConstruction,
  beginning: p.beginning,
  beginningMoment: moment(new Date(p.beginning)).add(1, 'days'),
  beginningYear: moment(new Date(p.beginning)).add(1, 'days').year(),
  end: p.end,
  endMoment: moment(new Date(p.end)).add(1, 'days'),
  endYear: moment(new Date(p.end)).add(1, 'days').year(),
  age: moment().diff((moment(new Date(p.end)).add(1, 'days')), 'years'),
  constructionYears: moment(new Date(p.end)).add(1, 'days').diff(moment(new Date(p.beginning)).add(1, 'days'), 'years'),
  currentUse: p.currentUse,
  buildingUnits: p.numberOfBuildingUnits,
  dwellings: p.numberOfDwellings,
  documentLink: p.documentLink,
  informationSystem: p.informationSystem,
  area: `${p.value} ${p.value_uom}`,
  areaNumber: p.value
}))

const ages = datesPlusAges => datesPlusAges.map(i => i.age).filter(i => i > 0)

const numberOfItems = items => items.length

const buildingsNotOk = items => items.filter(i => i.condition !== 'functional').length

const buildingsInRuins = items => items.filter(i => i.condition === 'ruin').length

const medianSizeOfBuildings = items => arr.median(items.filter(i => i.areaNumber && i.areaNumber > 0).map(i => i.areaNumber))

const mediumSizeOfBuildings = items => arr.mean(items.filter(i => i.areaNumber && i.areaNumber > 0).map(i => i.areaNumber)).toFixed(1)

const residentialBuildings = items => items.filter(i => i.currentUse !== null && i.currentUse === '1_residential')

const agricultureBuildings = items => items.filter(i => i.currentUse !== null && i.currentUse === '2_agriculture')

const industrialBuildings = items => items.filter(i => i.currentUse !== null && i.currentUse === '3_industrial')

const officeBuildings = items => items.filter(i => i.currentUse !== null && i.currentUse === '4_1_office')

const retailBuildings = items => items.filter(i => i.currentUse !== null && i.currentUse === '4_2_retail')

const publicServicesBuildings = items => items.filter(i => i.currentUse !== null && i.currentUse === '4_3_publicServices')

const buildingsWithCurrentUse = items => items.filter(i => i.currentUse !== null).length

const oldestBuildings = (items, number) => _.take(_.orderBy(items.filter(i => i.end_date.year() !== 9999 && !isNaN(i.age)), 'age').reverse(), number)

const buildingsThatTookMostTimeToBuild = (items, number) => _.take(_.orderBy(items.filter(i => i.constructionYears > 0), 'constructionYears').reverse(), number)

// fs.readdir(path.join(__dirname, DATA_FOLDER), (err, files) => {
//   if (err) throw new Error(err)
//   files.forEach(file => {
//     let objs = items(features(csv(file)))
//     console.log(`
//                   file:                       ${file}

//                   buildings:                  ${objs.length}
//                   buildings not ok:           ${buildingsNotOk(objs)}
//                   buildings in ruins:         ${buildingsInRuins(objs)}
//                   median size of building:    ${medianSizeOfBuildings(objs)} m2
//                   medium size of building:    ${mediumSizeOfBuildings(objs)} m2
//                   residential buildings:      ${residentialBuildings(objs).length} (${((residentialBuildings(objs).length / buildingsWithCurrentUse(objs)) * 100).toFixed(2)}%)
//                   agriculture buildings:      ${agricultureBuildings(objs).length} (${((agricultureBuildings(objs).length / buildingsWithCurrentUse(objs)) * 100).toFixed(2)}%)
//                   industrial buildings:       ${industrialBuildings(objs).length} (${((industrialBuildings(objs).length / buildingsWithCurrentUse(objs)) * 100).toFixed(2)}%)
//                   office buildings:           ${officeBuildings(objs).length} (${((officeBuildings(objs).length / buildingsWithCurrentUse(objs)) * 100).toFixed(2)}%)
//                   retail buildings:           ${retailBuildings(objs).length} (${((retailBuildings(objs).length / buildingsWithCurrentUse(objs)) * 100).toFixed(2)}%)
//                   public services buildings:  ${publicServicesBuildings(objs).length} (${((publicServicesBuildings(objs).length / buildingsWithCurrentUse(objs)) * 100).toFixed(2)}%)
//                   residential medium size:    ${mediumSizeOfBuildings(objs.filter(o => o.currentUse !== null && o.currentUse === '1_residential'))} m2

//     ----------------------------------------------------------------------------`)
//   })
// })

const objs = items(features(csv(('18900-granada.geojson'))))

// let buildingsFinishedByYear = []

// _.forOwn(_.groupBy(objs.filter(o => !isNaN(o.endYear) && o.endYear !== 9999), 'endYear'), (value, key) => {
//   buildingsFinishedByYear.push({
//     year: key,
//     buildings: value.length
//   })
// })



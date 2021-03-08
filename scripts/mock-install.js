const path = require("path")
const shelljs = require("shelljs")

const mockPath = path.resolve(__dirname, "../fixtures")

const model = ["js", "ts"]
const versions = [1, 2, 3]

const allCommands = model.reduce((acc, cur) => {
  acc = [...acc, ...versions.map((v) => `cd ${mockPath}/${cur}/v${v} && yarn`)]
  return acc
}, [])

allCommands.forEach((command) => {
  shelljs.exec(command)
})

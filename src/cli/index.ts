import * as inquirer from "inquirer"
import {
  getAppConfig,
  hasAppConfigCache,
  getPagesWithoutTabBarPages,
} from "./appConfig"
import {
  AnswersResult,
  validatePages,
  processAnswers,
  getPagesSource,
} from "./answer"
import { checkArgs, checkSetting } from './util'
const shelljs = require("shelljs")

// 检查命令
checkArgs()
checkSetting()

// 注册插件
inquirer.registerPrompt(
  "checkbox-plus",
  require("inquirer-checkbox-plus-prompt")
)
inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"))

const appConfig = getAppConfig()
const searchList = getPagesWithoutTabBarPages(appConfig)

inquirer
  .prompt<AnswersResult>([
    {
      type: "confirm",
      message: "是否沿用上次配置？",
      name: "cache",
      when: hasAppConfigCache,
    },
    {
      type: "checkbox-plus",
      name: "pages",
      message: "选择要编译的页面(可输入过滤):",
      pageSize: 10,
      highlight: true,
      searchable: true,
      prefix: "",
      when: (answers) => answers.cache !== true,
      source: getPagesSource(searchList),
      validate: validatePages(appConfig),
    },
  ])
  .then(function (answers) {
    processAnswers(appConfig, answers)
    const args = process.argv.slice(2)
    shelljs.exec(args.join(" "))
  })

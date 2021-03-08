const write = require("write")

import * as fs from "fs"
import { AppConfig } from "@tarojs/taro"
import { searchListByName } from "./util"
import { appConfigCachePath, ITARO_ENV } from "../constants"
import {
  PageList,
  PageValue,
  MainPageType,
  SubpackageRoot,
  PageType,
  SubpackageItem,
  getTabBarPages,
} from "./appConfig"

// 获取页面列表
export function getPagesSource(searchList: PageList) {
  return (_x: any, input: string = "") => {
    return Promise.resolve(searchListByName(input, searchList))
  }
}

// 检测 pages 选项是否合法
export function validatePages(appConfig: AppConfig) {
  const tabBarPages = getTabBarPages(appConfig)
  return (pages: any[]) => {
    return !tabBarPages.length && !pages.length ? "至少选择一个页面" : true
  }
}

// 主包内容
export function getAnswerMainPages(
  answerPages: PageValue[] = [],
  tabBarPages: string[]
) {
  const mainPages =
    answerPages
      .filter((item) => item.type === PageType.MAIN_PAGE)
      .map((item) => (item as MainPageType).value) || []
  return [...tabBarPages, ...mainPages]
}

// 获取 subPackages
export function getAnswerSubPackages(answerPages: PageValue[] = []) {
  // 选择了 root 的 subPackages
  const subPackages =
    answerPages
      ?.filter((item) => item.type === PageType.SUBPACKAGE_ROOT)
      .map((item) => (item as SubpackageRoot).value) || []
  const selectedRoots = subPackages.map((item) => item.root)

  // 选择分包里的 pages 页面
  const subPackages2 = answerPages
    ?.filter(
      (item) =>
        item.type === PageType.SUBPACKAGE_ITEM &&
        !selectedRoots.includes(item.root.root)
    )
    .reduce((acc: Record<string, Taro.SubPackage>, cur: SubpackageItem) => {
      const { root, value } = cur
      if (!acc[root.root]) {
        root.pages = []
        const key = root.root
        acc[key] = root
      }
      acc[root.root].pages.push(value)
      return acc
    }, {})

  return [...subPackages, ...Object.values(subPackages2 || {})]
}

// 获取回答的 AppConfig
export function getAnswerAppConfig(
  originAppConfig: AppConfig,
  answerPages: PageValue[] = []
): AppConfig {
  // 删除预加载信息
  delete originAppConfig.preloadRule

  const tabBarPages = getTabBarPages(originAppConfig)

  // 更新主页面信息
  originAppConfig.pages = getAnswerMainPages(answerPages, tabBarPages)

  // 更新子包信息信息
  const subpackages = getAnswerSubPackages(answerPages)
  if (subpackages.length) {
    originAppConfig.subpackages = subpackages
  } else {
    delete originAppConfig.subpackages
  }

  return originAppConfig
}

// 设置 app.config 的环境变量
export function setAppConfigEnv(appConfig: AppConfig) {
  process.env[ITARO_ENV] = JSON.stringify(appConfig, null, 2)
}

// 写入 app.config.json
export function writeAppConfig(appConfig: AppConfig): void {
  setAppConfigEnv(appConfig)
  write.sync(appConfigCachePath, JSON.stringify(appConfig, null, 2))
}

// 设置 app.config 的环境变量
export function setAppConfigEnvFormCache() {
  process.env[ITARO_ENV] = readAppConfigFile()
}

// 读取文件
export function readAppConfigFile() {
  if (fs.existsSync(appConfigCachePath)) {
    return fs.readFileSync(appConfigCachePath, "utf-8")
  }
}

export interface AnswersResult {
  cache: boolean
  pages?: PageValue[]
}
export function processAnswers(appConfig: AppConfig, answers: AnswersResult) {
  // 如果使用缓存，则无需做任何处理
  if (!answers.cache) {
    // app.config 处理
    const answerAppConfig = getAnswerAppConfig(appConfig, answers.pages)
    writeAppConfig(answerAppConfig)
  } else {
    setAppConfigEnvFormCache()
  }
}

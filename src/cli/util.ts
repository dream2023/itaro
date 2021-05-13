import * as fs from "fs"
import * as fuzzy from "fuzzy"
import{ red } from 'chalk'
import { nodeModulesDir } from "../constants"
import { getAppEntry } from "./version1_2"

type SearchItem = { name: string; value: any }

// 搜索列表的名称
export function searchListByName<T extends SearchItem>(
  name: string,
  list: T[]
): T[] {
  const fuzzyResult = fuzzy.filter<T>(name, list, {
    extract: (item) => item.name,
  })

  return fuzzyResult.map(function (element) {
    return element.original
  })
}

// 判断 taro 版本
export function getTaroVersion(): number | void {
  const taroPkgPath = `${nodeModulesDir}/@tarojs/taro/package.json`
  const versionStr: string = JSON.parse(fs.readFileSync(taroPkgPath, "utf-8"))
    .version
  return Number(versionStr.split(".")[0])
}


// 判断参数
export function checkArgs() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.log(red('[itaro]：请在 itaro 后面加上启动命令，具体用法请看：https://gitee.com/dream2023/itaro?_from=gitee_search#%E4%BD%BF%E7%94%A8'))
    process.exit(1)
  }
}

// 检测是否配置
export function checkSetting() {
  if (getTaroVersion() < 3) {
    // 检测 config/index.js
    if (!fs.existsSync('config/index.js')) {
      console.log(red('[itaro]：这不是一个有效的 taro 项目，项目目录里无 `config/index.js`'))
      process.exit(1)
    } else {
      const configContext = fs.readFileSync('config/index.js', 'utf-8')
      if (!configContext.includes('process.env.ITARO')) {
        console.log(red('[itaro]：请修改 `config/index.js` 中的 `defineConstants`，具体用法请看：https://gitee.com/dream2023/itaro?_from=gitee_search#%E4%BD%BF%E7%94%A8'))
        process.exit(1)
      }
    }

    // 检测 app.js 或者 app.ts
    const appStr: string = getAppEntry()
    if (!appStr.includes('process.env.ITARO')) {
      if (!appStr.includes('process.env.ITARO')) {
        console.log(red('[itaro]：请配置 `src/app` 中的 `config` 字段，具体用法请看：https://gitee.com/dream2023/itaro?_from=gitee_search#%E4%BD%BF%E7%94%A8'))
        process.exit(1)
      }
    }
  }
}
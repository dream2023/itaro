import * as fs from "fs"
import * as fuzzy from "fuzzy"
import { nodeModulesDir } from "../constants"

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

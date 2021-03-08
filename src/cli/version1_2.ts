import * as fs from "fs"
import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import generator from "@babel/generator"
import { sourceDir } from "../constants"
import { AppConfig } from "@tarojs/taro"

export function getAppEntry() {
  const files = ["js", "ts", "jsx", "tsx"].map(
    (ext) => `${sourceDir}/app.${ext}`
  )
  const appEntry = files.find((ext) => fs.existsSync(ext))
  if (appEntry) {
    return fs.readFileSync(appEntry, "utf-8")
  }
  return ""
}

// 获取 appConfig 内容
export function getAppConfig(): AppConfig {
  const code: string = getAppEntry()
  if (!code) return {}

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["classProperties", "jsx", "typescript"],
  })

  let newAst: any
  traverse(ast, {
    enter(path) {
      if (
        path.node.type === "ClassProperty" &&
        (path.node?.key as { name: string }).name === "config"
      ) {
        newAst = path.node.value
      }
    },
  })

  const appConfigStr = generator(newAst).code
  if (appConfigStr) {
    try {
      const res: AppConfig = new Function(`return ${appConfigStr}`)()
      if (Object.prototype.toString.call(res) === '[object Object]') {
        return res
      } else {
        throw new Error('不是有效的对象' + res)
      }
    } catch (err) {
      throw new Error("解析 app 失败：" + err)
    }
  }

  return {}
}

// 报错信息
export const ErrorMessage = "未找到 src/app，请检查！"

import { AppConfig } from "@tarojs/taro"
import { appConfigPath } from "../constants"
import { readConfig, resolveMainFilePath } from "@tarojs/helper"

// 获取 appConfig 内容
export function getAppConfig(): AppConfig {
  const filePath = resolveMainFilePath(appConfigPath)
  const appConfig = readConfig(filePath)
  return appConfig
}

// 报错信息
export const ErrorMessage = "未找到 src/app.config.js或ts，请检查！"

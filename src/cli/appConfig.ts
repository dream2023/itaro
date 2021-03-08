import { existsSync } from "fs"
import { getTaroVersion } from "./util"
import { AppConfig } from "@tarojs/taro"
import { isEmptyObject } from "@tarojs/helper"
import { appConfigCachePath } from "../constants"
import {
  getAppConfig as getAppConfigV3,
  ErrorMessage as ErrorMessageV3,
} from "./version3"
import {
  getAppConfig as getAppConfigV1_2,
  ErrorMessage as ErrorMessageV1_2,
} from "./version1_2"

export enum PageType {
  MAIN_PAGE,
  SUBPACKAGE_ROOT,
  SUBPACKAGE_ITEM,
}

export interface MainPageType {
  value: string
  type: PageType.MAIN_PAGE
}

export interface SubpackageRoot {
  value: Taro.SubPackage
  type: PageType.SUBPACKAGE_ROOT
}

export interface SubpackageItem {
  value: string
  root: Taro.SubPackage
  type: PageType.SUBPACKAGE_ITEM
}

export type PageValue = MainPageType | SubpackageRoot | SubpackageItem
export interface PageItem {
  name: string
  value: PageValue
}

export type PageList = PageItem[]

// 判断是否有 app.config.js 的缓存
export function hasAppConfigCache() {
  return existsSync(appConfigCachePath)
}

// 获取 appConfig 内容
export function getAppConfig(): AppConfig {
  const version = getTaroVersion()
  if (version >= 3) {
    return getAppConfigV3()
  } else {
    return getAppConfigV1_2()
  }
}

// 获取 app.config.js 中 pages 字段的列表
export function getAppPages(appConfig: AppConfig): PageList {
  if (isEmptyObject(appConfig)) {
    throw new Error(getTaroVersion() < 3 ? ErrorMessageV1_2 : ErrorMessageV3)
  }
  const appPagePaths = appConfig.pages
  if (!appPagePaths || !appPagePaths.length) {
    throw new Error("全局配置缺少 pages 字段，请检查！")
  }

  return appPagePaths.map((pagePath) => ({
    name: pagePath,
    value: { value: pagePath, type: PageType.MAIN_PAGE },
  }))
}

/**
 * 收集分包配置中的页面
 */
export function getSubPackages(appConfig: AppConfig): PageList {
  const res: PageList = []
  const subPackages = appConfig.subPackages || appConfig.subpackages
  if (subPackages && subPackages.length) {
    subPackages.forEach((item) => {
      if (item.pages && item.pages.length) {
        const root = item.root
        // 收集 root
        res.push({
          name: item.root,
          value: {
            value: item,
            type: PageType.SUBPACKAGE_ROOT,
          },
        })

        item.pages.forEach((page) => {
          let pageItem = `${root}/${page}`
          pageItem = pageItem.replace(/\/{2,}/g, "/")
          // 收集 subpackage 里面的 pages
          res.push({
            name: pageItem,
            value: {
              root: item,
              value: page,
              type: PageType.SUBPACKAGE_ITEM,
            },
          })
        })
      }
    })
  }

  return res
}

/**
 * 收集 tabBar 页面
 */
export function getTabBarPages(appConfig: AppConfig): string[] {
  const tabBar = appConfig.tabBar
  if (tabBar && typeof tabBar === "object" && !isEmptyObject(tabBar)) {
    const list = tabBar["list"] || []
    return list.map((item) => item.pagePath)
  }
  return []
}

/**
 * 根据 app config 的 pages 配置项，收集所有页面信息，
 * 包括处理分包和 tabBar
 */
export function getPages(appConfig: AppConfig): PageList {
  const mainPages = getAppPages(appConfig)
  const subPackages = getSubPackages(appConfig)
  return [...mainPages, ...subPackages]
}

// 获取除去 tabBar 的页面 pages
export function getPagesWithoutTabBarPages(appConfig: AppConfig) {
  const pages = getPages(appConfig)
  const tabBarPages = getTabBarPages(appConfig)
  return pages.filter((item) => !tabBarPages.includes(item.name))
}

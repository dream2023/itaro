const path = require("path")
const mock = require("mock-fs")
import {
  PageType,
  getPages,
  getAppPages,
  // getAppConfig,
  hasAppConfigCache,
  getTabBarPages,
  getSubPackages,
  getPagesWithoutTabBarPages,
} from "../../src/cli/appConfig"

describe("appCnfig", () => {
  afterEach(() => {
    mock.restore()
  })

  describe("hasAppConfigCache", () => {
    test("无缓存", () => {
      expect(hasAppConfigCache()).toBe(false)
    })

    test("有缓存", () => {
      const filePath = path.resolve(
        process.cwd(),
        "node_modules/.cache/itaro/app.config.json"
      )
      mock({
        [filePath]: "content",
      })
      expect(hasAppConfigCache()).toBe(true)
    })
  })

  // describe("getAppConfig", () => {
  //   const mockPath = path.resolve(process.cwd(), "src")
  //   const nodeModule = "node_modules/@tarojs/taro/package.json"
  //   const pkgPath = path.resolve(process.cwd(), nodeModule)
  //   const getVersionPath = (model: string, v: number) =>
  //     path.resolve(process.cwd(), `fixtures/${model}/v${v}/${nodeModule}`)

  //   const appConfig = {
  //     pages: ["pages/index/index"],
  //     window: {
  //       backgroundTextStyle: "light",
  //       navigationBarBackgroundColor: "#fff",
  //       navigationBarTitleText: "WeChat",
  //       navigationBarTextStyle: "black",
  //     },
  //   }

  //   afterEach(() => {
  //     mock.restore()
  //   })

  //   test("getAppConfig js model", () => {
  //     const versions = [1, 2, 3]
  //     versions.forEach((v) => {
  //       mock({
  //         [pkgPath]: mock.load(getVersionPath("js", v)),
  //         [mockPath]: mock.load(
  //           path.resolve(process.cwd(), `fixtures/js/v${v}/src`)
  //         ),
  //       })

  //       expect(getAppConfig()).toEqual(appConfig)
  //       mock.restore()
  //     })
  //   })
  // })

  describe("getAppPages", () => {
    const appConfig = {
      pages: ["pages/index/index", "pages/demo/index"],
    }

    test("正常情况", () => {
      expect(getAppPages(appConfig)).toEqual([
        {
          name: "pages/index/index",
          value: { value: "pages/index/index", type: PageType.MAIN_PAGE },
        },
        {
          name: "pages/demo/index",
          value: { value: "pages/demo/index", type: PageType.MAIN_PAGE },
        },
      ])
    })

    test("无 appConfig", () => {
      expect(() => getAppPages({})).toThrow()
    })

    test("无 pages 字段", () => {
      expect(() => getAppPages({ style: "v2" })).toThrow()
    })
  })

  describe("getTabBarPages", () => {
    test("无 tabbar 或者为空", () => {
      expect(getTabBarPages({})).toEqual([])
      expect(
        getTabBarPages({
          tabBar: {
            color: "red",
            selectedColor: "red",
            backgroundColor: "red",
            list: [],
          },
        })
      ).toEqual([])
    })

    test("tarbar 正常", () => {
      expect(
        getTabBarPages({
          tabBar: {
            color: "red",
            selectedColor: "red",
            backgroundColor: "red",
            list: [
              {
                pagePath: "pages/index/index",
                text: "首页",
              },
              {
                pagePath: "pages/logs/logs",
                text: "日志",
              },
            ],
          },
        })
      ).toEqual(["pages/index/index", "pages/logs/logs"])
    })
  })

  describe("getSubPackages", () => {
    test("无 subpackages", () => {
      expect(getSubPackages({})).toEqual([])
      expect(getSubPackages({ subpackages: [] })).toEqual([])
    })

    test("有 subpackages", () => {
      const packageA = {
        root: "packageA",
        pages: ["pages/cat", "pages/dog"],
      }
      const packageB = {
        root: "packageB",
        name: "pack2",
        pages: ["pages/apple", "pages/banana"],
      }

      const res = [
        {
          name: "packageA",
          value: { type: PageType.SUBPACKAGE_ROOT, value: packageA },
        },
        {
          name: "packageA/pages/cat",
          value: {
            root: packageA,
            value: "pages/cat",
            type: PageType.SUBPACKAGE_ITEM,
          },
        },
        {
          name: "packageA/pages/dog",
          value: {
            root: packageA,
            value: "pages/dog",
            type: PageType.SUBPACKAGE_ITEM,
          },
        },
        {
          name: "packageB",
          value: { type: PageType.SUBPACKAGE_ROOT, value: packageB },
        },
        {
          name: "packageB/pages/apple",
          value: {
            root: packageB,
            value: "pages/apple",
            type: PageType.SUBPACKAGE_ITEM,
          },
        },
        {
          name: "packageB/pages/banana",
          value: {
            root: packageB,
            value: "pages/banana",
            type: PageType.SUBPACKAGE_ITEM,
          },
        },
      ]

      expect(
        getSubPackages({
          subpackages: [packageA, packageB],
        })
      ).toEqual(res)

      expect(
        getSubPackages({
          subPackages: [packageA, packageB],
        })
      ).toEqual(res)
    })
  })

  describe("getPages", () => {
    test("有 subpackages", () => {
      const packageA = {
        root: "packageA",
        pages: ["pages/cat", "pages/dog"],
      }
      const packageB = {
        root: "packageB",
        name: "pack2",
        pages: ["pages/apple", "pages/banana"],
      }
      expect(
        getPages({
          pages: ["pages/index", "pages/logs"],
          subpackages: [
            {
              root: "packageA",
              pages: ["pages/cat", "pages/dog"],
            },
            {
              root: "packageB",
              name: "pack2",
              pages: ["pages/apple", "pages/banana"],
            },
          ],
        })
      ).toEqual([
        {
          name: "pages/index",
          value: { value: "pages/index", type: PageType.MAIN_PAGE },
        },
        {
          name: "pages/logs",
          value: { value: "pages/logs", type: PageType.MAIN_PAGE },
        },
        {
          name: "packageA",
          value: { type: PageType.SUBPACKAGE_ROOT, value: packageA },
        },
        {
          name: "packageA/pages/cat",
          value: {
            root: packageA,
            value: "pages/cat",
            type: PageType.SUBPACKAGE_ITEM,
          },
        },
        {
          name: "packageA/pages/dog",
          value: {
            root: packageA,
            value: "pages/dog",
            type: PageType.SUBPACKAGE_ITEM,
          },
        },
        {
          name: "packageB",
          value: { type: PageType.SUBPACKAGE_ROOT, value: packageB },
        },
        {
          name: "packageB/pages/apple",
          value: {
            root: packageB,
            value: "pages/apple",
            type: PageType.SUBPACKAGE_ITEM,
          },
        },
        {
          name: "packageB/pages/banana",
          value: {
            root: packageB,
            value: "pages/banana",
            type: PageType.SUBPACKAGE_ITEM,
          },
        },
      ])
    })

    test("无 subpackages", () => {
      expect(getPages({ pages: ["pages/index", "pages/logs"] })).toEqual([
        {
          name: "pages/index",
          value: { value: "pages/index", type: PageType.MAIN_PAGE },
        },
        {
          name: "pages/logs",
          value: { value: "pages/logs", type: PageType.MAIN_PAGE },
        },
      ])
    })
  })

  describe("getPagesWithoutTabBarPages", () => {
    test("有 TabBar", () => {
      expect(
        getPagesWithoutTabBarPages({
          pages: ["pages/index", "pages/logs", "pages/my"],
          tabBar: {
            list: [
              {
                pagePath: "pages/index",
                text: "首页",
              },
              {
                pagePath: "pages/logs",
                text: "日志",
              },
            ],
          },
        })
      ).toEqual([
        {
          name: "pages/my",
          value: { value: "pages/my", type: PageType.MAIN_PAGE },
        },
      ])
    })

    test("无 TabBar", () => {
      expect(
        getPagesWithoutTabBarPages({
          pages: ["pages/index", "pages/logs", "pages/my"],
        })
      ).toEqual([
        {
          name: "pages/index",
          value: { value: "pages/index", type: PageType.MAIN_PAGE },
        },
        {
          name: "pages/logs",
          value: { value: "pages/logs", type: PageType.MAIN_PAGE },
        },
        {
          name: "pages/my",
          value: { value: "pages/my", type: PageType.MAIN_PAGE },
        },
      ])
    })
  })
})

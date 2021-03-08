import * as path from "path"
import { AppConfig } from "@tarojs/taro"
import {
  getAnswerAppConfig,
  getAnswerMainPages,
  getAnswerSubPackages,
  getPagesSource,
  processAnswers,
  readAppConfigFile,
  setAppConfigEnv,
  setAppConfigEnvFormCache,
  validatePages,
  writeAppConfig,
} from "../../src/cli/answer"
import { PageType, PageList, PageValue } from "../../src/cli/appConfig"
const mock = require("mock-fs")
const rimraf = require("rimraf")

const cachePath = path.resolve(
  process.cwd(),
  "node_modules/.cache/itaro/app.config.json"
)
const mockAppConfig = JSON.stringify({ pages: ["pages/logs"] }, null, 2)

function mockCache() {
  mock({
    [cachePath]: mockAppConfig,
  })
}

function cleanCache() {
  delete process.env.ITARO
  rimraf.sync(cachePath)
  mock.restore()
}

describe("answer", () => {
  test("getPagesSource", async () => {
    const pageList: PageList = [
      {
        name: "pages/index/index",
        value: {
          value: "pages/index/index",
          type: PageType.MAIN_PAGE,
        },
      },
      {
        name: "packageA",
        value: {
          value: {
            root: "packageA",
            pages: ["pages/cat"],
          },
          type: PageType.SUBPACKAGE_ROOT,
        },
      },

      {
        name: "packageA/pages/cat",
        value: {
          root: {
            root: "packageA",
            pages: ["pages/cat"],
          },
          value: "pages/cat",
          type: PageType.SUBPACKAGE_ITEM,
        },
      },
    ]

    const fn = getPagesSource(pageList)
    const res = await fn("", "cat")
    expect(res).toEqual([
      {
        name: "packageA/pages/cat",
        value: {
          root: {
            root: "packageA",
            pages: ["pages/cat"],
          },
          value: "pages/cat",
          type: PageType.SUBPACKAGE_ITEM,
        },
      },
    ])
  })

  test("validatePages 为 true", () => {
    const fn = validatePages({
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

    expect(fn([])).toEqual(true)
    expect(fn(["pages/index/index"])).toEqual(true)

    const fn2 = validatePages({})
    expect(fn2(["pages/index/index"])).toEqual(true)
  })

  test("validatePages 为字符串", () => {
    const fn = validatePages({})
    expect(fn([])).toEqual("至少选择一个页面")
  })

  test("getAnswerMainPages", () => {
    const answerPages: PageValue[] = [
      {
        value: "pages/index/index",
        type: PageType.MAIN_PAGE,
      },
      {
        value: {
          root: "packageA",
          pages: ["pages/cat"],
        },
        type: PageType.SUBPACKAGE_ROOT,
      },
      {
        root: {
          root: "packageA",
          pages: ["pages/cat"],
        },
        value: "pages/cat",
        type: PageType.SUBPACKAGE_ITEM,
      },
    ]

    expect(getAnswerMainPages(answerPages, [])).toEqual(["pages/index/index"])

    expect(getAnswerMainPages(answerPages, ["pages/my/index"])).toEqual([
      "pages/my/index",
      "pages/index/index",
    ])
  })

  test("getAnswerSubPackages", () => {
    const answerPages: PageValue[] = [
      {
        value: "pages/index/index",
        type: PageType.MAIN_PAGE,
      },
      {
        value: {
          root: "packageA",
          pages: ["pages/cat", "pages/dog"],
        },
        type: PageType.SUBPACKAGE_ROOT,
      },
      {
        root: {
          root: "packageB",
          pages: ["pages/apple", "pages/banana"],
        },
        value: "pages/apple",
        type: PageType.SUBPACKAGE_ITEM,
      },
    ]
    expect(getAnswerSubPackages(answerPages)).toEqual([
      {
        root: "packageA",
        pages: ["pages/cat", "pages/dog"],
      },
      {
        root: "packageB",
        pages: ["pages/apple"],
      },
    ])
  })

  describe("getAnswerAppConfig", () => {
    const tabBar = {
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
    }

    const originAppConfig: AppConfig = {
      pages: ["pages/index", "pages/logs", "pages/my"],
      preloadRule: {
        "pages/index": {
          network: "all",
          packages: ["important"],
        },
      },
      subpackages: [
        {
          root: "sub1",
          pages: ["foo", "bar"],
        },
        {
          root: "sub2",
          pages: ["pages/a", "paegs/b"],
        },
      ],
      tabBar,
    }

    test("未选择 subpackages", () => {
      // 仅有 MAIN_PAGE
      const answerPages: PageValue[] = [
        {
          value: "pages/my",
          type: PageType.MAIN_PAGE,
        },
      ]
      expect(getAnswerAppConfig(originAppConfig, answerPages)).toEqual({
        pages: ["pages/index", "pages/logs", "pages/my"],
        tabBar,
      })
    })

    test("选择 subpackages", () => {
      const answerPages: PageValue[] = [
        {
          value: {
            root: "sub1",
            pages: ["foo", "bar"],
          },
          type: PageType.SUBPACKAGE_ROOT,
        },
      ]

      expect(getAnswerAppConfig(originAppConfig, answerPages)).toEqual({
        pages: ["pages/index", "pages/logs"],
        subpackages: [
          {
            root: "sub1",
            pages: ["foo", "bar"],
          },
        ],
        tabBar,
      })
    })
  })

  test("setAppConfigEnv", () => {
    const appConfig = { pages: ["pages/index/index"] }
    setAppConfigEnv(appConfig)
    expect(process.env.ITARO).toBe(JSON.stringify(appConfig, null, 2))

    delete process.env.ITARO
  })

  test("writeAppConfig", () => {
    const appConfig = { pages: ["pages/index"] }
    writeAppConfig(appConfig)
    expect(process.env.ITARO).toBe(JSON.stringify(appConfig, null, 2))
    const cachePath = path.resolve(
      process.cwd(),
      "node_modules/.cache/itaro/app.config.json"
    )
    expect(require(cachePath)).toEqual(appConfig)

    rimraf.sync(cachePath)
    delete process.env.ITARO
  })

  test("setAppConfigEnvFormCache", () => {
    mockCache()

    setAppConfigEnvFormCache()
    expect(process.env.ITARO).toEqual(mockAppConfig)

    cleanCache()
  })

  test("readAppConfigFile 有文件", () => {
    mockCache()
    expect(readAppConfigFile()).toEqual(mockAppConfig)
    mock.restore()
  })

  test("readAppConfigFile 无文件", () => {
    cleanCache()
    expect(readAppConfigFile()).toEqual(undefined)
  })

  describe("processAnswers", () => {
    test("cache 为 true", () => {
      mockCache()

      processAnswers({ pages: ["pages/index"] }, { cache: true })
      expect(process.env.ITARO).toEqual(mockAppConfig)

      cleanCache()
    })

    test("无缓存", () => {
      cleanCache()
      processAnswers(
        { pages: ["pages/index", "pages/foo", "pages/bar"] },
        {
          cache: false,
          pages: [
            {
              value: "pages/index",
              type: PageType.MAIN_PAGE,
            },
          ],
        }
      )
      expect(process.env.ITARO).toEqual(
        JSON.stringify({ pages: ["pages/index"] }, null, 2)
      )
      cleanCache()
    })
  })
})

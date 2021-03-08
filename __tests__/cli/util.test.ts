import * as path from "path"
import * as mock from "mock-fs"
import { searchListByName, getTaroVersion } from "../../src/cli/util"

describe("cli util", () => {
  describe("getTaroVersion", () => {
    const nodeModule = "node_modules/@tarojs/taro/package.json"
    const pkgPath = path.resolve(process.cwd(), nodeModule)
    const getVersionPath = (v: number) =>
      path.resolve(process.cwd(), `fixtures/js/v${v}/${nodeModule}`)

    afterEach(() => {
      mock.restore()
    })

    test("versions", () => {
      const versions = [1, 2, 3]
      versions.forEach((v) => {
        mock({
          [pkgPath]: mock.load(getVersionPath(v)),
        })

        expect(getTaroVersion()).toBe(v)
      })
    })

    test("未安装 taro 时", () => {
      mock({
        [pkgPath]: "",
      })

      expect(() => getTaroVersion()).toThrow()
    })
  })

  test("searchListByName", () => {
    const list = [
      {
        name: "pages/index/index",
        value: { page: "pages/index/index", type: 0 },
      },
      {
        name: "pages/demo/index",
        value: { page: "pages/demo/index", type: 1 },
      },
    ]
    expect(searchListByName("demo", list)).toEqual([
      {
        name: "pages/demo/index",
        value: { page: "pages/demo/index", type: 1 },
      },
    ])
  })
})

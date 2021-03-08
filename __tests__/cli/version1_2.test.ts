import * as fs from 'fs'
import * as path from 'path'
import { sourceDir } from '../../src/constants'
import { getAppEntry, getAppConfig } from '../../src/cli/version1_2'
const mock = require('mock-fs')

describe('version1_2', () => {
  afterEach(() => {
    mock.restore()
  })

  describe('v1', () => {
    describe('js', () => {
      const srcDir = path.resolve(process.cwd(), 'fixtures/js/v1/src')
      const appEntry = fs.readFileSync(path.resolve(srcDir, 'app.jsx'), 'utf-8')
     
      describe('getAppEntry', () => {
        test('正常情况', () => {
          mock({
            [sourceDir]: mock.load(srcDir)
          })
          expect(getAppEntry()).toBe(appEntry)
        })
  
        test('无文件的情况', () => {
          mock({
            [sourceDir]: null
          })
          
          expect(getAppEntry()).toBe('')
        })
      })

      describe('getAppConfig', () => {
        test('正常情况', () => {
          mock({
            [sourceDir]: mock.load(srcDir)
          })

          const appConfig = {
            pages: [
              'pages/index/index'
            ],
            window: {
              backgroundTextStyle: 'light',
              navigationBarBackgroundColor: '#fff',
              navigationBarTitleText: 'WeChat',
              navigationBarTextStyle: 'black'
            }
          }
          expect(getAppConfig()).toEqual(appConfig)
        })

        test('不存在', () => {
          mock({
            [sourceDir]: null
          })
          expect(getAppConfig()).toEqual({})
        })

        test('不是对象', () => {
          mock({
            [sourceDir]: mock.load(path.resolve(process.cwd(), 'fixtures/foo'))
          })
          expect(() => getAppConfig()).toThrow()
        })
      })
    })

    describe('ts', () => {
      const srcDir = path.resolve(process.cwd(), 'fixtures/ts/v1/src')
      const appEntry = fs.readFileSync(path.resolve(srcDir, 'app.tsx'), 'utf-8')
     
      describe('getAppEntry', () => {
        test('正常情况', () => {
          mock({
            [sourceDir]: mock.load(srcDir)
          })
          expect(getAppEntry()).toBe(appEntry)
        })
  
        test('无文件的情况', () => {
          mock({
            [sourceDir]: null
          })
          
          expect(getAppEntry()).toBe('')
        })
      })

      describe('getAppConfig', () => {
        test('正常情况', () => {
          mock({
            [sourceDir]: mock.load(srcDir)
          })

          const appConfig = {
            pages: [
              'pages/index/index'
            ],
            window: {
              backgroundTextStyle: 'light',
              navigationBarBackgroundColor: '#fff',
              navigationBarTitleText: 'WeChat',
              navigationBarTextStyle: 'black'
            }
          }
          expect(getAppConfig()).toEqual(appConfig)
        })

        test('不存在', () => {
          mock({
            [sourceDir]: null
          })
          expect(getAppConfig()).toEqual({})
        })

        test('不是对象', () => {
          mock({
            [sourceDir]: mock.load(path.resolve(process.cwd(), 'fixtures/foo'))
          })
          expect(() => getAppConfig()).toThrow()
        })
      })
    })
  })

  describe('v2', () => {
    describe('js', () => {
      const srcDir = path.resolve(process.cwd(), 'fixtures/js/v2/src')
      const appEntry = fs.readFileSync(path.resolve(srcDir, 'app.jsx'), 'utf-8')
     
      describe('getAppEntry', () => {
        test('正常情况', () => {
          mock({
            [sourceDir]: mock.load(srcDir)
          })
          expect(getAppEntry()).toBe(appEntry)
        })
  
        test('无文件的情况', () => {
          mock({
            [sourceDir]: null
          })
          
          expect(getAppEntry()).toBe('')
        })
      })

      describe('getAppConfig', () => {
        test('正常情况', () => {
          mock({
            [sourceDir]: mock.load(srcDir)
          })

          const appConfig = {
            pages: [
              'pages/index/index'
            ],
            window: {
              backgroundTextStyle: 'light',
              navigationBarBackgroundColor: '#fff',
              navigationBarTitleText: 'WeChat',
              navigationBarTextStyle: 'black'
            }
          }
          expect(getAppConfig()).toEqual(appConfig)
        })

        test('不存在', () => {
          mock({
            [sourceDir]: null
          })
          expect(getAppConfig()).toEqual({})
        })

        test('不是对象', () => {
          mock({
            [sourceDir]: mock.load(path.resolve(process.cwd(), 'fixtures/foo'))
          })
          expect(() => getAppConfig()).toThrow()
        })
      })
    })

    describe('ts', () => {
      const srcDir = path.resolve(process.cwd(), 'fixtures/ts/v2/src')
      const appEntry = fs.readFileSync(path.resolve(srcDir, 'app.tsx'), 'utf-8')
     
      describe('getAppEntry', () => {
        test('正常情况', () => {
          mock({
            [sourceDir]: mock.load(srcDir)
          })
          expect(getAppEntry()).toBe(appEntry)
        })
  
        test('无文件的情况', () => {
          mock({
            [sourceDir]: null
          })
          
          expect(getAppEntry()).toBe('')
        })
      })

      describe('getAppConfig', () => {
        test('正常情况', () => {
          mock({
            [sourceDir]: mock.load(srcDir)
          })

          const appConfig = {
            pages: [
              'pages/index/index'
            ],
            window: {
              backgroundTextStyle: 'light',
              navigationBarBackgroundColor: '#fff',
              navigationBarTitleText: 'WeChat',
              navigationBarTextStyle: 'black'
            }
          }
          expect(getAppConfig()).toEqual(appConfig)
        })

        test('不存在', () => {
          mock({
            [sourceDir]: null
          })
          expect(getAppConfig()).toEqual({})
        })

        test('不是对象', () => {
          mock({
            [sourceDir]: mock.load(path.resolve(process.cwd(), 'fixtures/foo'))
          })
          expect(() => getAppConfig()).toThrow()
        })
      })
    })
  })
})



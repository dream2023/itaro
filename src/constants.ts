import * as path from "path"

export const rootDir = process.cwd()
export const sourceDir = path.resolve(rootDir, "./src")
export const nodeModulesDir = path.resolve(rootDir, "./node_modules")
export const appConfigPath = path.resolve(sourceDir, "./app.config")
export const cacheDir = path.resolve(nodeModulesDir, "./.cache/itaro/")
export const appConfigCachePath = path.resolve(cacheDir, "./app.config.json")
export const ITARO_ENV = "ITARO"

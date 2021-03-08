import { ITARO_ENV } from "./constants"

const itaro = (appConfig: any) => {
  if (process.env[ITARO_ENV]) {
    return JSON.parse(process.env[ITARO_ENV] || "")
  } else {
    return appConfig
  }
}

export default itaro

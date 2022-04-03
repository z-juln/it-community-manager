import { createContext } from "react"
import type { ProviderValue } from "./interface"

const RoutesContext = createContext<ProviderValue>({} as ProviderValue)

export default RoutesContext

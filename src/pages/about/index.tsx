import About from "./About"

export const routes = (startPath: string) => {
  return {
      path: startPath,
      element: <About/>
  }
}

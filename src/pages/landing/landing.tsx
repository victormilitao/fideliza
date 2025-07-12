import Benefits from "./benefits"
import { Header } from "./header"
import HowItWorks from "./how-it-works"
import Intro from "./intro"


export const Landing = () => {
  return (
    <>
      <Header />
      <Intro />
      <HowItWorks />
      <Benefits />
    </>
  )
}

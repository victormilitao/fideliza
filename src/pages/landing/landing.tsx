import Benefits from "./benefits"
import { Contact } from "./contact"
import { Header } from "./header"
import HowItWorks from "./how-it-works"
import Intro from "./intro"
import { WhyDigitalStamps } from "./why-digital-stamps"
import { WorksForMe } from "./works-for-me"


export const Landing = () => {
  return (
    <>
      <Header />
      <Intro />
      <HowItWorks />
      <Benefits />
      <WorksForMe />
      <WhyDigitalStamps />
      <Contact />
    </>
  )
}

import { NavBar } from '../../components/NavBar'
import { CarouselCar } from '../../components/CarouselCar'
import { SelectBrand } from '../../components/SelectBrand'
import { FancyImages } from '../../components/FancyImages'
import { ExtraDetails } from '../../components/ExtraDetails'
import { Footer } from '../../components/Footer'

export function Home() {
  return (
    <>
      <NavBar />
      <CarouselCar />
      <SelectBrand />
      <FancyImages />
      <ExtraDetails />
      <Footer />
    </>
  )
}

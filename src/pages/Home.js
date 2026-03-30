import ProductList from "../features/product/components/ProductList";
import Allgenre from './LandingPage/Allgenre/Allgenre'
import ThreedHero from './LandingPage/ThreedHero';
import { Toaster } from "react-hot-toast";
import HeroVideo from "./LandingPage/HeroVideo";
import { useEffect } from "react";

function Home() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <Toaster position="top-center" />
            {/* <HeroVideo /> */}
            <ThreedHero></ThreedHero>
            <Allgenre></Allgenre>
            <ProductList></ProductList>
        </div>
    );
}

export default Home;
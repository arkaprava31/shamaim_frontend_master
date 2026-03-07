import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/Footer";
import Allgenre from './LandingPage/Allgenre/Allgenre'
import ThreedHero from './LandingPage/ThreedHero';
import { Toaster } from "react-hot-toast";
import HeroVideo from "./LandingPage/HeroVideo";

function Home() {
    return (
        <div>
            <Toaster position="top-center" />
            <HeroVideo />
            <ThreedHero></ThreedHero>
            <Allgenre></Allgenre>
            <ProductList></ProductList>


        </div>
    );
}

export default Home;
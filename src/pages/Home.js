import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/Footer";
import Allgenre from './LandingPage/Allgenre/Allgenre'
import ThreedHero from './LandingPage/ThreedHero';
import { Toaster } from "react-hot-toast";

function Home() {
    return (
        <div>
            <Toaster position="top-center" />
            <ThreedHero></ThreedHero>
            <Allgenre></Allgenre>
            <ProductList></ProductList>


        </div>
    );
}

export default Home;
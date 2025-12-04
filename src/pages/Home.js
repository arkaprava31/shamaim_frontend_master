import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/Footer";
import Allgenre from './LandingPage/Allgenre/Allgenre'
import ThreedHero from './LandingPage/ThreedHero';

function Home() {
    return ( 
        <div>

            <ThreedHero></ThreedHero>
            <Allgenre></Allgenre>
            <ProductList></ProductList>
            

        </div>
     );
}

export default Home;
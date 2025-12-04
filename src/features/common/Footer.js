import { Link } from "react-router-dom";
function Footer() {
  return (
    <>
      <div className=" bg-custom-black">
        <div className="max-w-2xl mx-auto text-white py-10">
        <h3 className=" text-3xl text-yellow-300 font-serif  ">Shamaim</h3>
          <div className="flex  justify-between">
            <div>
              <p className=" text-yellow-300 pb-2">Coustomer Survice</p>
              <div>
                <p>Contact </p>
                <p>Track Order</p>
                <p>Return Order</p>        
                <p>Cancel Order</p>
              </div>
            </div>
            <div>
              <p className=" text-yellow-300 pb-2">Company</p>
              <div>
                <p>Terms & Conditions</p>
                <p>Privacy Policy</p>
                <p>About Us</p>
                <p>Refund&Return policy</p>
              </div>
            </div>
          </div>
          <div className="mt-28 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
            <p className="order-2 md:order-1 mt-8 md:mt-0">
              {" "}
              © Shamaim, 2024.{" "}
            </p>
            <div className="order-1 md:order-2 flex flex-wrap justify-center items-center">
              <span className="px-2 cursor-pointer">
                <Link className="cursor-pointer" to="/aboutus" alt="">
                  About us
                </Link>
              </span>
              <span className="px-2">
                <Link to="/contactus" alt="">
                  Contact us
                </Link>
              </span>
              <span className="px-2">
                <Link to="/refund" alt="">
                  Refund&Return policy
                </Link>
              </span>
              <span className="px-2">
                <Link to="/privacypolicy" alt="">
                  privacypolicy
                </Link>
              </span>
              <span className="px-2">
                <Link to="/termscondtion" alt="">
                  Terms&condtion
                </Link>
              </span>

              <span className="px-2">
                <Link to="contactus" alt="">
                  Our Story
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;

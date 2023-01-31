import "./landingPage.scss";
import figure from "../../assets/figura.png";
import mande from "../../assets/mande.png";
import m from "../../assets/m2.png";

import { Box } from "@mui/material";
import TopbarLandingPage from "../../components/topbarLandingPage.jsx/TopbarLandingPage"

const LandingPage = () => {
  return (
    <Box>
      <TopbarLandingPage />
    </Box>
    // <div className="hero">
    //   <nav className="hero__nav">
    //     <img src={m} alt="logo" />
    //     <div className="items">
    //     <ul>
    //       <li>
    //         <a href="">INGRESAR</a>
    //       </li>
    //       <li>
    //         <a href="">REGISTRARME</a>
    //       </li>
    //       <LanguageIcon />
    //       <LightModeOutlinedIcon />
    //     </ul>
    //     </div>
    //   </nav>

    //   <div className="info">
    //     <h1>
    //       Bienvenido a <span>mande</span>
    //     </h1>
    //     <p>
    //       Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione
    //       soluta impedit laborum, quos nemo neque minima ullam atque tenetur.
    //       Natus veniam officia molestias et recusandae sed, praesentium dicta
    //       maxime commodi?
    //     </p>
    //     <button>Registrarme</button>
    //   </div>

    //   {/* <div className="img-box">
    //   <img className="back-img" src={figure} alt="figure" />
    //   <img className="main-img" src={mande} alt="mande" />
    // </div> */}

    //   <div className="social-links">
    //     <a href="">
    //       <i className="fab fa-facebook"></i>
    //     </a>
    //     <a href="">
    //       <i className="fab fa-whatsapp"></i>
    //     </a>
    //     <a href="">
    //       <i className="fab fa-twitter"></i>
    //     </a>
    //   </div>
    // </div>
  );
};

export default LandingPage;

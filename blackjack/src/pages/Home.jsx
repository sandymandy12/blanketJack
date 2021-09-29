import React from "react";
import bg from '../images/home.png';
import { Link } from 'react-router-dom';
// import Button from 'react-bulma-components/lib/components/button';


function Home() {
  return (
    <div className="home">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            <Link to="/game">
              <button color="white" className="border-bottom btn-dark rounded-pill is-rounded" >
                <span>Join Game</span>
              </button>
            </Link>
            <img
              class="img-fluid rounded mb-4 mb-lg-0"
              src={bg}
              alt="background"
            />
          </div>
          <div class="col-lg-5">
            <h1 class="font-weight-light"></h1>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
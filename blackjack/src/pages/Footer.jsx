import React from "react";

let today = new Date();


function Footer() {
  return (
    <div className="footer">
      <footer class="py-5 bg-dark fixed-bottom">
        <div class="container">
          <p class="m-0 text-center text-white">
            Copyright &copy; Blanket Jacket {today.getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
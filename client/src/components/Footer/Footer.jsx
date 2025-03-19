import "./footer.css"
import "../../App.css"

function Footer() {
  return (
    <div className="footer">
      <div className="bg-[#2c2b2b] relative w-full">
        <div className="p-3 flex justify-between items-center">
          <p className="rasavakya-footer text-[#fff] rasavakya1 text-bg md:text-[25px] pr-4 py-1 relative">
            RasaVakya
          </p>

          <p className="text-white text-xs md:text-[15px] absolute bottom-0 left-3 md:static text-center">
            @Copyright RasaVakya
          </p>

          <p className="flex">
            <i className=" cursor-pointer fa-brands fa-linkedin-in text-white text-xs md:text-[20px] p-1 md:px-2"></i>
            <i className=" cursor-pointer fa-brands fa-instagram text-white text-xs md:text-[20px] p-1 md:px-2"></i>
            <i className=" cursor-pointer fa-brands fa-facebook text-white text-xs md:text-[20px] p-1 md:px-2"></i>
            <i className=" cursor-pointer fa-brands fa-x-twitter text-white text-xs md:text-[20px] p-1 md:px-2"></i>
          </p>
        </div>
        <p className="text-white text-xs text-right mr-2">
          Made by: Manas Manthan Rout
        </p>
      </div>
    </div>
  );
}

export default Footer;

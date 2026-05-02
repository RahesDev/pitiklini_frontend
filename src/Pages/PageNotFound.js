import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import NotFound from "../assets/svg/404.svg"

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-black font-ibm text-secondary overflow-hidden">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="mb-8">
          <img 
            src={NotFound} 
            alt="404" 
            className="w-full max-w-[400px] h-auto mx-auto"
          />
        </div>

        <h1 className="text-[40px] font-bold text-primary mb-4">
          Sorry, page not found!
        </h1>

        <p className="text-[20px] text-white max-w-[600px] mb-8 leading-relaxed">
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.
        </p>

        <Link 
          to="/" 
          className="w-[200px] h-[56px] bg-primary text-secondary rounded-lg text-lg font-medium flex items-center justify-center hover:opacity-90 transition shadow-lg"
        >
          {t("backToHomePage")}
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;

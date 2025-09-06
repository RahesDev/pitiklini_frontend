import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="page-not-found">
        <div className="not-found-img-wrap">
          <img src={require("../assets/not-found.webp")} alt="page-not-found" />
        </div>
        <h3 className="not-found-title">{t('pageNotFound')}</h3>
        <p className="not-found-content">
          {t('thepageyoureloo')}
        </p>
        <Link to="/" className="not-found-btn">
          {t('backToHomePage')}
        </Link>
      </div>
    </>
  );
};

export default PageNotFound;

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UnderMaintanence = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="page-not-found">
        <div className="maintanence-img-wrap">
          <img src={require("../assets/maintanence.webp")} alt="maintanence" />
        </div>
        <h3 className="not-found-title">{t('isUnderMaintenance')}</h3>
        <p className="not-found-content">
          {t('currentlyworking')}{" "}
          <div className="page-inline">{t('soonyourpatience')}</div>
        </p>
        <Link to="/" className="not-found-btn">
          {t('backToHomePage')}
        </Link>
      </div>
    </>
  );
};

export default UnderMaintanence;

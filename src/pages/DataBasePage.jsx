import { Fragment } from "react";

import DataBase from "../components/DataBase";
import DetailedInfo from "../components/DetailedInfo";

const DataBasePage = () => {
  return (
    <Fragment>
      <DataBase />
      <DetailedInfo />
    </Fragment>
  );
};

export default DataBasePage;

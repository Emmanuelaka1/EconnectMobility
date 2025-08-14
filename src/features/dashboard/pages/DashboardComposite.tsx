import React from "react";
import DashboardVTC from "../../../components/VTC/DashboardVTC";
import DashboardAddons from "./DashboardAddons";
import DashboardHistory from "./DashboardHistory";

const DashboardComposite: React.FC = () => {
  return (
    <div className="space-y-8">
      <DashboardVTC />
      <DashboardAddons />
      <DashboardHistory />
    </div>
  );
};

export default DashboardComposite;

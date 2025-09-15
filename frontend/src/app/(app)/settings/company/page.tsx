import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { withPermission } from "@/lib/with-permission";
import { Metadata } from "next";
import CompanyDetail from "./_components/company-detail";

export const metadata: Metadata = {
  title: "Company Profile",
  description:
    "Manage your company's public information including name, address, and contact details.",
};

const CompanyPage = async () => {
  return (
    <div>
      <PageHeader
        title="Company Profile"
        description="Manage your company's public information including name, address, and contact details"
      />

      <div className="mt-7">
        <CompanyDetail />
      </div>
    </div>
  );
};

export default withPermission(CompanyPage, PermissionsEnum.VIEW_COMPANY_PAGE);

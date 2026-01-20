import { getLeadById } from "@/app/actions/get-lead";
import { getLoggedInSalesmanOrRedirect } from "@/app/actions/get-logged-in-salesman";
import LeadDetail from "@/components/lead-detail";
import { redirect } from "next/navigation";

type LeadDetailPageProps = { params: Promise<{ id: string }> };
export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const salesman = await getLoggedInSalesmanOrRedirect();
  const lead = await getLeadById(id, salesman.id);

  if (!lead) {
    redirect("/leads");
  }

  return <LeadDetail lead={lead} />;
}

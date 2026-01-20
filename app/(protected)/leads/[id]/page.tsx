import getLeadById from "@/app/actions/get-lead";
import LeadDetail from "@/components/lead-detail";
import { redirect } from "next/navigation";

type LeadDetailPageProps = { params: Promise<{ id: string }> };
export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    redirect("/leads");
  }

  return <LeadDetail lead={lead} />;
}

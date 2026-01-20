import { getBrands } from "@/app/actions/get-brands";
import { getEvents } from "@/app/actions/get-events";
import { LeadForm } from "@/components/lead-form";

export default async function NewLeadPage() {
  const { data: events } = await getEvents();
  const { data: brands } = await getBrands();
  return <LeadForm events={events} brands={brands} />;
}

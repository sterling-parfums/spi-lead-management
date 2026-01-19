import { getLeads } from "@/app/_actions/get-leads";
import LeadsTable from "@/components/leads-table";
import { LinkBehavior } from "@/components/link-behaviour";
import { Button } from "@mui/material";

export default async function LeadsPage() {
  const { data } = await getLeads();
  return (
    <>
      <Button
        component={LinkBehavior}
        href="/leads/new"
        variant="contained"
        fullWidth
      >
        Create New Lead{" "}
      </Button>
      <LeadsTable data={data} />
    </>
  );
}

import { getLeads } from "@/app/actions/get-leads";
import { getLoggedInSalesmanOrRedirect } from "@/app/actions/get-logged-in-salesman";
import LeadsTable from "@/components/leads-table";
import { LinkBehavior } from "@/components/link-behaviour";
import { Button } from "@mui/material";

export default async function LeadsPage() {
  const salesman = await getLoggedInSalesmanOrRedirect();
  const { data } = await getLeads(salesman.id);

  return (
    <>
      <Button
        component={LinkBehavior}
        href="/leads/new"
        variant="contained"
        fullWidth
        sx={{ mb: 2 }}
      >
        Create New Lead
      </Button>
      <LeadsTable data={data} />
    </>
  );
}

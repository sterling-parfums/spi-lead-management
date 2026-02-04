"use client";

import {
  Box,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EventAutocomplete } from "./event-autocomplete";
import { UserAutocomplete } from "./user-autocomplete";
import { Department, Event, User } from "@/app/generated/prisma/browser";
import { DepartmentAutocomplete } from "./department-autocomplete";
import { useActionState } from "react";
import { getSummary } from "@/app/actions/get-summary";
import { DataTable } from "./data-table";
import type { SummaryLead } from "@/app/actions/get-summary";

type SummaryFormProps = {
  events: Event[];
  departments: Department[];
  users: User[];
};

export function SummaryForm({ events, users, departments }: SummaryFormProps) {
  const [state, action, submitting] = useActionState(getSummary, null);

  const headers = ["Created At", "User", "Name", "Country", "Company", "Event"];
  const rows =
    state?.ok && state.data
      ? state.data?.map((l) => [
          new Date(l.createdAt).toLocaleString("en-GB"),
          l.salesman.user.fullName,
          l.name,
          l.country,
          l.companyName,
          l.event.name,
        ])
      : [];

  const summary = state?.ok && state.data ? buildSummary(state.data) : [];

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          alignItems: "start",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1.5fr" },
        }}
      >
        <Box
          component="form"
          action={action}
          sx={{ display: "grid", gap: 2, maxWidth: 400 }}
        >
          <EventAutocomplete events={events} required />
          <DepartmentAutocomplete departments={departments} />
          <UserAutocomplete users={users} />

          <TextField
            name="startDate"
            label="From Date"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            name="endDate"
            label="To Date"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button type="submit" variant="contained" loading={submitting}>
            Export
          </Button>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Aggregate
          </Typography>
          {summary.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Run a summary to see grouped totals.
            </Typography>
          )}
          {summary.length > 0 && (
            <Box sx={{ display: "grid", gap: 0.25 }}>
              {summary.map((event) => (
                <Accordion
                  key={event.name}
                  disableGutters
                  elevation={0}
                  defaultExpanded={event.departments.length === 1}
                  sx={{
                    "&:before": { display: "none" },
                    "& .MuiAccordionSummary-root": { minHeight: 32 },
                    "& .MuiAccordionSummary-content": { my: 0 },
                    "& .MuiAccordionDetails-root": { pt: 0.25 },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ flexDirection: "row-reverse", gap: 1 }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {event.name} ({event.total})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pl: 1.5 }}>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 0.25,
                        borderLeft: "1px solid",
                        borderColor: "divider",
                        pl: 1.5,
                      }}
                    >
                      {event.departments.map((department) => (
                        <Accordion
                          key={department.name}
                          disableGutters
                          elevation={0}
                          defaultExpanded={department.users.length === 1}
                          sx={{
                            "&:before": { display: "none" },
                            "& .MuiAccordionSummary-root": { minHeight: 30 },
                            "& .MuiAccordionSummary-content": { my: 0 },
                            "& .MuiAccordionDetails-root": { pt: 0.25 },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ flexDirection: "row-reverse", gap: 1 }}
                          >
                            <Typography variant="body1" fontWeight={500}>
                              {department.name} ({department.total})
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0, pl: 1.5 }}>
                            <Box
                              sx={{
                                display: "grid",
                                gap: 0.25,
                                borderLeft: "1px solid",
                                borderColor: "divider",
                                pl: 1.5,
                              }}
                            >
                              {department.users.map((user) => (
                                <Accordion
                                  key={user.name}
                                  disableGutters
                                  elevation={0}
                                  defaultExpanded={user.dates.length === 1}
                                  sx={{
                                    "&:before": { display: "none" },
                                    "& .MuiAccordionSummary-root": {
                                      minHeight: 28,
                                    },
                                    "& .MuiAccordionSummary-content": { my: 0 },
                                    "& .MuiAccordionDetails-root": { pt: 0.25 },
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{ flexDirection: "row-reverse", gap: 1 }}
                                  >
                                    <Typography variant="body2" fontWeight={500}>
                                      {user.name} ({user.total})
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails sx={{ pt: 0, pl: 1.5 }}>
                                    <Box
                                      sx={{
                                        display: "grid",
                                        gap: 0.25,
                                        borderLeft: "1px solid",
                                        borderColor: "divider",
                                        pl: 1.5,
                                      }}
                                    >
                                      {user.dates.map((date) => (
                                        <Typography
                                          key={date.date}
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          {date.date} ({date.total})
                                        </Typography>
                                      ))}
                                    </Box>
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {state && state.ok && state.data && (
        <>
          <p>Found {state.data.length} leads</p>
          <DataTable headers={headers} rows={rows} />
        </>
      )}

      {state?.ok === false && state.formError && (
        <Box mt={2} color="error.main">
          {state.formError}
        </Box>
      )}
    </>
  );
}

type DateSummary = { date: string; total: number };
type UserSummary = { name: string; total: number; dates: DateSummary[] };
type DepartmentSummary = {
  name: string;
  total: number;
  users: UserSummary[];
};
type EventSummary = {
  name: string;
  total: number;
  departments: DepartmentSummary[];
};

function buildSummary(leads: SummaryLead[]): EventSummary[] {
  const formatter = new Intl.DateTimeFormat("en-GB");
  const eventMap = new Map<
    string,
    {
      total: number;
      departmentMap: Map<
        string,
        {
          total: number;
          userMap: Map<
            string,
            {
              total: number;
              dateMap: Map<string, { total: number; display: string }>;
            }
          >;
        }
      >;
    }
  >();

  for (const lead of leads) {
    const eventName = lead.event.name;
    const departmentName = lead.salesman.department.name;
    const userName = lead.salesman.user.fullName;
    const createdAt = new Date(lead.createdAt);
    const dateKey = createdAt.toISOString().slice(0, 10);
    const dateDisplay = formatter.format(createdAt);

    const eventEntry =
      eventMap.get(eventName) ??
      (() => {
        const entry = { total: 0, departmentMap: new Map() };
        eventMap.set(eventName, entry);
        return entry;
      })();
    eventEntry.total += 1;

    const departmentEntry =
      eventEntry.departmentMap.get(departmentName) ??
      (() => {
        const entry = { total: 0, userMap: new Map() };
        eventEntry.departmentMap.set(departmentName, entry);
        return entry;
      })();
    departmentEntry.total += 1;

    const userEntry =
      departmentEntry.userMap.get(userName) ??
      (() => {
        const entry = { total: 0, dateMap: new Map() };
        departmentEntry.userMap.set(userName, entry);
        return entry;
      })();
    userEntry.total += 1;

    const dateEntry =
      userEntry.dateMap.get(dateKey) ??
      (() => {
        const entry = { total: 0, display: dateDisplay };
        userEntry.dateMap.set(dateKey, entry);
        return entry;
      })();
    dateEntry.total += 1;
  }

  const eventSummaries: EventSummary[] = Array.from(eventMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([eventName, eventEntry]) => ({
      name: eventName,
      total: eventEntry.total,
      departments: Array.from(eventEntry.departmentMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([departmentName, departmentEntry]) => ({
          name: departmentName,
          total: departmentEntry.total,
          users: Array.from(departmentEntry.userMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([userName, userEntry]) => ({
              name: userName,
              total: userEntry.total,
              dates: Array.from(userEntry.dateMap.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([, dateEntry]) => ({
                  date: dateEntry.display,
                  total: dateEntry.total,
                })),
            })),
        })),
    }));

  return eventSummaries;
}

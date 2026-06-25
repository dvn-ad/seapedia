"use client";

import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Alert from "@mui/joy/Alert";
import Chip from "@mui/joy/Chip";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import { Ship, Navigation, CheckCircle, Clock } from "lucide-react";

interface Job {
  id: number;
  orderId: number;
  storeName: string;
  destination: string;
  earning: number;
  status: "Menunggu Pengirim" | "Sedang Dikirim" | "Pesanan Selesai";
}

export default function DriverDashboard() {
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, orderId: 101, storeName: "Fresh Catch Co. (dummy)", destination: "123 Ocean Way (dummy)", earning: 15000, status: "Menunggu Pengirim" },
    { id: 2, orderId: 102, storeName: "Crab Paradise (dummy)", destination: "456 Bay View (dummy)", earning: 18000, status: "Menunggu Pengirim" },
  ]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [earnings, setEarnings] = useState(45000);

  const handleClaimJob = (job: Job) => {
    if (activeJob) {
      alert("You already have an active delivery job!");
      return;
    }
    const updated = { ...job, status: "Sedang Dikirim" as const };
    setActiveJob(updated);
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  };

  const handleCompleteJob = () => {
    if (activeJob) {
      setEarnings((prev) => prev + activeJob.earning);
      setActiveJob(null);
      alert(`Job completed! Rp ${activeJob.earning.toLocaleString("id-ID")} added to earnings.`);
    }
  };

  return (
    <Box>
      <Typography level="h2" sx={{ fontWeight: "lg", mb: 4 }}>
        Driver Dashboard (dummy)
      </Typography>

      <Grid container spacing={3}>
        {/* Active Job & Stats */}
        <Grid xs={12} md={5}>
          <Stack spacing={3}>
            {/* Earnings stats */}
            <Card variant="outlined" color="warning" invertedColors>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Ship size={24} />
                  <Typography level="title-md">Driver Earnings (dummy)</Typography>
                </Stack>
                <Typography level="h1" sx={{ mt: 1, fontWeight: "xl" }}>
                  Rp {earnings.toLocaleString("id-ID")}
                </Typography>
              </CardContent>
            </Card>

            {/* Active Delivery Job */}
            <Card variant="outlined">
              <CardContent>
                <Typography level="title-md" startDecorator={<Navigation size={18} />} sx={{ mb: 2 }}>
                  Active Delivery Job (dummy)
                </Typography>

                {activeJob ? (
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, border: "1px solid", borderColor: "primary.outlinedBorder", borderRadius: "md", bgcolor: "background.level1" }}>
                      <Typography level="title-sm" sx={{ fontWeight: "bold" }}>
                        Order #{activeJob.orderId}
                      </Typography>
                      <Typography level="body-xs" sx={{ mt: 0.5 }}>
                        <strong>Pickup:</strong> {activeJob.storeName}
                      </Typography>
                      <Typography level="body-xs" sx={{ mt: 0.5 }}>
                        <strong>Delivery Address:</strong> {activeJob.destination}
                      </Typography>
                      <Typography level="body-xs" sx={{ mt: 0.5 }}>
                        <strong>Payout:</strong> Rp {activeJob.earning.toLocaleString("id-ID")}
                      </Typography>
                      <Chip size="sm" color="warning" sx={{ mt: 1.5 }}>
                        {activeJob.status}
                      </Chip>
                    </Box>
                    <Button
                      variant="solid"
                      color="success"
                      onClick={handleCompleteJob}
                      startDecorator={<CheckCircle size={16} />}
                      fullWidth
                    >
                      Confirm Delivery Completed
                    </Button>
                  </Stack>
                ) : (
                  <Box sx={{ py: 4, textAlign: "center" }}>
                    <Typography level="body-sm" color="neutral">
                      No active job. Claim one from the available list!
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Available Jobs list */}
        <Grid xs={12} md={7}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography level="title-md" startDecorator={<Clock size={18} />} sx={{ mb: 3 }}>
                Available Delivery Jobs (dummy)
              </Typography>

              {jobs.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <Typography level="body-sm" color="neutral">
                    No available jobs nearby (dummy).
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {jobs.map((job) => (
                    <Box
                      key={job.id}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: "md",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography level="title-sm" sx={{ fontWeight: "bold" }}>
                          Order #{job.orderId}
                        </Typography>
                        <Typography level="body-xs" color="neutral" sx={{ mt: 0.5 }}>
                          From {job.storeName}
                        </Typography>
                        <Typography level="body-xs" color="neutral">
                          To {job.destination}
                        </Typography>
                        <Typography level="body-sm" color="primary" sx={{ mt: 1, fontWeight: "bold" }}>
                          Rp {job.earning.toLocaleString("id-ID")}
                        </Typography>
                      </Box>
                      <Button
                        variant="soft"
                        color="primary"
                        size="sm"
                        onClick={() => handleClaimJob(job)}
                      >
                        Claim Job
                      </Button>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

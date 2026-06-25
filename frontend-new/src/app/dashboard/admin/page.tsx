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
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Table from "@mui/joy/Table";
import { Shield, Sparkles, Activity, Plus } from "lucide-react";

interface DiscountCode {
  id: number;
  code: string;
  type: "Voucher" | "Promo";
  value: string;
  status: string;
}

export default function AdminDashboard() {
  const [vouchers, setVouchers] = useState<DiscountCode[]>([
    { id: 1, code: "WELCOME10 (dummy)", type: "Voucher", value: "10% Off", status: "Active" },
    { id: 2, code: "SEAFOOD50 (dummy)", type: "Promo", value: "Rp 50,000 Off", status: "Active" },
  ]);
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"Voucher" | "Promo">("Voucher");
  const [newValue, setNewValue] = useState("");

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode.trim() && newValue.trim()) {
      const codeObj: DiscountCode = {
        id: Date.now(),
        code: newCode.toUpperCase(),
        type: newType,
        value: newValue,
        status: "Active",
      };
      setVouchers((prev) => [codeObj, ...prev]);
      setNewCode("");
      setNewValue("");
    }
  };

  return (
    <Box>
      <Typography level="h2" sx={{ fontWeight: "lg", mb: 4 }}>
        Admin Dashboard (dummy)
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography level="title-sm" color="neutral">Total Users (dummy)</Typography>
              <Typography level="h2" sx={{ fontWeight: "xl", mt: 1 }}>128</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography level="title-sm" color="neutral">Active Stores (dummy)</Typography>
              <Typography level="h2" sx={{ fontWeight: "xl", mt: 1 }}>16</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography level="title-sm" color="neutral">Total Sales (dummy)</Typography>
              <Typography level="h2" sx={{ fontWeight: "xl", mt: 1 }}>Rp 2.4M</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography level="title-sm" color="neutral">Simulate SLA (dummy)</Typography>
              <Button color="danger" variant="soft" size="sm" sx={{ mt: 1 }} fullWidth>
                Simulate Next Day
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Create Discount Code */}
        <Grid xs={12} md={5}>
          <Card variant="outlined">
            <CardContent>
              <Typography level="title-md" startDecorator={<Plus size={18} />} sx={{ mb: 2 }}>
                Build Marketing Code (dummy)
              </Typography>

              <form onSubmit={handleCreateCode}>
                <Stack spacing={2}>
                  <FormControl required>
                    <FormLabel>Code Name</FormLabel>
                    <Input
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="e.g. SUMMER25"
                    />
                  </FormControl>

                  <FormControl required>
                    <FormLabel>Discount Value</FormLabel>
                    <Input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="e.g. 15% or Rp 20,000"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                      <Button
                        type="button"
                        variant={newType === "Voucher" ? "solid" : "outlined"}
                        onClick={() => setNewType("Voucher")}
                        size="sm"
                        sx={{ flexGrow: 1 }}
                      >
                        Voucher (limit count)
                      </Button>
                      <Button
                        type="button"
                        variant={newType === "Promo" ? "solid" : "outlined"}
                        onClick={() => setNewType("Promo")}
                        size="sm"
                        sx={{ flexGrow: 1 }}
                      >
                        Promo (expiration)
                      </Button>
                    </Stack>
                  </FormControl>

                  <Button type="submit" sx={{ mt: 1 }}>
                    Generate Code
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Codes list */}
        <Grid xs={12} md={7}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography level="title-md" startDecorator={<Activity size={18} />} sx={{ mb: 2 }}>
                Active Marketing Codes (dummy)
              </Typography>

              <Table borderAxis="both" size="sm">
                <thead>
                  <tr>
                    <th>Code Name</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v.id}>
                      <td>{v.code}</td>
                      <td>{v.type}</td>
                      <td>{v.value}</td>
                      <td>{v.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

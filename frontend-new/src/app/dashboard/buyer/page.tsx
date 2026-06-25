"use client";

import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Input from "@mui/joy/Input";
import Alert from "@mui/joy/Alert";
import Chip from "@mui/joy/Chip";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { Wallet, MapPin, ShoppingCart, Clock } from "lucide-react";

export default function BuyerDashboard() {
  const [balance, setBalance] = useState(150000);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (!isNaN(amt) && amt > 0) {
      setBalance((prev) => prev + amt);
      setSuccessMsg(`Successfully top up Rp ${amt.toLocaleString("id-ID")}`);
      setTopUpAmount("");
    }
  };

  return (
    <Box>
      <Typography level="h2" sx={{ fontWeight: "lg", mb: 4 }}>
        Buyer Dashboard (dummy)
      </Typography>

      <Grid container spacing={3}>
        {/* Wallet and Transactions */}
        <Grid xs={12} md={6}>
          <Stack spacing={3}>
            <Card variant="outlined" color="primary" invertedColors>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Wallet size={24} />
                  <Typography level="title-md">Wallet Balance (dummy)</Typography>
                </Stack>
                <Typography level="h1" sx={{ mt: 1, fontWeight: "xl" }}>
                  Rp {balance.toLocaleString("id-ID")}
                </Typography>

                <Box component="form" onSubmit={handleTopUp} sx={{ mt: 3 }}>
                  <Stack direction="row" spacing={1.5}>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <Input
                        type="number"
                        placeholder="Amount (e.g. 50000)"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        size="sm"
                        required
                      />
                    </FormControl>
                    <Button type="submit" size="sm" variant="solid" color="primary">
                      Top Up
                    </Button>
                  </Stack>
                </Box>
                {successMsg && (
                  <Alert color="success" variant="soft" size="sm" sx={{ mt: 2 }}>
                    {successMsg}
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography level="title-md" startDecorator={<Clock size={18} />} sx={{ mb: 2 }}>
                  Recent Transactions (dummy)
                </Typography>
                <List size="sm" variant="outlined" sx={{ borderRadius: "sm" }}>
                  <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                      <Typography level="body-xs" sx={{ fontWeight: "bold" }}>TOPUP</Typography>
                      <Typography level="body-xs" color="neutral">dummy time</Typography>
                    </Box>
                    <Typography level="body-sm" color="success" sx={{ fontWeight: "bold" }}>
                      +Rp 100,000
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                      <Typography level="body-xs" sx={{ fontWeight: "bold" }}>PAYMENT</Typography>
                      <Typography level="body-xs" color="neutral">dummy order #12</Typography>
                    </Box>
                    <Typography level="body-sm" color="danger" sx={{ fontWeight: "bold" }}>
                      -Rp 75,000
                    </Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Addresses and Active Cart */}
        <Grid xs={12} md={6}>
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography level="title-md" startDecorator={<MapPin size={18} />} sx={{ mb: 2 }}>
                  Addresses (dummy)
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "md" }}>
                    <Typography level="title-sm" sx={{ fontWeight: "bold" }}>Home Address (Default)</Typography>
                    <Typography level="body-xs" color="neutral" sx={{ mt: 0.5 }}>
                      dummy street address line, Jakarta
                    </Typography>
                  </Box>
                  <Button variant="outlined" color="neutral" size="sm">
                    Add New Address
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography level="title-md" startDecorator={<ShoppingCart size={18} />} sx={{ mb: 2 }}>
                  Shopping Cart (dummy)
                </Typography>
                <Alert color="warning" size="sm" variant="soft">
                  🛒 Single-store checkout rule: your cart can only contain products from one store.
                </Alert>
                <Box sx={{ py: 3, textAlign: "center" }}>
                  <Typography level="body-sm" color="neutral">
                    Your cart is currently empty (dummy).
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

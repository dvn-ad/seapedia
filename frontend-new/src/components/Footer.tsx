"use client";

import React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 3,
        borderTop: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
        mt: "auto",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ maxWidth: 1200, mx: "auto" }}
      >
        <Typography level="body-sm" color="neutral">
          &copy; {new Date().getFullYear()} SEAPEDIA. All rights reserved.
        </Typography>
        <Typography level="body-sm" color="neutral">
          One Account, Unlimited Possibilities.
        </Typography>
      </Stack>
    </Box>
  );
}

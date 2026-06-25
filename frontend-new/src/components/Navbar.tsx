"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Chip from "@mui/joy/Chip";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import { LogOut, UserCheck, ChevronDown, ShoppingBag } from "lucide-react";

export function Navbar() {
  const { user, activeRole, logout, selectRole, isAuthenticated } = useAuth();

  const nonAdminRoles = user?.roles.filter((r) => r !== "Admin") || [];

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        width: "100%",
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
        py: 1.5,
        px: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ maxWidth: 1200, mx: "auto" }}
      >
        {/* Left Side: Brand Logo and Navigation Links */}
        <Stack direction="row" alignItems="center" spacing={4}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              level="h4"
              sx={{
                fontWeight: "xl",
                background: "linear-gradient(to right, var(--joy-palette-primary-600), var(--joy-palette-primary-800))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SEAPEDIA
            </Typography>
          </Link>

          <Stack direction="row" spacing={2.5}>
            <Link href="/catalog" passHref style={{ textDecoration: "none" }}>
              <Typography level="title-sm" color="neutral" sx={{ "&:hover": { color: "primary.main" } }}>
                Catalog
              </Typography>
            </Link>
            <Link href="/#reviews" passHref style={{ textDecoration: "none" }}>
              <Typography level="title-sm" color="neutral" sx={{ "&:hover": { color: "primary.main" } }}>
                Reviews
              </Typography>
            </Link>
          </Stack>
        </Stack>

        {/* Right Side: Auth and Actions */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {isAuthenticated ? (
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* Active Role Chip */}
              {activeRole && (
                <Chip
                  color="primary"
                  variant="soft"
                  startDecorator={<UserCheck size={14} />}
                  size="md"
                >
                  {activeRole}
                </Chip>
              )}

              {/* Dashboard Navigation */}
              {activeRole && (
                <Link href={`/dashboard/${activeRole.toLowerCase()}`} style={{ textDecoration: "none" }}>
                  <Button variant="plain" color="neutral" size="sm">
                    Dashboard
                  </Button>
                </Link>
              )}

              {/* Switch Role Dropdown */}
              {nonAdminRoles.length > 1 && (
                <Dropdown>
                  <MenuButton
                    variant="outlined"
                    color="neutral"
                    size="sm"
                    endDecorator={<ChevronDown size={14} />}
                  >
                    Switch Role
                  </MenuButton>
                  <Menu size="sm">
                    {nonAdminRoles.map((role) => (
                      <MenuItem
                        key={role}
                        selected={activeRole === role}
                        onClick={() => selectRole(role)}
                      >
                        {role}
                      </MenuItem>
                    ))}
                  </Menu>
                </Dropdown>
              )}

              {/* User Account Details */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar size="sm" variant="soft" color="primary">
                  {user?.username ? user.username[0].toUpperCase() : "U"}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography level="title-sm" sx={{ fontWeight: "bold" }}>
                    {user?.username}
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                color="danger"
                size="sm"
                onClick={logout}
                startDecorator={<LogOut size={14} />}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1.5}>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <Button variant="plain" color="neutral" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register" style={{ textDecoration: "none" }}>
                <Button variant="solid" color="primary" size="sm">
                  Register
                </Button>
              </Link>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

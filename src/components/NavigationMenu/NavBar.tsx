// NavBar.tsx
import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";
import type { JSX } from "@emotion/react/jsx-runtime";
import { CloseRounded } from "@mui/icons-material";

export const DRAWER_WIDTH = 480; // <-- exportado para usarlo en Remapper
export const DRAWER_WIDTH_XS = 80

interface NavBarProps {
    navItems: string[];
    drawer?: JSX.Element;
    windowProps?: () => Window;
    onDrawerToggle?: (open: boolean) => void; // <-- NUEVO
}

export default function Navbar({ navItems, drawer, windowProps, onDrawerToggle }: NavBarProps) {
    const [mobileOpen, setMobileOpen] = React.useState(true);

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => {
            const next = !prev;
            onDrawerToggle?.(next); // <-- notificamos cambio
            return next;
        });
    };

    // Opcional: notificar el estado inicial
    React.useEffect(() => { onDrawerToggle?.(mobileOpen); }, []); // eslint-disable-line

    const container = windowProps !== undefined ? () => windowProps().document.body : undefined;

    return (
        <>
            <AppBar
                component="nav"
                position="fixed"
                color="primary"
                sx={(theme) => ({
                    top: 'auto',
                    bottom: 0,
                    maxHeight: "4rem",
                    zIndex: theme.zIndex.drawer + 1, // <-- AppBar por ENCIMA del Drawer
                })}
            >
                <Toolbar>
                    {drawer && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        CSV REMAPPER
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button key={item} sx={{ color: '#fff' }}>
                                {item}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            {drawer && (
                <nav>
                    <Drawer
                        container={container}
                        variant="persistent"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        anchor="left"
                        sx={{
                            display: { xs: 'block', md: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { xs: DRAWER_WIDTH_XS, sm: DRAWER_WIDTH } }
                        }}
                    >
                        <IconButton 
                        onClick={handleDrawerToggle}
                        sx={{
                            alignSelf: "flex-end"
                        }}>
                            <CloseRounded/>
                        </IconButton>
                        {drawer}
                    </Drawer>
                </nav>
            )}
        </>
    );
}

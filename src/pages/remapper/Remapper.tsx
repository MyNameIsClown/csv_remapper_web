import './Remapper.css'
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { getFileInfo } from "../../utils/fileHandler";
import {
    Box,
    Button,
    Card,
    Checkbox,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Navbar, { DRAWER_WIDTH, DRAWER_WIDTH_XS} from "../../components/NavigationMenu/NavBar";
import { IconButton, Stack, Tooltip, Divider } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


type CsvKeyType = "integer" | "float" | "date" | "text";

type Row = {
    old_key_name: string;
    new_key_name?: string;
    type: CsvKeyType;
    is_active: boolean;
};

/** Normaliza diferentes formas de respuesta a un array de Row */
function normalizeToRows(input: any): Row[] {
    if (!input) return [];

    // Caso 1: ya es un array de filas
    if (Array.isArray(input)) {
        return input.map((r: any) => ({
            old_key_name: String(r.old_key_name ?? r.key_name ?? r.name ?? ""),
            new_key_name: r.new_key_name ?? "",
            type: (r.type as CsvKeyType) ?? "text",
            is_active: Boolean(
                r.is_active ??
                r.active ??
                true // por defecto activas
            ),
        })).filter((r: Row) => r.old_key_name);
    }

    // Caso 2: viene como { rows: [...] }
    if (Array.isArray(input.rows)) {
        return normalizeToRows(input.rows);
    }

    // Caso 3: viene como { types: [...] } (clave, tipo, etc.)
    if (Array.isArray(input.types)) {
        return input.types.map((t: any) => ({
            old_key_name: String(t.key_name ?? t.name ?? ""),
            new_key_name: "",
            type: (t.type as CsvKeyType) ?? "text",
            is_active: Boolean(t.is_active ?? true),
        })).filter((r: Row) => r.old_key_name);
    }

    // Caso 4: objeto con claves -> tipos
    if (typeof input === "object") {
        const entries = Object.entries(input);
        if (entries.length) {
            return entries.map(([k, v]) => ({
                old_key_name: String(k),
                new_key_name: "",
                type: (v as CsvKeyType) ?? "text",
                is_active: true,
            }));
        }
    }

    return [];
}

function Remapper() {
    let navigate = useNavigate()

    const params = useParams();
    const location = useLocation() as any;

    const [rows, setRows] = useState<Row[]>([]);
    const [isToolsOpen, setIsToolsOpen] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    // Carga inicial de datos
    useEffect(() => {
        let mounted = true;

        async function boot() {
            setLoading(true);
            try {
                // Prioriza lo que venga en location.state
                if (location?.state?.rows) {
                    if (mounted) setRows(normalizeToRows(location.state.rows));
                    return;
                }
                if (location?.state?.types) {
                    if (mounted) setRows(normalizeToRows(location.state.types));
                    return;
                }

                // Si no hay estado, intenta pedir por file_id
                const file_id = params.file_id as string | undefined;
                if (file_id) {
                    const data = await getFileInfo(file_id);
                    if (mounted) setRows(normalizeToRows(data));
                }
            } catch (e) {
                console.error("Error loading file info:", e);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        boot();
        return () => { mounted = false; };
    }, [location?.state, params.file_id]);

    const updateRow = (index: number, patch: Partial<Row>) => {
        setRows((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], ...patch };
            return next;
        });
    };

    const btn_actions = [
        { key: "save", label: "Guardar", icon: <SaveIcon />, color: "primary", onClick: () => {/* TODO guardar */ } },
        { key: "savecfg", label: "Guardar configuración", icon: <SaveAsIcon />, color: "primary", onClick: () => {/* TODO guardar cfg */ } },
        { key: "loadcfg", label: "Cargar configuración", icon: <FileOpenIcon />, color: "primary", onClick: () => {/* TODO cargar cfg */ } },
        { key: "help", label: "Ayuda", icon: <HelpOutlineIcon />, color: "secondary", onClick: () => {/* TODO ayuda */ } },
        { key: "upload", label: "Subir nuevo archivo", icon: <CloudUploadIcon />, color: "secondary", onClick: () => {/* TODO subir */ } },
        { key: "back", label: "Volver", icon: <ArrowBackIcon />, color: "inherit", onClick: () => { navigate("/"); } },
    ];
    const drawer = (
        <Box sx={{ p: 2 }}>
            {/* Versión de ESCRITORIO (sm y superiores): botones completos con icono y texto */}
            <Stack spacing={1} sx={{ display: { xs: "none", sm: "flex" } }}>
                {btn_actions.map(a => (
                    <Button
                        key={a.key}
                        variant="contained"
                        color={a.color as any}
                        startIcon={a.icon}
                        fullWidth
                        onClick={a.onClick}
                        sx={{
                            justifyContent: "flex-start",
                            borderRadius: 2,
                            textTransform: "none",
                            py: 1.25,
                        }}
                    >
                        {a.label}
                    </Button>
                ))}
            </Stack>

            {/* Separador visible solo en escritorio */}
            <Divider sx={{ my: 2, display: { xs: "none", sm: "block" } }} />

            {/* Versión MÓVIL (xs): solo iconos con tooltip, en fila con salto */}
            <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                justifyContent="center"
                sx={{ display: { xs: "flex", sm: "none" } }}
            >
                {btn_actions.map(a => (
                    <Tooltip key={a.key} title={a.label} arrow>
                        <IconButton
                            onClick={a.onClick}
                            size="large"
                            sx={{
                                borderRadius: 2,
                                boxShadow: 1,
                            }}
                        >
                            {a.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </Stack>
        </Box>
    );

    const navItems = ["Cosa 1"];

    return (
        <Box>
            {/* Contenido desplazable: deja hueco al drawer cuando está abierto */}
            <Box
                className="rows"
                sx={(theme) => ({
                    ml: isToolsOpen ? { xs: `${DRAWER_WIDTH_XS}px`, sm: `${DRAWER_WIDTH}px` } : 0,
                    transition: theme.transitions.create("margin-left", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    pb: "4rem", // hueco para el AppBar fijo inferior
                    px: 2,
                })}
            >
                {loading && (
                    <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                        Cargando…
                    </Typography>
                )}

                {!loading && rows.length === 0 && (
                    <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                        No hay datos para mostrar.
                    </Typography>
                )}

                {rows.map((row, i) => (
                    <Card key={`${row.old_key_name}-${i}`} className="remapper-card" sx={{ p: 2, mb: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                        <Checkbox
                            name={`rows[${i}][is_active]`}
                            checked={Boolean(row.is_active)}
                            onChange={(e) => updateRow(i, { is_active: e.target.checked })}
                        />

                        <TextField
                            label="Nombre nuevo"
                            name={`rows[${i}][new_key_name]`}
                            value={row.new_key_name ?? ""}
                            onChange={(e) => updateRow(i, { new_key_name: e.target.value })}
                            placeholder={row.old_key_name}
                            size="small"
                        />

                        <Select
                            labelId={`row-type-${i}`}
                            name={`rows[${i}][type]`}
                            value={row.type ?? "text"}
                            onChange={(e) => updateRow(i, { type: e.target.value as CsvKeyType })}
                            size="small"
                        >
                            <MenuItem value="integer">Integer</MenuItem>
                            <MenuItem value="float">Float</MenuItem>
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="text">Text</MenuItem>
                        </Select>

                        <Box sx={{ ml: "auto" }}>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Clave original: <b>{row.old_key_name}</b>
                            </Typography>
                        </Box>
                    </Card>
                ))}

                {rows.length > 0 && (
                    <Button variant="contained">Merge</Button>
                )}
            </Box>

            {/* Navbar con Drawer persistente y callback para sincronizar el desplazamiento */}
            <Navbar
                drawer={drawer}
                navItems={navItems}
                onDrawerToggle={setIsToolsOpen}
            />
        </Box>
    );
}

export default Remapper;

import './Remapper.css'
import { useEffect, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { downloadConfigFile, getFileInfo, getTransformationFile, uploadConfigFile, uploadFile } from "../../utils/fileHandler";
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
import { useLoading } from '../../utils/LoadingContext';
import VisuallyHiddenInput from '../../components/VisuallyHidenInput';
import { usePopUp } from '../../utils/PopUpContext';
import { BaseErrorDialog } from '../../components/ErrorDialogs/ErrorDialogs';


type CsvKeyType = "positive_number" | "negative_number" | "datetime" | "text";

type Row = {
    old_key_name: string;
    new_key_name?: string;
    old_type: CsvKeyType;
    new_type: CsvKeyType | "" | null;
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
            old_type: (r.old_type as CsvKeyType) ?? "text",
            new_type: (r.new_type as CsvKeyType) ?? "",
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
            old_type: (t.old_type as CsvKeyType) ?? "text",
            new_type: (t.new_type as CsvKeyType) ?? "",
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
                old_type: (v as CsvKeyType) ?? "text",
                new_type: "",
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
    const {isLoading, setLoading} = useLoading();
    const {setOpen, setContent} = usePopUp();
    const file_id = params.file_id as string;

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
            const current = next[index];
    
            let newPatch = { ...patch };
    
            // If the change is new_type
            if (patch.new_type !== undefined) {
                const v = patch.new_type;
    
                // If new_type == old_type set nothing
                if (v === current.old_type) {
                    newPatch.new_type = "";
                }
            }
    
            next[index] = { ...current, ...newPatch };
            return next;
        });
    };

    const saveStreamCSV = (filename: string, text: string) => {
        if (typeof window === "undefined") return;
      
        const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
      
        // Compatibilidad con IE10+
        if ((window.navigator as any).msSaveBlob) {
          (window.navigator as any).msSaveBlob(blob, filename);
        } else {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = filename;
      
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
      
          URL.revokeObjectURL(url); // 🔑 libera memoria
        }
        setLoading(false)
    };    

    const saveStreamConfig = (filename: string, text: string) => {
        if (typeof window === "undefined") return;
      
        const blob = new Blob([text], { type: "text/cfg;charset=utf-8;" });
      
        // Compatibilidad con IE10+
        if ((window.navigator as any).msSaveBlob) {
          (window.navigator as any).msSaveBlob(blob, filename);
        } else {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = filename;
      
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
      
          URL.revokeObjectURL(url); // 🔑 libera memoria
        }
        setLoading(false)
    };      

    const save = () => {
        setLoading(true)
        getTransformationFile(file_id, rows)
        .then((response) => saveStreamCSV(`conversion.csv`, response))
        .catch((error) => {
            setLoading(false)
            setContent(<BaseErrorDialog error={error}/>)
            setOpen(true)
        })
    }
    const saveConfigFile = () => {
        setLoading(true)
        downloadConfigFile(file_id, rows)
        .then((response) => saveStreamConfig(`conversion_config.txt`, response))
        .catch((error) => {
            setLoading(false)
            setContent(<BaseErrorDialog error={error}/>)
            setOpen(true)
        })
    }
    const setConfiguration = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        if (files != null && files.length != 0) {
            setLoading(true);
            uploadConfigFile(file_id, files[0])
            .then((response) => {
                setRows(normalizeToRows(response))
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                setContent(<BaseErrorDialog error={error}/>)
                setOpen(true)
            })
        }
    }

    const btn_actions = [
        { key: "save", label: "Guardar", icon: <SaveIcon />, color: "primary", onClick: save, isUploadFileBtn: false},
        { key: "savecfg", label: "Guardar configuración", icon: <SaveAsIcon />, color: "primary", onClick: saveConfigFile, isUploadFileBtn: false},
        { key: "loadcfg", label: "Cargar configuración", icon: <FileOpenIcon />, color: "primary", onClick: setConfiguration, isUploadFileBtn: true},
        { key: "help", label: "Ayuda", icon: <HelpOutlineIcon />, color: "secondary", onClick: () => {/* TODO ayuda */ }, isUploadFileBtn: false},
        { key: "upload", label: "Subir nuevo archivo", icon: <CloudUploadIcon />, color: "secondary", onClick: () => {/* TODO subir */ }, isUploadFileBtn: false},
        { key: "back", label: "Volver", icon: <ArrowBackIcon />, color: "inherit", onClick: () => { navigate("/"); }, isUploadFileBtn: false},
    ];
    const drawer = (
        <Box sx={{ p: 2 }}>
            {/* Versión de ESCRITORIO (sm y superiores): botones completos con icono y texto */}
            <Stack spacing={1} sx={{ display: { xs: "none", sm: "flex" } }}>
                {btn_actions.map(a => (
                    <Button
                        component={a.isUploadFileBtn ? "label": "button"}
                        key={a.key}
                        variant="contained"
                        color={a.color as any}
                        startIcon={a.icon}
                        fullWidth
                        onClick={a.isUploadFileBtn ? ()=>{} : a.onClick}
                        sx={{
                            justifyContent: "flex-start",
                            borderRadius: 2,
                            textTransform: "none",
                            py: 1.25,
                        }}
                    >
                        {a.label}
                        {a.isUploadFileBtn && 
                            <VisuallyHiddenInput
                            type="file"
                            onChange={(e) => a.onClick(e)}
                            multiple
                            />
                        }
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
                            component={a.isUploadFileBtn ? "label": "button"}
                            onClick={a.isUploadFileBtn ? a.onClick: ()=>{}}
                            size="large"
                            sx={{
                                borderRadius: 2,
                                boxShadow: 1,
                            }}
                        >
                            {a.icon}
                            {a.isUploadFileBtn && 
                                <VisuallyHiddenInput
                                type="file"
                                onChange={(e) => a.onClick(e)}
                                multiple
                                />
                            }
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
                {!isLoading && rows.length === 0 && (
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
                            label={row.old_key_name}
                            name={`rows[${i}][new_key_name]`}
                            value={row.new_key_name ?? ""}
                            onChange={(e) => updateRow(i, { new_key_name: e.target.value })}
                            placeholder={row.old_key_name}
                            size="small"
                        />

                        <Select
                            labelId={`row-type-${i}`}
                            name={`rows[${i}][type]`}
                            value={row.new_type ? row.new_type : row.old_type}
                            onChange={(e) => updateRow(i, { new_type: e.target.value as CsvKeyType })}
                            size="small"
                        >
                            <MenuItem value="positive_number">Positive Number</MenuItem>
                            <MenuItem value="negative_number">Negative Number</MenuItem>
                            <MenuItem value="datetime">Date</MenuItem>
                            <MenuItem value="text">Text</MenuItem>
                        </Select>
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

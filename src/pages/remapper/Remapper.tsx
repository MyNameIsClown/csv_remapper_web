import './Remapper.css'
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { getFileInfo } from "../../utils/fileHandler";
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { Box, Card, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import Navbar from '../../components/NavigationMenu/NavBar';

// type RemapperProps = {
//     data: {}
// }

type KeyType = {
    old_key_name: string
    new_key_name?: string
    type: string
    is_active: boolean
}

function Remapper() {
    let params = useParams();
    let location = useLocation();
    let [rows, setRows] = useState<KeyType[]>();
    let [isToolsOpen, setIsToolsOpen] = useState<boolean>(true);

    useEffect(() => {
        if (params.file_id) {
            if (location.state && location.state.types) {
                const keyLists: KeyType[] = Object.entries<string>(location.state.types).map(([key, value]) => ({
                    old_key_name: key,
                    type: value,
                    is_active: true
                }));
                setRows(keyLists)
            } else {
                getFileInfo(params.file_id).then((data) => {
                    const keyLists: KeyType[] = Object.entries<string>(data).map(([key, value]) => ({
                        old_key_name: key,
                        type: value,
                        is_active: true
                    }));
                    setRows(keyLists)
                })
            }
        }
    }, [params.file_id, location.state]);


    const saveFile = (e: any) => {
        console.log(e)
    }
    const updateRow = (i: number, patch: Partial<KeyType>) => {
        setRows(prev => prev!.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    };

    const handleSubmit = () => {
        saveFile(rows);
    };

    const navItems = ["Cosa 1"]
    const drawer = (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <div className="remapper-container">
                <div className="rows">
                    {rows?.map((row, i) => (
                        <Card key={row.old_key_name} className='remapper-container'>
                            <Checkbox
                                name={`rows[${i}][is_active]`}
                                checked={row.is_active}
                                onChange={(e) => updateRow(i, { is_active: e.target.checked })}
                            />

                            <TextField
                                name={`rows[${i}][key_name]`}
                                value={row.new_key_name}
                                onChange={(e) => updateRow(i, { new_key_name: e.target.value })}
                                placeholder={row.old_key_name}
                            />

                            <Select
                                name={`rows[${i}][type]`}
                                value={row.type}
                                onChange={(e) => updateRow(i, { type: e.target.value as KeyType["type"] })}
                            >
                                <MenuItem value="integer">Integer</MenuItem>
                                <MenuItem value="float">Float</MenuItem>
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="text">Text</MenuItem>
                            </Select>
                        </Card>
                    ))}
                    <Button variant='contained'>Merge</Button>

                </div>
            </div>
            <Navbar drawer={drawer} navItems={navItems} />
        </>
    )
}

export default Remapper
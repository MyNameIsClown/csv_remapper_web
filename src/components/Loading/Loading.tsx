import { Box, CircularProgress } from "@mui/material";
import { useLoading } from "../../utils/LoadingContext";


export default function Loading(){
    const {isLoading} = useLoading();
    return (
        <>
            {isLoading &&
                <Box 
                    position="fixed" 
                    display="flex"
                    justifyItems="center"
                    width="100vw"
                    height="100vh"
                    top="0"
                    right="0"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        backgroundColor:"rgba(255, 255, 255, 0.2)",
                        zIndex: 9999
                    }}
                >
                    <CircularProgress color="success"/>
                </Box>
            }  
        </>
    )
}
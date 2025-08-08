import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { getFileInfo } from "../../utils/fileHandler";

// type RemapperProps = {
//     data: {}
// }

function Remapper(){
    let params = useParams();
    let location = useLocation();
    let [types, setTypes] = useState<any>()

    useEffect(() => {
        if (params.file_id){
            if (location.state && location.state.types) {
                setTypes(location.state.types);
            } else {
                getFileInfo(params.file_id).then((data)=>{
                    setTypes(data)
                })
            }
        }
    }, [params.file_id, location.state]);

    return(
        <div>
            
        </div>
    )
}

export default Remapper
import './Remapper.css'
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { getFileInfo } from "../../utils/fileHandler";
import Footer from "../../components/Footer/Footer";
import Card from '../../components/Card/Card';

// type RemapperProps = {
//     data: {}
// }

function Remapper(){
    let params = useParams();
    let location = useLocation();
    let [types, setTypes] = useState<Record<string, string>>({});

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
        <>
            <div className="remapper-container">
                <aside>
                    <div className='tools'>
                        <button>SAVE</button>
                        <button>SAVE CONFIG</button>
                        <button>LOAD CONFIG</button>
                        <button>HELP</button>
                    </div>
                    <div className='operations'>
                        <button>UPLOAD NEW FILE</button>
                        <button>BACK</button>
                    </div>
                </aside>
                <div className="rows">
                    {Object.entries(types).map(([key, value]) => (
                        <Card variant='flat'>  
                            {key}: {value}
                        </Card>
                    ))}
                    <Card>
                        <button>Merge columns</button>
                    </Card>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}

export default Remapper
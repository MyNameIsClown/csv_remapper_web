import { fetchHandler } from "./fetchHandler.ts";

export function getFileId(){
  return localStorage.getItem("file-id")
}
function saveFileId(file_id:string){
  if(file_id){
    localStorage.setItem("file-id", file_id)
  }
}

// RENAME FILE
export async function renameFile() {
  try {
    const file_id = getFileId()
    if(!file_id){
      throw new Error("No file id founded")
    }
    const response = await fetchHandler(`/csv-file/${file_id}/rename`);
    if (response.status == 200) {
      response.json().then((value:any)=>{
        return value
      })
    }
  } catch (err) {
    console.error(err);
  }
};

// UPLOAD FILE
export async function uploadFile (uploadFile:File){
  try {
    const fileData : FormData = new FormData()
    fileData.append("file", uploadFile)
    const response = await fetchHandler("/csv-file/", {
      method: "POST",
      body: fileData,
    });
    saveFileId(response["file_id"])
    return response
  } catch (err) {
    console.error(err);
  }
};
export async function getFileInfo (file_id:string){
  try {
    const response = await fetchHandler(`/csv-file/${file_id}`, {
      method: "GET",
    });
    return response
  } catch (err) {
    console.error(err);
  }
};

export async function getTransformationFile (file_id:string, data: any){
  try {
    const response = await fetchHandler(`/csv-file/${file_id}/transform`, {
      method: "POST",
      body: JSON.stringify(data)
    });
    return response
  } catch (err) {
    console.error(err);
  }
}

export async function downloadConfigFile (file_id:string, data: any){
  try {
    const response = await fetchHandler(`/csv-file/${file_id}/encrypt_config_file`, {
      method: "POST",
      body: JSON.stringify(data)
    });
    return response
  } catch (err) {
    console.error(err);
  }
}
export async function uploadConfigFile (file_id:string, uploadFile:File){
  try {
    const fileData : FormData = new FormData()
    fileData.append("file", uploadFile)
    const response = await fetchHandler(`/csv-file/${file_id}/decrypt_config_file`, {
      method: "POST",
      body: fileData,
    });
    saveFileId(response["file_id"])
    return response
  } catch (err) {
    console.error(err);
  }
};
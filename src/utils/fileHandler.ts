import { fetchHandler } from "./fetchHandler.ts";

export function getFileId(){
  return localStorage.getItem("file-id")
}

export function saveFileId(file_id:string){
  if(file_id){
    localStorage.setItem("file-id", file_id)
  }
}

// UPLOAD FILE
export async function uploadFile (uploadFile:File){
  const fileData : FormData = new FormData()
  fileData.append("file", uploadFile)
  const response : Promise<any> = await fetchHandler("/csv-file/", {
    method: "POST",
    body: fileData,
  });
  return response
};

// GET INFO FILE
export async function getFileInfo (file_id:string){
  const response = await fetchHandler(`/csv-file/${file_id}`, {
    method: "GET",
  });
  return response
};

// TRANFORM FILE
export async function getTransformationFile (file_id:string, data: any){
  const response = await fetchHandler(`/csv-file/${file_id}/transform`, {
    method: "POST",
    body: JSON.stringify(data)
  });
  return response
}

// DOWNLOAD ENCRYPTED CONFIG
export async function downloadConfigFile (file_id:string, data: any){
  const response = await fetchHandler(`/csv-file/${file_id}/encrypt_config_file`, {
    method: "POST",
    body: JSON.stringify(data)
  });
  return response
}

// UPLOAD ENCRYPTED CONFIG
export async function uploadConfigFile (file_id:string, uploadFile:File){
  const fileData : FormData = new FormData()
  fileData.append("file", uploadFile)
  const response = await fetchHandler(`/csv-file/${file_id}/decrypt_config_file`, {
    method: "POST",
    body: fileData,
  });
  saveFileId(response["file_id"])
  return response
};
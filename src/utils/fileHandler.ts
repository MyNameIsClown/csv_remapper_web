import { fetchHandler } from "./fetchHandler.ts";

function getFileId(){
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
    console.log(response)
    saveFileId(response["file_id"])
  } catch (err) {
    console.error(err);
  }
};

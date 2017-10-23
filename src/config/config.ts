/**
 * Created by kfaulhaber on 13/07/2017.
 */

export const DEFAULT_VALUES = {
  preferredUploadDuration:  20,
  chunkSize:                1024*1024,
  token:                    "TOKEN_STRING_HERE",
  name:                     "",
  description:              "",
  file:                     null, //Required
  upgrade_to_1080:          false,
  timeInterval:             150,
  maxAcceptedFails:         20,
  maxAcceptedUploadDuration: 60,
  useDefaultFileName:       false,
  retryTimeout:             5000,
  videoData:                {}, //See link for a full list of supported metaData | https://developer.vimeo.com/api/endpoints/videos#PATCH/videos/{video_id}
  editVideoOnComplete:      true,
};


export const DEFAULT_EVENTS = {
  chunkprogresschanged: (event: CustomEvent)=>console.log(`Default: Chunk Progress Update: ${event.detail}/100`),
  totalprogresschanged: (event: CustomEvent)=>console.log(`Default: Total Progress Update: ${event.detail}/100`),
  //Only for FATAL errors
  vimeouploaderror:     ()=>{},
  vimeouploadcomplete:  ()=>{},
  //All other errors
  vimeouploadwarning:   ()=>{}
};

export const ERRORS = [
  {
    id: "001",
    code: "CHUNK_ERROR",
    title: "Chunk upload failed.",
    detail: "Partial upload failed.",
    type: "minor"
  },
  {
    id: "002",
    code: "CHUNK_ABORT",
    title: "Chunk upload was aborted.",
    detail: "Partial upload exceeded maximum time limit.",
    type: "minor"
  },
  {
    id: "003",
    code: "MAX_FAILURE_LIMIT_ATTAINED",
    title: "Maximum failure limit attained.",
    detail: "Number of accepted minor errors exceeded.",
    type: "fatal"
  },
  {
    id: "004",
    code: "EDIT_PERMISSION_DENIED",
    title: "Edit scope was not provided.",
    detail: "A the [EDIT] scope is required to add a name and description after a video has been uploaded.",
    type: "minor"
  }
];
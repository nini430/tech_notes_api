export interface NoteValues {
    title:string;
    text:string;
    user:string;
}

export interface NoteUpdateValues extends NoteValues {
    isCompleted:boolean;
    id:string;
}
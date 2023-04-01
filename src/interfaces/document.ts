export default interface IDocument {
  id?: Number;
  dealId?: Number;
  documentName?: String;
  tag?: String;
  posted?: Date;
  lastAccessed?: Date;
  note?: String;
  filePath?: String;
}
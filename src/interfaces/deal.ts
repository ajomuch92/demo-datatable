export default interface Deal {
  id?: Number;
  issuer?: String;
  dealName?: String;
  bloombergId?: String;
  isin?: String;
  customDealIdentifiers?: String[];
  customIssuerIdentifiers?: String[];
  industry?: String;
  agent?: String;
  source?: String;
  status?: String;
  total?: Number;
  lastPosted?: Date;
  lastAccessed?: Date;
  analysts?: String[];
  docCount?: Number;
  customField?: String;
}
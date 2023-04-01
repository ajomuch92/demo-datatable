import dealJson from './deals_dataset.json';
import docsJson from './docs_dataset.json';
import { IDeal, IDocument } from '../interfaces';

export function getAllDeals(): IDeal[] {
  const { Holdings } = dealJson.data;
  const list: IDeal[] = [];
  for(let i = 0; i < Holdings.length; i += 1) {
    const holding = Holdings[i];
    const deal: IDeal = populateDeal(holding);
    list.push(deal);
  }
  return list;
}

export function getDocumentsByDealId(dealId: Number): IDocument[] {
  const { docs } = docsJson.data;
  const documentsFound = docs.filter((r) => r.deal_id === dealId);
  const list: IDocument[] = [];
  for(let i = 0; i < documentsFound.length; i += 1) {
    const documentFound = documentsFound[i];
    list.push(populateDocument(documentFound));
  }
  return list;
}

function populateDeal(holding: any): IDeal {
  const { ClientIssuers, Industries, Agents, Sources } = dealJson.data;
  const deal: IDeal = {};
  const { Id, DealName, IndustryId, Access, AgentId, SourceId, IssuerId } = holding;
  deal.id = Id;
  deal.issuer = findFieldOnArray(ClientIssuers, IssuerId);
  deal.dealName = DealName;
  deal.industry = findFieldOnArray(Industries, IndustryId);
  deal.access = Access === 1 ? 'Public' : 'Private';
  deal.agent = findFieldOnArray(Agents, AgentId);
  deal.source = findFieldOnArray(Sources, SourceId);
  return deal;
}

function findFieldOnArray(arr: any[], id: String | Number, field: string = 'Id'): String {
  const found: any = arr.find((r) => r.Id === id) || {};
  return found[field] || '';
}

function populateDocument(document: any): IDocument {
  const documentTransformed: IDocument = {
    id: document.id,
    dealId: document.deal_id,
    documentName: document.doc_name,
    posted: document.posted,
    lastAccessed: document.last_accessed,
    note: document.source_file?.note,
    filePath: document.folder_path,
  };
  return documentTransformed;
}
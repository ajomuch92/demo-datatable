export default interface IColumn {
  label: string;
  field: string;
  sortable?: Boolean;
  filterable?: Boolean;
  headerClass?: String;
  cellClass?: String;
  width?: any;
}
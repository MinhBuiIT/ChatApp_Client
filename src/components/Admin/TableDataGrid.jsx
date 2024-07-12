import { DataGrid } from '@mui/x-data-grid';

const TableDataGrid = ({ rows, columns, rowHeight }) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      rowHeight={rowHeight}
      sx={{ '& .header-custom': { background: '#000', color: '#fff' } }}
    />
  );
};

export default TableDataGrid;

import {
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Empty from 'core/components/Empty';
import MatrixData from 'matrix/types/MatrixData';
import { descendingComparator } from 'matrix/utils/descendingComparator';
import { stableSort } from 'matrix/utils/stableSort';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MatrixTableHead from './MatrixTableHead';
import MatrixTableRow from './MatrixTableRow';

type Order = 'asc' | 'desc';

const getComparator = <Key extends keyof any>(
  order: Order,
  orderBy: Key
): ((
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

type MatrixTableProps = {
  processing: boolean;
  onDelete: (matrix: MatrixData) => void;
  onEdit: (matrix: MatrixData) => void;
  onView: (matrix: MatrixData) => void;
  matrices?: MatrixData[];
};

const MatrixTable = ({
  onDelete,
  onEdit,
  onView,
  processing,
  matrices = [],
}: MatrixTableProps) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof MatrixData>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { t } = useTranslation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof MatrixData
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  if (matrices.length === 0) {
    return <Empty title={t('matrix.table.empty')} />;
  }

  const stringifiedMatrices = matrices.map((matrix) => {
    return {
      ...matrix,
      values: JSON.stringify(matrix.values),
    };
  });

  return (
    <React.Fragment>
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          sx={{
            minWidth: 600,
            borderCollapse: 'separate',
            borderSpacing: '0 1rem',
          }}
        >
          <MatrixTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(stringifiedMatrices, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((matrix, index) => {
                const originalMatrix = matrices.find(
                  (matrixObj) => matrixObj.id === matrix.id
                );
                return (
                  <MatrixTableRow
                    index={index}
                    key={matrix.id}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onView={onView}
                    processing={processing}
                    matrix={originalMatrix!}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={matrices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export default MatrixTable;

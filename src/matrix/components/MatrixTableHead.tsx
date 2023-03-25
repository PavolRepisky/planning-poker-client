import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import MatrixData from 'matrix/types/MatrixData';
import { useTranslation } from 'react-i18next';

interface HeadCell {
  id: keyof MatrixData;
  label: string;
  align: 'center' | 'left' | 'right';
}

const headCells: HeadCell[] = [
  {
    id: 'id',
    align: 'center',
    label: 'matrix.table.headers.id',
  },
  {
    id: 'name',
    align: 'center',
    label: 'matrix.table.headers.name',
  },
  {
    id: 'rows',
    align: 'center',
    label: 'matrix.table.headers.rows',
  },
  {
    id: 'columns',
    align: 'center',
    label: 'matrix.table.headers.columns',
  },
  {
    id: 'createdAt',
    align: 'center',
    label: 'matrix.table.headers.createdAt',
  },
];

type Order = 'asc' | 'desc';

interface MatrixTableHeadProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof MatrixData
  ) => void;
  order: Order;
  orderBy: string;
}

const MatrixTableHead = ({
  onRequestSort,
  order,
  orderBy,
}: MatrixTableHeadProps) => {
  const { t } = useTranslation();

  const createSortHandler =
    (property: keyof MatrixData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow sx={{ '& th': { border: 0 } }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            align={headCell.align}
            sx={{ py: 0 }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{ py: 0, ml: '1.25rem' }}
            >
              {t(headCell.label)}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right" sx={{ py: 0 }}>
          {t('matrix.table.headers.actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default MatrixTableHead;

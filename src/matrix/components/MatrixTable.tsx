import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import Empty from 'core/components/Empty';
import Matrix from 'matrix/types/Matrix';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof Matrix;
  label: string;
  align: 'center' | 'left' | 'right';
}

const headCells: HeadCell[] = [
  {
    id: 'id',
    align: 'center',
    label: 'matrixManagement.table.headers.id',
  },
  {
    id: 'name',
    align: 'center',
    label: 'matrixManagement.table.headers.name',
  },
  {
    id: 'rows',
    align: 'center',
    label: 'matrixManagement.table.headers.rows',
  },
  {
    id: 'columns',
    align: 'center',
    label: 'matrixManagement.table.headers.columns',
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Matrix
  ) => void;
  order: Order;
  orderBy: string;
}

const EnhancedTableHead = ({
  onRequestSort,
  order,
  orderBy,
}: EnhancedTableProps) => {
  const { t } = useTranslation();

  const createSortHandler =
    (property: keyof Matrix) => (event: React.MouseEvent<unknown>) => {
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
        <TableCell align="center" sx={{ py: 0 }}>
          {t('matrixManagement.table.headers.values')}
        </TableCell>
        <TableCell align="right" sx={{ py: 0 }}>
          {t('matrixManagement.table.headers.actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

type MatrixRowProps = {
  index: number;
  onDelete: (matrix: Matrix) => void;
  onEdit: (matrix: Matrix) => void;
  processing: boolean;
  matrix: Matrix;
};

const MatrixRow = ({
  index,
  onDelete,
  onEdit,
  processing,
  matrix,
}: MatrixRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const openActions = Boolean(anchorEl);

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseActions();
    onDelete(matrix);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(matrix);
  };

  return (
    <TableRow
      tabIndex={-1}
      key={matrix.id}
      sx={{ '& td': { bgcolor: 'background.paper', border: 0 } }}
    >
      <TableCell
        align="center"
        sx={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
      >
        {matrix.id}
      </TableCell>
      <TableCell align="center">{matrix.name}</TableCell>
      <TableCell align="center">{matrix.rows}</TableCell>
      <TableCell align="center">{matrix.columns}</TableCell>
      <TableCell align="center">{JSON.stringify(matrix.values)}</TableCell>

      <TableCell
        align="right"
        sx={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
      >
        <IconButton
          id="matrix-row-menu-button"
          aria-label="matrix actions"
          aria-controls="matrix-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? 'true' : 'false'}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="matrix-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="matrix-row-menu-button"
          open={openActions}
          onClose={handleCloseActions}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>{' '}
            {t('common.edit')}
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>{' '}
            {t('common.delete')}
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

type MatrixTableProps = {
  processing: boolean;
  onDelete: (matrix: Matrix) => void;
  onEdit: (matrix: Matrix) => void;
  matrices?: Matrix[];
};

const MatrixTable = ({
  onDelete,
  onEdit,
  processing,
  matrices = [],
}: MatrixTableProps) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Matrix>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    property: keyof Matrix
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  if (matrices.length === 0) {
    return <Empty title="No user yet" />;
  }

  const stringifiedMatrices = matrices.map((matrix) => {
    return { ...matrix, values: JSON.stringify(matrix.values) };
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
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(stringifiedMatrices, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((matrix, index) => {
                const parsedMatrix = {
                  ...matrix,
                  values: JSON.parse(matrix.values),
                } as Matrix;
                return (
                  <MatrixRow
                    index={index}
                    key={matrix.id}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    processing={processing}
                    matrix={parsedMatrix}
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

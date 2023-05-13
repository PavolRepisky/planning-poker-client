import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
} from '@mui/material';
import MatrixData from 'matrix/types/MatrixData';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type MatrixTableRowProps = {
  index: number;
  onDelete: (matrix: MatrixData) => void;
  onEdit: (matrix: MatrixData) => void;
  onView: (matrix: MatrixData) => void;
  processing: boolean;
  matrix: MatrixData;
};

const MatrixTableRow = ({
  index,
  onDelete,
  onEdit,
  onView,
  processing,
  matrix,
}: MatrixTableRowProps) => {
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

  const handleView = () => {
    handleCloseActions();
    onView(matrix);
  };

  const formatDate = (dateInMillis: number) => {
    const date = new Date(dateInMillis);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
        {matrix.name}
      </TableCell>
      <TableCell align="center">{matrix.rows}</TableCell>
      <TableCell align="center">{matrix.columns}</TableCell>
      <TableCell align="center">{formatDate(matrix.createdAt)}</TableCell>

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
            </ListItemIcon>
            {t('common.edit')}
          </MenuItem>

          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            {t('common.delete')}
          </MenuItem>

          <MenuItem onClick={handleView}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            {t('common.view')}
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

export default MatrixTableRow;

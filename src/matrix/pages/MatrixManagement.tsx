import { Add as AddIcon } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import ConfirmDialog from 'core/components/ConfirmDialog';
import Toolbar from 'core/components/Toolbar';
import MatrixDialog from 'matrix/components/MatrixDialog';
import MatrixTable from 'matrix/components/MatrixTable';
import { useCreateMatrix } from 'matrix/hooks/useCreateMatrix';
import { useDeleteMatrix } from 'matrix/hooks/useDeleteMatrix';
import { useGetMatrices } from 'matrix/hooks/useGetMatrices';
import { useUpdateMatrix } from 'matrix/hooks/useUpdateMatrix';
import Matrix from 'matrix/types/MatrixData';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSnackbar } from '../../core/contexts/SnackbarProvider';

const MatrixManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openMatrixDialog, setOpenMatrixDialog] = useState(false);
  const [matrixDeleted, setMatrixDeleted] = useState<Matrix | undefined>();
  const [matrixUpdated, setMatrixUpdated] = useState<Matrix | undefined>(
    undefined
  );

  const { createMatrix, isCreating } = useCreateMatrix();
  const { deleteMatrix, isDeleting } = useDeleteMatrix();
  const { isUpdating, updateMatrix } = useUpdateMatrix();
  const { data } = useGetMatrices(authToken);

  const processing = isCreating || isUpdating || isDeleting;

  const handleCreateMatrix = async (matrix: Partial<Matrix>) => {
    try {
      await createMatrix({
        matrix,
        authToken,
      });
      snackbar.success(
        t('matrix.notifications.created', {
          matrixName: matrix.name,
        })
      );
      setOpenMatrixDialog(false);
    } catch {
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  const handleDeleteMatrix = async () => {
    if (!matrixDeleted) {
      return;
    }
    try {
      await deleteMatrix({ id: matrixDeleted.id, authToken });
      setMatrixDeleted(undefined);
      setOpenConfirmDeleteDialog(false);
      snackbar.success(
        t('matrix.notifications.deleted', {
          matrixName: matrixDeleted.name,
        })
      );
    } catch {
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  const handleUpdateMatrix = async (matrix: Matrix) => {
    try {
      await updateMatrix({ matrix, authToken });
      setOpenMatrixDialog(false);
      snackbar.success(
        t('matrix.notifications.updated', {
          matrixName: matrix.name,
        })
      );
    } catch {
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleCloseMatrixDialog = () => {
    setMatrixUpdated(undefined);
    setOpenMatrixDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (matrix: Matrix) => {
    setMatrixDeleted(matrix);
    setOpenConfirmDeleteDialog(true);
  };

  const handleViewMatrix = (matrix: Matrix) => {
    navigate(`/matrices/${matrix.id}`);
  };

  const handleOpenMatrixDialog = (matrix?: Matrix) => {
    setMatrixUpdated(matrix);
    setOpenMatrixDialog(true);
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={t('matrix.toolbar.title')}>
          <Fab
            aria-label="logout"
            color="primary"
            disabled={processing}
            onClick={() => handleOpenMatrixDialog()}
            size="small"
          >
            <AddIcon />
          </Fab>
        </Toolbar>
      </AppBar>
      <MatrixTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenMatrixDialog}
        onView={handleViewMatrix}
        matrices={data}
      />
      <ConfirmDialog
        description={t('matrix.confirmations.delete')}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteMatrix}
        open={openConfirmDeleteDialog}
        title={t('common.confirmation')}
      />
      {openMatrixDialog && (
        <MatrixDialog
          onCreate={handleCreateMatrix}
          onClose={handleCloseMatrixDialog}
          onUpdate={handleUpdateMatrix}
          open={openMatrixDialog}
          processing={processing}
          matrix={matrixUpdated}
        />
      )}
    </React.Fragment>
  );
};

export default MatrixManagement;

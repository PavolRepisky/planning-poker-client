import { Add as AddIcon } from '@mui/icons-material';
import { Fab, Typography } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import ConfirmDialog from 'core/components/ConfirmDialog';
import Toolbar from 'core/components/Toolbar';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import ServerValidationError from 'core/types/ServerValidationError';
import MatrixDialog from 'matrix/components/MatrixDialog';
import MatrixTable from 'matrix/components/MatrixTable';
import { useCreateMatrix } from 'matrix/hooks/useCreateMatrix';
import { useDeleteMatrix } from 'matrix/hooks/useDeleteMatrix';
import { useGetMatrices } from 'matrix/hooks/useGetMatrices';
import { useUpdateMatrix } from 'matrix/hooks/useUpdateMatrix';
import MatrixData from 'matrix/types/MatrixData';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const MatrixHomepage = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openMatrixDialog, setOpenMatrixDialog] = useState(false);
  const [matrixDeleted, setMatrixDeleted] = useState<MatrixData | undefined>();
  const [matrixUpdated, setMatrixUpdated] = useState<MatrixData | undefined>(
    undefined
  );

  const { isCreating, createMatrix } = useCreateMatrix();
  const { isDeleting, deleteMatrix } = useDeleteMatrix();
  const { isUpdating, updateMatrix } = useUpdateMatrix();
  const { data } = useGetMatrices();

  const processing = isCreating || isUpdating || isDeleting;

  const handleCreateMatrix = async (
    matrix: Partial<MatrixData>
  ): Promise<ServerValidationError[]> => {
    try {
      await createMatrix(matrix);
      snackbar.success(
        t('matrix.notifications.created', {
          matrixName: matrix.name,
        })
      );
      setOpenMatrixDialog(false);
      return [];
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        return err.response.data.errors as ServerValidationError[];
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
      return [];
    }
  };

  const handleDeleteMatrix = async () => {
    if (!matrixDeleted) {
      return;
    }
    try {
      await deleteMatrix(matrixDeleted.id);
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

  const handleUpdateMatrix = async (
    matrix: MatrixData
  ): Promise<ServerValidationError[]> => {
    try {
      await updateMatrix(matrix);
      setOpenMatrixDialog(false);
      snackbar.success(
        t('matrix.notifications.updated', {
          matrixName: matrix.name,
        })
      );
      return [];
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        return err.response.data.errors as ServerValidationError[];
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
      return [];
    }
  };

  const handleCloseMatrixDialog = () => {
    setMatrixUpdated(undefined);
    setOpenMatrixDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (matrix: MatrixData) => {
    setMatrixDeleted(matrix);
    setOpenConfirmDeleteDialog(true);
  };

  const handleViewMatrix = (matrix: MatrixData) => {
    navigate(`/matrices/${matrix.id}`);
  };

  const handleOpenMatrixDialog = (matrix?: MatrixData) => {
    setMatrixUpdated(matrix);
    setOpenMatrixDialog(true);
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={t('matrix.toolbar.title')}>
          <Fab
            aria-label={t('matrix.dialog.add.action')}
            color="primary"
            variant="extended"
            disabled={processing}
            onClick={() => handleOpenMatrixDialog()}
            size="medium"
          >
            <Typography variant="h6" sx={{ ml: 0.75 }}>
              {t('matrix.dialog.add.action')}
            </Typography>

            <AddIcon sx={{ ml: 0.55 }} />
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
        onClose={() => setOpenConfirmDeleteDialog(false)}
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

export default MatrixHomepage;

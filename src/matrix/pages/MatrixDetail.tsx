import { Box, Button, Stack } from '@mui/material';
import AppBar from 'core/components/AppBar';
import ConfirmDialog from 'core/components/ConfirmDialog';
import Toolbar from 'core/components/Toolbar';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import ServerValidationError from 'core/types/ServerValidationError';
import MatrixDialog from 'matrix/components/MatrixDialog';
import { useDeleteMatrix } from 'matrix/hooks/useDeleteMatrix';
import { useGetMatrix } from 'matrix/hooks/useGetMatrix';
import { useUpdateMatrix } from 'matrix/hooks/useUpdateMatrix';
import MatrixData from 'matrix/types/MatrixData';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import VoteCard from 'session/components/VoteCard';

const MatrixDetail = () => {
  const navigate = useNavigate();
  const { matrixId } = useParams();
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const { data } = useGetMatrix(Number(matrixId));
  const [openMatrixDialog, setOpenMatrixDialog] = useState(false);
  const { isUpdating, updateMatrix } = useUpdateMatrix();
  const { isDeleting, deleteMatrix } = useDeleteMatrix();
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  const processing = isUpdating || isDeleting;

  useEffect(() => {
    if (!data) {
      navigate('/404');
    }
  }, [data, navigate]);

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

  const handleDeleteMatrix = async () => {
    if (!data) {
      return;
    }
    try {
      await deleteMatrix(data.id);
      snackbar.success(
        t('matrix.notifications.deleted', {
          matrixName: data.name,
        })
      );
      navigate('/matrices');
    } catch {
      setOpenConfirmDeleteDialog(false);
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={data?.name} />
      </AppBar>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button variant="outlined" onClick={() => setOpenMatrixDialog(true)}>
          {t('common.edit')}
        </Button>
        <Button
          variant="outlined"
          onClick={() => setOpenConfirmDeleteDialog(true)}
        >
          {t('common.delete')}
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          direction="column"
          spacing={{ xs: 0.5, sm: 0.75, lg: 1, xl: 1.25 }}
          sx={{ mb: { xs: 0.5, sm: 0.75, lg: 1, xl: 1.25 } }}
        >
          {data?.values.map((row, rowIdx) => {
            return (
              <Stack
                direction="row"
                key={`row[${rowIdx}]`}
                spacing={{ xs: 0.5, sm: 0.75, lg: 1, xl: 1.25 }}
              >
                {row.map((column, columnIdx) => {
                  return (
                    <VoteCard
                      value={column}
                      row={rowIdx}
                      column={columnIdx}
                      selected={false}
                      key={`value[${rowIdx},${columnIdx}]`}
                    />
                  );
                })}
              </Stack>
            );
          })}
        </Stack>
      </Box>

      {openMatrixDialog && (
        <MatrixDialog
          onCreate={() => Promise.resolve([])}
          onClose={() => setOpenMatrixDialog(false)}
          onUpdate={handleUpdateMatrix}
          open={openMatrixDialog}
          processing={processing}
          matrix={data}
        />
      )}

      <ConfirmDialog
        description={t('matrix.confirmations.delete')}
        pending={processing}
        onClose={() => setOpenConfirmDeleteDialog(false)}
        onConfirm={handleDeleteMatrix}
        open={openConfirmDeleteDialog}
        title={t('common.confirmation')}
      />
    </React.Fragment>
  );
};

export default MatrixDetail;

import { Box, Button, Grid, Stack } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import ConfirmDialog from 'core/components/ConfirmDialog';
import Toolbar from 'core/components/Toolbar';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
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
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const { matrixId } = useParams();
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const { data } = useGetMatrix(Number(matrixId), authToken);
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

  const handleUpdateMatrix = async (matrix: MatrixData) => {
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

  const handleDeleteMatrix = async () => {
    if (!data) {
      return;
    }
    try {
      await deleteMatrix({ id: data.id, authToken });
      setOpenConfirmDeleteDialog(false);
      snackbar.success(
        t('matrix.notifications.deleted', {
          matrixName: data.name,
        })
      );
      navigate('/matrices');
    } catch {
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
        <Box>
          {data?.values.map((row, rowIdx) => {
            return (
              <Grid
                key={`row[${rowIdx}]`}
                container
                spacing={{ xs: 0.5, sm: 0.75, lg: 1, xl: 1.25 }}
                sx={{ mb: 2 }}
              >
                {row.map((column, columnIdx) => {
                  return (
                    <Grid key={`rowValue[${rowIdx},${columnIdx}]`} item xs>
                      <VoteCard
                        value={column}
                        row={rowIdx}
                        column={columnIdx}
                        selected={false}
                        onClick={() => {}}
                      ></VoteCard>
                    </Grid>
                  );
                })}
              </Grid>
            );
          })}
        </Box>
      </Box>

      {openMatrixDialog && (
        <MatrixDialog
          onCreate={() => {}}
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

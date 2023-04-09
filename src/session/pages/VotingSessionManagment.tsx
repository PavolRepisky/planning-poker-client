import { Box, Button } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import Toolbar from 'core/components/Toolbar';
import { ValidationError } from 'express-validator';
import { useGetMatrices } from 'matrix/hooks/useGetMatrices';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import CreateSessionDialog from 'session/components/CreateSessionDialog';
import JoinSessionDialog from 'session/components/JoinSessionDialog';
import { useCreateSession } from 'session/hooks/useCreateSession';
import Session from 'session/types/Session';
import { useSnackbar } from '../../core/contexts/SnackbarProvider';

const VotingSessionManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const { createSession, isCreating } = useCreateSession();
  const { data } = useGetMatrices(authToken);

  const processing = isCreating;

  const handleCreateSession = async (
    session: Partial<Session>
  ): Promise<ValidationError[]> => {
    try {
      const createdSession = await createSession({
        session,
        authToken,
      });
      snackbar.success(t('session.notifications.created'));
      setOpenCreateDialog(false);

      navigate(`/sessions/${createdSession.hashId}`);
      return [];
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        return err.response.data.errors as ValidationError[];
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
      return [];
    }
  };

  const handleJoinSession = async (hashId: string) => {
    try {
      setOpenJoinDialog(false);
      navigate(`/sessions/${hashId}`);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        snackbar.error(t('session.notifications.notFound'));
        return;
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={t('session.title')}></Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          onClick={() => setOpenCreateDialog(true)}
          variant="contained"
          sx={{ mr: 2 }}
        >
          {t('session.create.title')}
        </Button>
        <Button onClick={() => setOpenJoinDialog(true)} variant="outlined">
          {t('session.join.title')}
        </Button>
      </Box>
      {openCreateDialog && (
        <CreateSessionDialog
          onCreate={handleCreateSession}
          onClose={() => setOpenCreateDialog(false)}
          open={openCreateDialog}
          processing={processing}
          matrices={data ?? []}
        />
      )}

      {openJoinDialog && (
        <JoinSessionDialog
          onJoin={handleJoinSession}
          onClose={() => setOpenJoinDialog(false)}
          open={openJoinDialog}
          processing={processing}
        />
      )}
    </React.Fragment>
  );
};

export default VotingSessionManagement;

import { Button, Grid } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import Toolbar from 'core/components/Toolbar';
import { useGetMatrices } from 'matrix/hooks/useGetMatrices';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateSessionModal from 'session/components/CreateSessionDialog';
import JoinSessionModal from 'session/components/JoinSessionDialog';

const SessionHomepage = () => {
  const { t } = useTranslation();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const { data } = useGetMatrices();

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={t('session.homepage.title')}></Toolbar>
      </AppBar>

      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" onClick={() => setOpenCreateModal(true)}>
            {t('session.homepage.create')}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => setOpenJoinModal(true)}>
            {t('session.homepage.join')}
          </Button>
        </Grid>
      </Grid>

      {openCreateModal && (
        <CreateSessionModal
          onClose={() => setOpenCreateModal(false)}
          open={openCreateModal}
          matrices={data ?? []}
        />
      )}

      {openJoinModal && (
        <JoinSessionModal
          onClose={() => setOpenJoinModal(false)}
          open={openJoinModal}
        />
      )}
    </React.Fragment>
  );
};

export default SessionHomepage;

import { Button, Grid } from '@mui/material';
import AppBar from 'core/components/AppBar';
import Toolbar from 'core/components/Toolbar';
import { useGetMatrices } from 'matrix/hooks/useGetMatrices';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateSessionDialog from 'session/components/CreateSessionDialog';
import JoinSessionDialog from 'session/components/JoinSessionDialog';

const SessionHomepage = () => {
  const { t } = useTranslation();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const { data } = useGetMatrices();

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={t('session.homepage.title')}></Toolbar>
      </AppBar>

      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" onClick={() => setOpenCreateDialog(true)}>
            {t('session.homepage.create')}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => setOpenJoinDialog(true)}>
            {t('session.homepage.join')}
          </Button>
        </Grid>
      </Grid>

      {openCreateDialog && (
        <CreateSessionDialog
          onClose={() => setOpenCreateDialog(false)}
          open={openCreateDialog}
          matrices={data ?? []}
        />
      )}

      {openJoinDialog && (
        <JoinSessionDialog
          onClose={() => setOpenJoinDialog(false)}
          open={openJoinDialog}
        />
      )}
    </React.Fragment>
  );
};

export default SessionHomepage;

import { Box, Typography } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import BoxedLayout from 'core/components/BoxedLayout';
import Toolbar from 'core/components/Toolbar';
import MatrixData from 'matrix/types/MatrixData';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import GuestForm from 'session/components/GuestForm';
import VotingSession from 'session/components/VotingSession';
import { useJoinSession } from 'session/hooks/useJoinSession';
import SessionData from 'session/types/SessionData';

const SessionJoinManager = () => {
  const { userData, authToken } = useAuth();
  const { t } = useTranslation();
  const { hashId } = useParams();
  const navigate = useNavigate();
  const { isJoining, joinSession } = useJoinSession();
  const [data, setData] = useState<{
    session: SessionData;
    matrix: MatrixData;
  }>();

  const [guestUserData, setGuestUserData] = useState<{
    firstName: string;
    lastName: string;
  }>();

  const userLoggedIn = userData !== undefined;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await joinSession({ hashId: hashId ?? '', authToken });
        setData(response);
      } catch {
        navigate('/404');
      }
    }
    fetchData();
  }, []);

  if (!data) {
    return null;
  }

  if (!userLoggedIn) {
    if (!guestUserData) {
      return (
        <BoxedLayout maxWidth="xs">
          <Typography component="h1" variant="h4">
            {t('session.join.guest.title')}
          </Typography>

          <GuestForm
            onSubmit={(formData: { firstName: string; lastName: string }) =>
              setGuestUserData(formData)
            }
          />
        </BoxedLayout>
      );
    }
    return (
      <BoxedLayout title={data.session.name}>
        <Box sx={{ width: '100%' }}>
          <VotingSession
            session={data.session}
            matrix={data.matrix}
            user={{
              firstName: guestUserData.firstName,
              lastName: guestUserData.lastName,
              loggedIn: false,
            }}
          />
        </Box>
      </BoxedLayout>
    );
  }

  const user = {
    id: userData.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    loggedIn: userLoggedIn,
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={data.session.name}></Toolbar>
      </AppBar>
      <VotingSession session={data.session} matrix={data.matrix} user={user} />
    </React.Fragment>
  );
};

export default SessionJoinManager;

import { PersonAddAlt1 as PresonAddIcon } from '@mui/icons-material';
import { Box, Fab, Typography } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import BoxedLayout from 'core/components/BoxedLayout';
import Toolbar from 'core/components/Toolbar';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import { useLocalStorage } from 'core/hooks/useLocalStorage';
import MatrixData from 'matrix/types/MatrixData';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import SocketClient from 'session/classes/SocketClient';
import GuestForm from 'session/components/GuestForm';
import VotingSession from 'session/components/VotingSession';
import { useJoinSession } from 'session/hooks/useJoinSession';
import SessionData from 'session/types/SessionData';
import SocketSessionUserData from 'session/types/SocketSessionUserData';
import { v4 } from 'uuid';

const SessionJoinManager = () => {
  const { userData } = useAuth();
  const { t } = useTranslation();
  const { hashId } = useParams();
  const navigate = useNavigate();
  const { joinSession } = useJoinSession();
  const socketClient = SocketClient.getInstance();
  const snackbar = useSnackbar();

  const [connectionId, setSocketConnectionId] = useLocalStorage<string>(
    'connectionId',
    ''
  );

  const [data, setData] = useState<{
    session: SessionData;
    matrix: MatrixData;
  }>();

  const [guestUserData, setGuestUserData] = useState<{
    firstName: string;
    lastName: string;
  }>();

  const userLoggedIn = userData !== undefined;

  const handleSetUserData = (socketUserData: SocketSessionUserData | null) => {
    if (socketUserData) {
      setGuestUserData({
        firstName: socketUserData.firstName,
        lastName: socketUserData.lastName,
      });
    } else {
      setSocketConnectionId(v4());
    }

    socketClient.disconnect();
  };

  const copyToClipboard = async (textToCopy: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      console.log('else run');
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;

      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }
  };

  const handleInvitePlayers = async () => {
    try {
      if (!hashId) {
        throw Error('No hash id found');
      }
      await copyToClipboard(hashId);
      snackbar.success(t('session.invite.notifications.success'));
    } catch {
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await joinSession(hashId ?? '');
        setData(response);
      } catch {
        navigate('/404');
        return;
      }
    }
    fetchData();

    if (userData) {
      return;
    }

    if (connectionId) {
      socketClient.connect();
      socketClient.getUserData(hashId ?? '', connectionId, handleSetUserData);
    } else {
      setSocketConnectionId(v4());
    }
  }, []);

  if (!data) {
    return null;
  }

  const InviteButton = () => {
    return (
      <Fab
        aria-label={t('session.invite.title')}
        color="primary"
        variant="extended"
        onClick={handleInvitePlayers}
        size="medium"
      >
        <Typography variant="h6" sx={{ ml: 0.5 }}>
          {t('session.invite.title')}
        </Typography>

        <PresonAddIcon sx={{ ml: 1 }} />
      </Fab>
    );
  };

  if (!userLoggedIn) {
    if (!guestUserData) {
      return (
        <BoxedLayout maxWidth="xs">
          <Typography component="h1" variant="h4">
            {t('session.join.guest.title')}
          </Typography>

          <GuestForm
            onSubmit={(formData: { firstName: string; lastName: string }) => {
              setGuestUserData(formData);
              socketClient.disconnect();
            }}
          />
        </BoxedLayout>
      );
    }
    return (
      <BoxedLayout>
        <Box
          sx={{ width: '100%', display: 'flex', alignItem: 'center', mb: 3 }}
          textAlign="left"
        >
          <Typography variant="h2" component="h1" sx={{ flexGrow: 1 }}>
            {data.session.name}
          </Typography>
          <InviteButton />
        </Box>
        <Box sx={{ width: '100%' }}>
          <VotingSession
            session={data.session}
            matrix={data.matrix}
            user={{
              firstName: guestUserData.firstName,
              lastName: guestUserData.lastName,
              loggedIn: false,
              connectionId: connectionId,
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
    connectionId: userData.id,
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={data.session.name}>
          <InviteButton />
        </Toolbar>
      </AppBar>
      <VotingSession session={data.session} matrix={data.matrix} user={user} />
    </React.Fragment>
  );
};

export default SessionJoinManager;

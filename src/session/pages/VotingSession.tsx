import { Box, Button, Grid } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import Toolbar from 'core/components/Toolbar';
import socket from 'core/config/socket';
import { useGetMatrix } from 'matrix/hooks/useGetMatrix';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import VoteCard from 'session/components/VoteCard';
import { useJoinSession } from 'session/hooks/useJoinSession';
import { useSnackbar } from '../../core/contexts/SnackbarProvider';

const VotingSession = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const { authToken, userInfo } = useAuth();
  const navigate = useNavigate();

  const { hashId } = useParams();
  const { data } = useJoinSession({ hashId: hashId ?? '', authToken });
  if (!data) {
    navigate('/login');
  }
  const { data: matrixData } = useGetMatrix(data?.matrixId ?? -1, authToken);

  const handleVote = (value: string) => {
    socket.emit('vote', value);
  };

  useEffect(() => {
    socket.connect();

    socket.emit('joinSession', {
      sessionId: data?.hashId,
      sessionName: data?.name,
      user: { firstName: userInfo?.firstName, lastName: userInfo?.lastName },
    });

    socket.on('users', (users) => {
      console.log(`on users: ${users}`);
      setUsers(users);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={data?.name}></Toolbar>
      </AppBar>

      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 2 }}
      >
        {users.map((user: any) => {
          return (
            <Grid item>
              <VoteCard
                firstName={user.firstName}
                lastName={user.lastName}
                vote={user.vote}
                showResults={false}
              />
            </Grid>
          );
        })}
      </Grid>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'end',
          alignItems: 'center',
          width: '100%',
          mt: 'auto',
        }}
      >
        <Box>
          {matrixData?.values.map((row) => {
            return (
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                {row.map((value) => {
                  return (
                    <Button
                      variant="outlined"
                      onClick={() => handleVote(value)}
                      sx={{
                        width: '60px',
                        height: '60px',
                        whiteSpace: 'normal',
                        overflow: 'auto',
                        ml: 1,
                        mb: 1,
                        wordWrap: 'break-word',
                      }}
                    >
                      {value}
                    </Button>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default VotingSession;
